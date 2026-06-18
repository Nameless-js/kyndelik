"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Opportunity, Course, MOCK_COURSES, MOCK_OPPORTUNITIES } from "./data";
import { supabase } from "./supabase";

export interface UserProfile {
  id?: string;
  name: string;
  grade: string;
  interests: string[];
  goals: string;
  role?: "student" | "mentor" | "admin";
};

export type CourseProgress = {
  courseId: string;
  completedLessons: string[];
};

interface AppContextType {
  user: any | null;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => Promise<void>;
  savedOpportunities: string[];
  toggleSaveOpportunity: (id: string) => Promise<void>;
  enrolledCourses: CourseProgress[];
  enrollCourse: (id: string) => Promise<void>;
  markLessonComplete: (courseId: string, lessonId: string) => Promise<void>;
  getRecommendedOpportunities: () => Opportunity[];
  getRecommendedCourses: () => Course[];
  opportunities: Opportunity[];
  setOpportunities: (opps: Opportunity[]) => Promise<void>;
  courses: Course[];
  setCourses: (courses: Course[]) => Promise<void>;
  addLesson: (courseId: string, lesson: any) => Promise<void>;
  addQuestion: (courseId: string, lessonId: string, question: any) => Promise<void>;
  updateLessonVideoUrl: (courseId: string, lessonId: string, videoUrl: string) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [opportunities, setOpportunitiesState] = useState<Opportunity[]>([]);
  const [courses, setCoursesState] = useState<Course[]>([]);

  useEffect(() => {
    // Supabase Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsAuthLoaded(true);
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setIsAuthLoaded(true);
    });

    // Load static data (Opportunities and Courses)
    // For MVP we can fall back to mocks if DB is empty
    const fetchPublicData = async () => {
      const { data: dbOpps } = await supabase.from('opportunities').select('*');
      if (dbOpps && dbOpps.length > 0) setOpportunitiesState(dbOpps as Opportunity[]);
      else setOpportunitiesState(MOCK_OPPORTUNITIES);

      const { data: dbCourses } = await supabase.from('courses').select('*');
      if (dbCourses && dbCourses.length > 0) {
        // Also fetch lessons and questions
        const { data: dbLessons } = await supabase.from('lessons').select('*');
        const { data: dbQuestions } = await supabase.from('questions').select('*');
        const formattedCourses = dbCourses.map(c => ({
          ...c,
          lessons: dbLessons
            ? dbLessons
                .filter(l => l.course_id === c.id)
                .sort((a, b) => a.order_num - b.order_num)
                .map(l => ({
                  ...l,
                  videoUrl: l.video_url ?? undefined,
                  questions: dbQuestions
                    ? dbQuestions
                        .filter(q => q.lesson_id === l.id)
                        .sort((a, b) => a.order_num - b.order_num)
                        .map(q => ({
                          id: q.id,
                          text: q.text,
                          options: q.options,
                          correctIndex: q.correct_index,
                          explanation: q.explanation,
                        }))
                    : [],
                }))
            : [],
        }));
        setCoursesState(formattedCourses as unknown as Course[]);
      }
      else setCoursesState(MOCK_COURSES);
    };

    fetchPublicData();

