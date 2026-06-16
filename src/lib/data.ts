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
    description: "Глобальный конкурс для старшеклассников по созданию и презентации стартап-идей перед инвесторами.",
    requirements: ["Ученик старших классов", "Команда 2-4 человека", "Бизнес-план"],
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
    description: "Интенсивная летняя исследовательская программа в лабораториях ведущего университета.",
    requirements: ["10-11 класс", "Высокие оценки по научным дисциплинам"],
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
    description: "Стипендия для будущих студентов факультетов компьютерных наук и инженерии.",
    requirements: ["Выпускник школы", "Портфолио проектов по программированию"],
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
    description: "Трехдневный саммит для молодых лидеров, стремящихся внести социальные изменения в своих сообществах.",
    requirements: ["Возраст 15-18 лет", "Опыт волонтерства"],
    field: "social",
    grade: "9-12",
    link: "#"
  },
  {
    id: "opp-5",
    title: "Финансовая Олимпиада 'FinStart'",
    category: "competition",
    format: "online",
    deadline: "2026-10-10",
    description: "Национальная олимпиада по финансовой грамотности с денежными призами.",
    requirements: ["Интерес к финансам", "8-11 класс"],
    field: "finance",
    grade: "8-11",
    link: "#"
  },
  {
    id: "opp-6",
    title: "Hackathon 'Code for Future'",
    category: "competition",
    format: "hybrid",
    deadline: "2026-11-05",
    description: "Крупнейший хакатон для школьников. Разработка ИИ решений за 48 часов.",
    requirements: ["Базовые знания Python", "Возраст 14-18 лет"],
    field: "programming",
    grade: "9-12",
    link: "#"
  },
  {
    id: "opp-7",
    title: "Программа Лидерства в Кремниевой Долине",
    category: "program",
    format: "offline",
    deadline: "2026-12-01",
    description: "Поездка в Кремниевую Долину для знакомства с культурой топовых IT корпораций (Google, Meta).",
    requirements: ["Знание английского языка", "Прохождение интервью"],
    field: "business",
    grade: "10-12",
    link: "#"
  },
  {
    id: "opp-8",
    title: "Стипендия для молодых биологов",
    category: "scholarship",
    format: "online",
    deadline: "2027-01-15",
    description: "Покрытие расходов на обучение для школьников, показавших выдающиеся результаты в биологии.",
    requirements: ["Победы в олимпиадах по биологии", "Рекомендательное письмо"],
    field: "science",
    grade: "11-12",
    link: "#"
  },
  {
    id: "opp-9",
    title: "Инженерный лагерь 'RoboCamp'",
    category: "program",
    format: "offline",
    deadline: "2026-06-25",
    description: "Двухнедельный лагерь по созданию роботов на базе Arduino и Raspberry Pi.",
    requirements: ["Возраст 12-16 лет", "Любовь к изобретательству"],
    field: "stem",
    grade: "7-10",
    link: "#"
  },
  {
    id: "opp-10",
    title: "Эссе-конкурс ООН по изменению климата",
    category: "competition",
    format: "online",
    deadline: "2026-09-10",
    description: "Конкурс на лучшее эссе на английском языке, победители поедут на конференцию ООН.",
    requirements: ["Отличное знание английского", "Глубокое понимание проблемы"],
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
