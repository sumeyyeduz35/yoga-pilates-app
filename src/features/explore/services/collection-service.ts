
import { supabase } from '@/lib/supabase';

import type {
    Difficulty,
    Exercise,
} from '@/features/content/types/content';

import type {
    ExerciseCollection,
    ExerciseCollectionItem,
    ExerciseCollectionWithItems,
} from '../types/collection';

// Veritabanı satır tipleri

type CollectionRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type ExerciseRow = {
  id: string;
  discipline_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  instructions: string | null;
  difficulty: string;
  duration_seconds: number | null;
  image_url: string | null;
  video_url: string | null;
  is_active: boolean;
};

type CollectionItemRow = {
  id: string;
  collection_id: string;
  exercise_id: string;
  sort_order: number;
  exercise: ExerciseRow | ExerciseRow[];
};

// Veritabanı verilerini uygulama tiplerine dönüştürme

function mapCollection(
  row: CollectionRow,
): ExerciseCollection {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapDifficulty(
  value: string,
): Difficulty {
  if (
    value !== 'beginner' &&
    value !== 'intermediate' &&
    value !== 'advanced'
  ) {
    throw new Error(
      `Desteklenmeyen zorluk seviyesi: ${value}`,
    );
  }

  return value;
}

function mapExercise(
  row: ExerciseRow,
): Exercise {
  return {
    id: row.id,
    disciplineId: row.discipline_id,
    categoryId: row.category_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    instructions: row.instructions,
    difficulty: mapDifficulty(row.difficulty),
    durationSeconds: row.duration_seconds,
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    isActive: row.is_active,
  };
}

function mapCollectionItem(
  row: CollectionItemRow,
): ExerciseCollectionItem {
  const exercise = Array.isArray(row.exercise)
    ? row.exercise[0]
    : row.exercise;

  if (!exercise) {
    throw new Error(
      'Koleksiyon egzersiz bağlantısı bulunamadı.',
    );
  }

  return {
    id: row.id,
    collectionId: row.collection_id,
    exerciseId: row.exercise_id,
    sortOrder: row.sort_order,
    exercise: mapExercise(exercise),
  };
}

// Aktif koleksiyonları getir

export async function getExerciseCollections(): Promise<
  ExerciseCollection[]
> {
  const { data, error } = await supabase
    .from('exercise_collections')
    .select(
      'id, title, slug, description, cover_image_url, sort_order, is_active',
    )
    .eq('is_active', true)
    .order('sort_order')
    .order('id');

  if (error) {
    throw error;
  }

  return (data as CollectionRow[]).map(
    mapCollection,
  );
}

// Slug ile koleksiyon ve egzersizlerini getir

export async function getExerciseCollectionBySlug(
  slug: string,
): Promise<ExerciseCollectionWithItems | null> {
  // Koleksiyonu getir
  const {
    data: collectionData,
    error: collectionError,
  } = await supabase
    .from('exercise_collections')
    .select(
      'id, title, slug, description, cover_image_url, sort_order, is_active',
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (collectionError) {
    throw collectionError;
  }

  if (!collectionData) {
    return null;
  }

  const collection = mapCollection(
    collectionData as CollectionRow,
  );

  // Koleksiyona bağlı egzersizleri getir
  const {
    data: itemsData,
    error: itemsError,
  } = await supabase
    .from('exercise_collection_items')
    .select(
      `
        id,
        collection_id,
        exercise_id,
        sort_order,
        exercise:exercises!inner (
          id,
          discipline_id,
          category_id,
          name,
          slug,
          description,
          instructions,
          difficulty,
          duration_seconds,
          image_url,
          video_url,
          is_active
        )
      `,
    )
    .eq('collection_id', collection.id)
    .eq('exercise.is_active', true)
    .order('sort_order');

  if (itemsError) {
    throw itemsError;
  }

  const items = (
    (itemsData ?? []) as unknown as CollectionItemRow[]
  ).map(mapCollectionItem);

  return {
    ...collection,
    items,
  };
}
