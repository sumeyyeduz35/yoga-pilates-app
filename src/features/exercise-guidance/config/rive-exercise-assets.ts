const RIVE_SMOKE_TEST_URL =
  'https://cdn.rive.app/animations/vehicles.riv';

export const riveExerciseAssets: Record<
  string,
  string
> = {
  'cat-cow-stretch':
    RIVE_SMOKE_TEST_URL,

  'the-hundred':
    RIVE_SMOKE_TEST_URL,

  'reformer-footwork':
    RIVE_SMOKE_TEST_URL,
};

export function getRiveExerciseAssetUrl(
  assetKey: string,
): string | null {
  return (
    riveExerciseAssets[assetKey] ??
    null
  );
}