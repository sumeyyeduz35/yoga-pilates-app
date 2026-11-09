export type AchievementCategory =
  | 'beginner'
  | 'streak'
  | 'yoga'
  | 'pilates'
  | 'reformer'
  | 'exercise'
  | 'water'
  | 'nutrition'
  | 'goals';

export type AchievementMetric =
  | 'completed_sessions'
  | 'exercise_streak'
  | 'yoga_sessions'
  | 'pilates_sessions'
  | 'reformer_sessions'
  | 'exercise_minutes'
  | 'water_goal_days'
  | 'meal_entries'
  | 'completed_goals';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  metric: AchievementMetric;
  target: number;
  icon: string;
  color: string;
  backgroundColor: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'İlk Adım',
    description: 'İlk egzersiz seansını tamamla.',
    category: 'beginner',
    metric: 'completed_sessions',
    target: 1,
    icon: 'flower-outline',
    color: '#658F73',
    backgroundColor: '#E7F0E9',
  },
  {
    id: 'three-day-streak',
    title: 'Ritmini Buldun',
    description: '3 gün üst üste egzersiz yap.',
    category: 'streak',
    metric: 'exercise_streak',
    target: 3,
    icon: 'flame-outline',
    color: '#D99A58',
    backgroundColor: '#FFF0DC',
  },
  {
    id: 'seven-day-streak',
    title: '7 Günlük Seri',
    description: '7 gün üst üste egzersiz yap.',
    category: 'streak',
    metric: 'exercise_streak',
    target: 7,
    icon: 'flame',
    color: '#DC9347',
    backgroundColor: '#FFF0DC',
  },
  {
    id: 'thirty-day-streak',
    title: '30 Günlük Seri',
    description: '30 gün üst üste egzersiz yap.',
    category: 'streak',
    metric: 'exercise_streak',
    target: 30,
    icon: 'trophy-outline',
    color: '#C59A44',
    backgroundColor: '#F8EFD7',
  },
  {
    id: 'yoga-explorer',
    title: 'Yoga Yolcusu',
    description: '5 yoga seansı tamamla.',
    category: 'yoga',
    metric: 'yoga_sessions',
    target: 5,
    icon: 'leaf-outline',
    color: '#6F8F7E',
    backgroundColor: '#E3ECE7',
  },
  {
    id: 'pilates-lover',
    title: 'Pilates Tutkunu',
    description: '5 pilates seansı tamamla.',
    category: 'pilates',
    metric: 'pilates_sessions',
    target: 5,
    icon: 'fitness-outline',
    color: '#B98268',
    backgroundColor: '#F2E6E0',
  },
  {
    id: 'reformer-explorer',
    title: 'Reformer Kaşifi',
    description: '5 reformer seansı tamamla.',
    category: 'reformer',
    metric: 'reformer_sessions',
    target: 5,
    icon: 'barbell-outline',
    color: '#71858F',
    backgroundColor: '#E4EAED',
  },
  {
    id: 'hundred-minutes',
    title: '100 Dakika',
    description: 'Toplam 100 dakika egzersiz yap.',
    category: 'exercise',
    metric: 'exercise_minutes',
    target: 100,
    icon: 'time-outline',
    color: '#91B19A',
    backgroundColor: '#E6F0E7',
  },
  {
    id: 'water-friend',
    title: 'Su Dostu',
    description: 'Günlük su hedefine ilk kez ulaş.',
    category: 'water',
    metric: 'water_goal_days',
    target: 1,
    icon: 'water',
    color: '#62A8CF',
    backgroundColor: '#E2F2FA',
  },
  {
    id: 'water-rhythm',
    title: 'Su Ritmi',
    description: '7 farklı günde su hedefini tamamla.',
    category: 'water',
    metric: 'water_goal_days',
    target: 7,
    icon: 'water-outline',
    color: '#67ACCD',
    backgroundColor: '#E4F2F9',
  },
  {
    id: 'first-meal',
    title: 'İlk Öğün',
    description: 'İlk öğününü kaydet.',
    category: 'nutrition',
    metric: 'meal_entries',
    target: 1,
    icon: 'restaurant-outline',
    color: '#E7A17B',
    backgroundColor: '#FAE9DF',
  },
  {
    id: 'goal-hunter',
    title: 'Hedef Avcısı',
    description: 'İlk kişisel egzersiz hedefini tamamla.',
    category: 'goals',
    metric: 'completed_goals',
    target: 1,
    icon: 'flag-outline',
    color: '#AA8CB8',
    backgroundColor: '#F0E8F4',
  },
];

export const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length;