    return () => subscription.unsubscribe();
  }, []);

  // Fetch User Data when auth changes
  useEffect(() => {
    if (!isAuthLoaded) return; // Wait until auth state is known

    if (!user) {
      Promise.resolve().then(() => {
        setProfileState(null);
        setSavedOpportunities([]);
        setEnrolledCourses([]);
        setIsLoading(false);
      });
      return;
    }

    const fetchUserData = async () => {
      // Fetch profile
      const { data: prof, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error && error.code !== 'PGRST116') {
         console.error("Error fetching profile:", error);
      }
      if (prof) setProfileState(prof);

      // Fetch saved opps
      const { data: saved } = await supabase.from('user_saved_opportunities').select('opportunity_id').eq('user_id', user.id);
      if (saved) setSavedOpportunities(saved.map(s => s.opportunity_id));

      // Fetch enrolled courses
      const { data: enrolled, error: enrollError } = await supabase.from('user_enrolled_courses').select('course_id, completed_lessons').eq('user_id', user.id);
      if (enrolled) setEnrolledCourses(enrolled.map(e => ({ courseId: e.course_id, completedLessons: e.completed_lessons || [] })));

      setIsLoading(false);
    };

    fetchUserData();
  }, [user]);

  const setProfile = async (p: UserProfile) => {
    setProfileState(p);
    
    // Ensure we have the absolute latest session directly from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user || user;

    if (currentUser) {
      const { error } = await supabase.from('profiles').upsert({
        id: currentUser.id,
        name: p.name,
        grade: p.grade,
        interests: p.interests,
        goals: p.goals
      });
      if (error) {
        console.error("Error saving profile to DB:", error);
        alert("Ошибка при сохранении профиля в БД: " + error.message);
      } else {
        console.log("Profile successfully saved to DB!");
      }
    } else {
      console.error("Cannot save profile to DB because user is null in store!");
      alert("Ошибка: Вы не авторизованы. Профиль не сохранен.");
    }
  };

  const toggleSaveOpportunity = async (id: string) => {
    const isSaved = savedOpportunities.includes(id);
    const newSaved = isSaved ? savedOpportunities.filter(x => x !== id) : [...savedOpportunities, id];
    setSavedOpportunities(newSaved);
    
    if (user) {
      if (isSaved) {
        await supabase.from('user_saved_opportunities').delete().match({ user_id: user.id, opportunity_id: id });
      } else {
        await supabase.from('user_saved_opportunities').insert({ user_id: user.id, opportunity_id: id });
      }
    }
  };

  const enrollCourse = async (id: string) => {
    if (enrolledCourses.find(c => c.courseId === id)) return;
    const newEnrolled = [...enrolledCourses, { courseId: id, completedLessons: [] }];
    setEnrolledCourses(newEnrolled);
    
    if (user) {
      await supabase.from('user_enrolled_courses').insert({ user_id: user.id, course_id: id });
    }
  };

  const markLessonComplete = async (courseId: string, lessonId: string) => {
    let updatedEnrolled: CourseProgress[] = [];
    setEnrolledCourses(prev => {
      updatedEnrolled = prev.map(c => {
        if (c.courseId === courseId && !c.completedLessons.includes(lessonId)) {
          return { ...c, completedLessons: [...c.completedLessons, lessonId] };
        }
        return c;
      });
      return updatedEnrolled;
    });

    if (user) {
      const target = updatedEnrolled.find(c => c.courseId === courseId);
      if (target) {
        await supabase.from('user_enrolled_courses')
          .update({ completed_lessons: target.completedLessons })
          .eq('user_id', user.id)
          .eq('course_id', courseId);
      }
    }
  };

  const getRecommendedOpportunities = () => {
    if (!profile) return opportunities.slice(0, 3);
    const matches = opportunities.filter(o => 
      profile.interests.includes(o.field) || profile.grade === o.grade
    );
    return matches.length > 0 ? matches : opportunities.slice(0, 3);
  };

  const getRecommendedCourses = () => {
    if (!profile) return courses.slice(0, 2);
    const unenrolled = courses.filter(c => !enrolledCourses.find(ec => ec.courseId === c.id));
    return unenrolled.slice(0, 2);
  };

  const setOpportunities = async (opps: Opportunity[]) => {
      setOpportunitiesState(opps);
  }

  const setCourses = async (crs: Course[]) => {
    // Find newly added courses (ones not in current state)
    const currentIds = courses.map(c => c.id);
    const newCourses = crs.filter(c => !currentIds.includes(c.id));

    setCoursesState(crs);

    // Insert new courses into Supabase
    for (const nc of newCourses) {
      const { data, error } = await supabase.from('courses').insert({
        title: nc.title,
        description: nc.description,
        level: nc.level,
        category: nc.category,
      }).select();

      if (error) {
        console.error("Error inserting course:", error);
      } else if (data && data[0]) {
        // Update the local state with the real UUID from Supabase
        setCoursesState(prev => prev.map(c =>
          c.id === nc.id ? { ...c, id: data[0].id } : c
        ));
      }
    }
  }

  const addLesson = async (courseId: string, lesson: any) => {
    // Find the course to determine the order number
    const course = courses.find(c => c.id === courseId);
    const orderNum = course ? course.lessons.length + 1 : 1;

    setCoursesState(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, lessons: [...c.lessons, lesson] };
      }
      return c;
    }));

    // Insert into Supabase
    const { error } = await supabase.from('lessons').insert({
      id: lesson.id,
      course_id: courseId,
      title: lesson.title,
      duration: lesson.duration,
      video_url: lesson.videoUrl ?? null,
      order_num: orderNum,
    });

    if (error) {
      console.error("Error inserting lesson:", error);
    }
  };

  const addQuestion = async (courseId: string, lessonId: string, question: any) => {
    // Find the lesson to determine the order number
    const course = courses.find(c => c.id === courseId);
    const lesson = course?.lessons.find(l => l.id === lessonId);
    const orderNum = lesson?.questions ? lesson.questions.length + 1 : 1;

    setCoursesState(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          lessons: c.lessons.map(l => {
            if (l.id === lessonId) {
              return { ...l, questions: [...(l.questions || []), question] };
            }
            return l;
          })
        };
      }
      return c;
    }));

    // Insert into Supabase
    const { error } = await supabase.from('questions').insert({
      id: question.id,
      lesson_id: lessonId,
      text: question.text,
      options: question.options,
      correct_index: question.correctIndex,
      explanation: question.explanation,
      order_num: orderNum,
    });

    if (error) {
      console.error("Error inserting question:", error);
    }
  };

  const updateLessonVideoUrl = async (courseId: string, lessonId: string, videoUrl: string) => {
    // Update local state immediately
    setCoursesState(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        lessons: c.lessons.map(l =>
          l.id === lessonId ? { ...l, videoUrl: videoUrl || undefined } : l
        ),
      };
    }));

    // Persist to Supabase
    const { error } = await supabase
      .from('lessons')
      .update({ video_url: videoUrl || null })
      .eq('id', lessonId);

    if (error) {
      console.error('Error updating video_url:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      user, profile, setProfile,
      savedOpportunities, toggleSaveOpportunity,
      enrolledCourses, enrollCourse, markLessonComplete,
      getRecommendedOpportunities, getRecommendedCourses,
      opportunities, setOpportunities,
      courses, setCourses,
      addLesson, addQuestion, updateLessonVideoUrl,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
