import { useQuery } from '@tanstack/react-query';

import {
  getDisciplines,
  getExerciseCategories,
  getExercises,
  getProgramBySlug,
  getPrograms,
} from '../services/content-service';

export const contentQueryKeys = {
  all: ['content'] as const,

  disciplines: () => [...contentQueryKeys.all, 'disciplines'] as const,

  categories: (disciplineId: string) =>
    [...contentQueryKeys.all, 'categories', disciplineId] as const,

  exercises: (disciplineId: string) =>
    [...contentQueryKeys.all, 'exercises', disciplineId] as const,

  programs: (disciplineId?: string) =>
    [...contentQueryKeys.all, 'programs', disciplineId ?? 'all'] as const,

  program: (slug: string) => [...contentQueryKeys.all, 'program', slug] as const,
};

export function useDisciplinesQuery() {
  return useQuery({
    queryKey: contentQueryKeys.disciplines(),
    queryFn: getDisciplines,
  });
}

export function useExerciseCategoriesQuery(disciplineId: string | undefined) {
  return useQuery({
    queryKey: contentQueryKeys.categories(disciplineId ?? ''),
    queryFn: () => getExerciseCategories(disciplineId!),
    enabled: Boolean(disciplineId),
  });
}

export function useExercisesQuery(disciplineId: string | undefined) {
  return useQuery({
    queryKey: contentQueryKeys.exercises(disciplineId ?? ''),
    queryFn: () => getExercises(disciplineId!),
    enabled: Boolean(disciplineId),
  });
}

export function useProgramsQuery(disciplineId?: string) {
  return useQuery({
    queryKey: contentQueryKeys.programs(disciplineId),
    queryFn: () => getPrograms(disciplineId),
  });
}

export function useProgramQuery(slug: string | undefined) {
  return useQuery({
    queryKey: contentQueryKeys.program(slug ?? ''),
    queryFn: () => getProgramBySlug(slug!),
    enabled: Boolean(slug),
  });
}
