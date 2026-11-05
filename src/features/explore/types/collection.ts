
import type { Exercise } from '@/features/content/types/content';

// Koleksiyonun temel bilgileri
export type ExerciseCollection = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

// Koleksiyona bağlı egzersiz
export type ExerciseCollectionItem = {
  id: string;
  collectionId: string;
  exerciseId: string;
  sortOrder: number;
  exercise: Exercise;
};

// Detay sayfasında kullanılacak veri
export type ExerciseCollectionWithItems =
  ExerciseCollection & {
    items: ExerciseCollectionItem[];
  };
