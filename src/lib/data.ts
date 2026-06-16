export type Opportunity = {
  id: string;
  title: string;
  category: "competition" | "program" | "scholarship";
  format: "online" | "offline" | "hybrid";
  deadline: string;
  description: string;
  requirements: string[];
  field: "business" | "stem" | "social" | "finance" | "programming" | "science";
  grade: string;
  link: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  category: "math" | "science" | "business" | "cs" | "english" | "test_prep";
  lessons: {
    id: string;
    title: string;
    duration: string;
    videoUrl?: string;
  }[];
};

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Global Business Challenge",
    category: "competition",
    format: "online",
    deadline: "2026-08-01",
    description: "A global competition for high school students to pitch startup ideas.",
    requirements: ["High school student", "Team of 2-4", "Business plan"],
    field: "business",
    grade: "9-12",
    link: "#"
  },
  {
    id: "opp-2",
    title: "STEM Summer Research Program",
    category: "program",
    format: "hybrid",
    deadline: "2026-07-15",
    description: "An intensive summer research program at a top university.",
    requirements: ["Grade 10-11", "Strong academic record in science"],
    field: "science",
    grade: "10-11",
    link: "#"
  },
  {
    id: "opp-3",
    title: "Tech Innovators Scholarship",
    category: "scholarship",
    format: "online",
    deadline: "2026-09-30",
    description: "Scholarship for students planning to study computer science.",
    requirements: ["Graduating senior", "Portfolio of coding projects"],
    field: "programming",
    grade: "12",
    link: "#"
  },
  {
    id: "opp-4",
    title: "Social Impact Youth Summit",
    category: "program",
    format: "offline",
    deadline: "2026-08-20",
    description: "A 3-day summit for young leaders driving social change.",
    requirements: ["Age 15-18", "Demonstrated leadership"],
    field: "social",
    grade: "9-12",
    link: "#"
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Основы математики",
    description: "Фундаментальный курс по математике для подготовки к олимпиадам и экзаменам.",
    level: "beginner",
    category: "math",
    lessons: [
      { id: "l1", title: "Введение в алгебру", duration: "15 min" },
      { id: "l2", title: "Уравнения и неравенства", duration: "20 min" },
      { id: "l3", title: "Основы геометрии", duration: "25 min" }
    ]
  },
  {
    id: "course-2",
    title: "Английский для академического успеха",
    description: "Курс для улучшения навыков академического письма и чтения.",
    level: "intermediate",
    category: "english",
    lessons: [
      { id: "l1", title: "Структура эссе", duration: "10 min" },
      { id: "l2", title: "Академическая лексика", duration: "15 min" },
      { id: "l3", title: "Чтение научных статей", duration: "20 min" }
    ]
  },
  {
    id: "course-3",
    title: "Основы информатики",
    description: "Введение в программирование на Python и алгоритмы.",
    level: "beginner",
    category: "cs",
    lessons: [
      { id: "l1", title: "Что такое алгоритм?", duration: "12 min" },
      { id: "l2", title: "Переменные и типы данных", duration: "18 min" },
      { id: "l3", title: "Циклы и условия", duration: "22 min" }
    ]
  }
];
