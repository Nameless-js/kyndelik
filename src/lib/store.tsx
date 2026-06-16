"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Opportunity, Course, MOCK_COURSES, MOCK_OPPORTUNITIES } from "./data";

export type UserProfile = {
  name: string;
  grade: string;
  interests: string[];
  goals: string;
};

export type CourseProgress = {
  courseId: string;
  completedLessons: string[];
};

interface AppContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  savedOpportunities: string[];
  toggleSaveOpportunity: (id: string) => void;
  enrolledCourses: CourseProgress[];
  enrollCourse: (id: string) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  getRecommendedOpportunities: () => Opportunity[];
  getRecommendedCourses: () => Course[];
  opportunities: Opportunity[];
  setOpportunities: (opps: Opportunity[]) => void;
  courses: Course[];
  setCourses: (courses: Course[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseProgress[]>([]);
  
  // Admin-managed state (mocking DB)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Load from local storage
  useEffect(() => {
    const p = localStorage.getItem("mentoria_profile");
    if (p) setProfileState(JSON.parse(p));
    
    const saved = localStorage.getItem("mentoria_saved_opps");
    if (saved) setSavedOpportunities(JSON.parse(saved));
    
    const enrolled = localStorage.getItem("mentoria_enrolled");
    if (enrolled) setEnrolledCourses(JSON.parse(enrolled));

    const localOpps = localStorage.getItem("mentoria_admin_opps");
    if (localOpps) setOpportunities(JSON.parse(localOpps));
    else setOpportunities(MOCK_OPPORTUNITIES);

    const localCourses = localStorage.getItem("mentoria_admin_courses");
    if (localCourses) setCourses(JSON.parse(localCourses));
    else setCourses(MOCK_COURSES);
  }, []);

  const setProfile = (p: UserProfile) => {
    setProfileState(p);
    localStorage.setItem("mentoria_profile", JSON.stringify(p));
  };

  const toggleSaveOpportunity = (id: string) => {
    setSavedOpportunities(prev => {
      const newSaved = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("mentoria_saved_opps", JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const enrollCourse = (id: string) => {
    setEnrolledCourses(prev => {
      if (prev.find(c => c.courseId === id)) return prev;
      const newEnrolled = [...prev, { courseId: id, completedLessons: [] }];
      localStorage.setItem("mentoria_enrolled", JSON.stringify(newEnrolled));
      return newEnrolled;
    });
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setEnrolledCourses(prev => {
      const newEnrolled = prev.map(c => {
        if (c.courseId === courseId && !c.completedLessons.includes(lessonId)) {
          return { ...c, completedLessons: [...c.completedLessons, lessonId] };
        }
        return c;
      });
      localStorage.setItem("mentoria_enrolled", JSON.stringify(newEnrolled));
      return newEnrolled;
    });
  };

  const getRecommendedOpportunities = () => {
    if (!profile) return opportunities.slice(0, 3);
    // Simple mock logic: match field to interests
    const matches = opportunities.filter(o => 
      profile.interests.includes(o.field) || profile.grade === o.grade
    );
    return matches.length > 0 ? matches : opportunities.slice(0, 3);
  };

  const getRecommendedCourses = () => {
    if (!profile) return courses.slice(0, 2);
    // Mock logic: return courses user is not enrolled in
    const unenrolled = courses.filter(c => !enrolledCourses.find(ec => ec.courseId === c.id));
    return unenrolled.slice(0, 2);
  };

  const updateOpportunities = (opps: Opportunity[]) => {
      setOpportunities(opps);
      localStorage.setItem("mentoria_admin_opps", JSON.stringify(opps));
  }

  const updateCourses = (crs: Course[]) => {
      setCourses(crs);
      localStorage.setItem("mentoria_admin_courses", JSON.stringify(crs));
  }

  return (
    <AppContext.Provider value={{
      profile, setProfile,
      savedOpportunities, toggleSaveOpportunity,
      enrolledCourses, enrollCourse, markLessonComplete,
      getRecommendedOpportunities, getRecommendedCourses,
      opportunities, setOpportunities: updateOpportunities,
      courses, setCourses: updateCourses
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
