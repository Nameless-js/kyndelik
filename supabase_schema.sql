-- Run this script in your Supabase SQL Editor to initialize the database

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT,
  interests TEXT[],
  goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Opportunities Table
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  format TEXT NOT NULL,
  deadline DATE NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  field TEXT NOT NULL,
  grade TEXT,
  link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Admins can manage opportunities" ON opportunities FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE true));

-- 3. Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Admins can manage courses" ON courses FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE true));

-- 4. Lessons Table
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  video_url TEXT,
  order_num INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Admins can manage lessons" ON lessons FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE true));

-- 5. User Saved Opportunities
CREATE TABLE user_saved_opportunities (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, opportunity_id)
);

ALTER TABLE user_saved_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their saved opportunities" ON user_saved_opportunities FOR ALL USING (auth.uid() = user_id);

-- 6. User Enrolled Courses
CREATE TABLE user_enrolled_courses (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, course_id)
);

ALTER TABLE user_enrolled_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their enrolled courses" ON user_enrolled_courses FOR ALL USING (auth.uid() = user_id);

-- 7. Insert Mock Data for Opportunities (10 examples)
INSERT INTO opportunities (id, title, category, format, deadline, description, requirements, field, grade, link)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Global Business Challenge', 'competition', 'online', '2026-08-01', 'Глобальный конкурс для старшеклассников по созданию стартапов.', ARRAY['High school student'], 'business', '9-12', '#'),
  ('00000000-0000-0000-0000-000000000002', 'STEM Summer Research', 'program', 'hybrid', '2026-07-15', 'Интенсивная летняя программа в лабораториях ведущего университета.', ARRAY['Grade 10-11'], 'science', '10-11', '#'),
  ('00000000-0000-0000-0000-000000000003', 'Tech Innovators Scholarship', 'scholarship', 'online', '2026-09-30', 'Стипендия для студентов компьютерных наук.', ARRAY['Graduating senior'], 'programming', '12', '#'),
  ('00000000-0000-0000-0000-000000000004', 'Social Impact Summit', 'program', 'offline', '2026-08-20', 'Трехдневный саммит для молодых лидеров.', ARRAY['Age 15-18'], 'social', '9-12', '#'),
  ('00000000-0000-0000-0000-000000000005', 'FinStart Olympiad', 'competition', 'online', '2026-10-10', 'Олимпиада по финансовой грамотности.', ARRAY['8-11 класс'], 'finance', '8-11', '#'),
  ('00000000-0000-0000-0000-000000000006', 'Hackathon "Code for Future"', 'competition', 'hybrid', '2026-11-05', 'Хакатон для школьников. ИИ за 48 часов.', ARRAY['Python'], 'programming', '9-12', '#'),
  ('00000000-0000-0000-0000-000000000007', 'Silicon Valley Leadership', 'program', 'offline', '2026-12-01', 'Поездка в Кремниевую Долину.', ARRAY['English'], 'business', '10-12', '#'),
  ('00000000-0000-0000-0000-000000000008', 'Biology Scholarship', 'scholarship', 'online', '2027-01-15', 'Покрытие расходов для талантов в биологии.', ARRAY['Олимпиады'], 'science', '11-12', '#'),
  ('00000000-0000-0000-0000-000000000009', 'RoboCamp', 'program', 'offline', '2026-06-25', 'Инженерный лагерь по созданию роботов.', ARRAY['Возраст 12-16'], 'stem', '7-10', '#'),
  ('00000000-0000-0000-0000-000000000010', 'UN Climate Essay', 'competition', 'online', '2026-09-10', 'Эссе на тему изменения климата.', ARRAY['English'], 'social', '9-12', '#');

-- 8. Insert Mock Data for Courses
INSERT INTO courses (id, title, description, level, category)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Английский для академического успеха', 'Курс для улучшения навыков академического письма.', 'intermediate', 'english'),
  ('22222222-2222-2222-2222-222222222222', 'Основы математики', 'Фундаментальный курс по математике.', 'beginner', 'math'),
  ('33333333-3333-3333-3333-333333333333', 'Основы информатики', 'Введение в Python.', 'beginner', 'cs');

-- 9. Insert Lessons for Courses (Using text IDs "l1", "l2", "l3" to match quiz block logic)
INSERT INTO lessons (id, course_id, title, duration, order_num)
VALUES 
  ('l1', '11111111-1111-1111-1111-111111111111', 'Структура эссе', '10 min', 1),
  ('l2', '11111111-1111-1111-1111-111111111111', 'Академическая лексика', '15 min', 2),
  ('l3', '11111111-1111-1111-1111-111111111111', 'Чтение научных статей', '20 min', 3),
  
  ('m1', '22222222-2222-2222-2222-222222222222', 'Введение в алгебру', '15 min', 1),
  ('m2', '22222222-2222-2222-2222-222222222222', 'Уравнения и неравенства', '20 min', 2),
  ('m3', '22222222-2222-2222-2222-222222222222', 'Основы геометрии', '25 min', 3),
  
  ('c1', '33333333-3333-3333-3333-333333333333', 'Что такое алгоритм?', '12 min', 1),
  ('c2', '33333333-3333-3333-3333-333333333333', 'Переменные и типы данных', '18 min', 2),
  ('c3', '33333333-3333-3333-3333-333333333333', 'Циклы и условия', '22 min', 3);
