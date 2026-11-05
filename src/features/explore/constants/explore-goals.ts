
import type { UserGoal } from '@/features/onboarding/types/onboarding';

export type ExploreGoalKey = UserGoal | 'fat_loss';

export type ExploreGoal = {
  key: ExploreGoalKey;
  title: string;
  description: string;
  icon: 'leaf' | 'barbell-outline' | 'flower-outline' | 'body-outline' | 'flame';
  backgroundColor: string;
  iconColor: string;
  categorySlugs: string[];
};

export const EXPLORE_GOALS: ExploreGoal[] = [
  {
    key: 'flexibility',
    title: 'Esneklik Kazan',
    description: 'Esnekliğini ve hareket kabiliyetini geliştir.',
    icon: 'leaf',
    backgroundColor: '#E7EFE5',
    iconColor: '#64866C',
    categorySlugs: ['flexibility', 'mobility'],
  },
  {
    key: 'strength',
    title: 'Güçlen',
    description: 'Kaslarını kontrollü şekilde güçlendir.',
    icon: 'barbell-outline',
    backgroundColor: '#F6E9DF',
    iconColor: '#B47C66',
    categorySlugs: ['core', 'upper-body', 'lower-body', 'full-body'],
  },
  {
    key: 'stress_relief',
    title: 'Stresi Azalt',
    description: 'Rahatlamaya ve sakinleşmeye odaklan.',
    icon: 'flower-outline',
    backgroundColor: '#EFE8F1',
    iconColor: '#9B7CA3',
    categorySlugs: ['relaxation'],
  },
  {
    key: 'posture',
    title: 'Duruşunu İyileştir',
    description: 'Denge ve duruş kontrolünü geliştir.',
    icon: 'body-outline',
    backgroundColor: '#F7EDDF',
    iconColor: '#B39265',
    categorySlugs: ['balance', 'mobility', 'core'],
  },
  {
    key: 'fat_loss',
    title: 'Yağ Yak',
    description: 'Aktif bir egzersiz rutinine odaklan.',
    icon: 'flame',
    backgroundColor: '#FBE8DB',
    iconColor: '#CF8652',
    categorySlugs: [],
  },
];
