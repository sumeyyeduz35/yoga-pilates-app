
import { useQuery } from '@tanstack/react-query';

import {
    getExerciseCollectionBySlug,
    getExerciseCollections,
} from '../services/collection-service';

export const collectionQueryKeys = {
  all: ['exercise-collections'] as const,

  list: () =>
    [...collectionQueryKeys.all, 'list'] as const,

  detail: (slug: string) =>
    [...collectionQueryKeys.all, 'detail', slug] as const,
};

export function useExerciseCollectionsQuery() {
  return useQuery({
    queryKey: collectionQueryKeys.list(),
    queryFn: getExerciseCollections,
  });
}

export function useExerciseCollectionQuery(
  slug: string | undefined,
) {
  return useQuery({
    queryKey: collectionQueryKeys.detail(slug ?? ''),
    queryFn: () => getExerciseCollectionBySlug(slug!),
    enabled: Boolean(slug),
  });
}
