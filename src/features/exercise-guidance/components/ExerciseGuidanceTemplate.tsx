import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import {
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '@/components/ui/Typography';
import type {
  ExercisePlaybackRate,
  ExerciseView,
} from '@/features/exercise-guidance/types/exercise-guidance';
import { useTheme } from '@/providers/theme-provider';

type ExerciseGuidanceTemplateProps = {
  programTitle: string;
  progressLabel: string;
  progressPercentage: number;

  exerciseName: string;
  disciplineLabel?: string;

  breathLabel?: string;
  breathInstruction?: string;

  remainingSeconds: number;
  totalSeconds: number;

  isPaused: boolean;
  isFirstExercise: boolean;
  isLastExercise: boolean;

  selectedView: ExerciseView;
  playbackRate: ExercisePlaybackRate;

  showMuscles: boolean;
  voiceEnabled: boolean;

  primaryMuscles?: string[];
  secondaryMuscles?: string[];

  supportsFrontView: boolean;
  supportsSideView: boolean;
  supportsMuscleOverlay: boolean;

  completeLoading?: boolean;

  onClose: () => void;
  onTogglePause: () => void;
  onPressPrevious: () => void;
  onPressComplete: () => void;

  onSelectView: (
    view: ExerciseView,
  ) => void;

  onSelectPlaybackRate: (
    rate: ExercisePlaybackRate,
  ) => void;

  onToggleMuscles: () => void;
  onToggleVoice: () => void;

  children: ReactNode;
};

function formatSeconds(
  seconds: number,
) {
  const safeSeconds = Math.max(
    0,
    seconds,
  );

  const minutes = Math.floor(
    safeSeconds / 60,
  );

  const remaining =
    safeSeconds % 60;

  return `${minutes}:${remaining
    .toString()
    .padStart(2, '0')}`;
}

export function ExerciseGuidanceTemplate({
  progressLabel,
  progressPercentage,
  exerciseName,
  disciplineLabel = 'Yoga',
  breathLabel = 'Nefes al',
  breathInstruction = 'Hareketi kontrollü şekilde uygula',
  remainingSeconds,
  isPaused,
  isFirstExercise,
  isLastExercise,
  selectedView,
  playbackRate,
  showMuscles,
  voiceEnabled,
  primaryMuscles = [],
  secondaryMuscles = [],
  supportsFrontView,
  supportsSideView,
  supportsMuscleOverlay,
  completeLoading = false,
  onClose,
  onTogglePause,
  onPressPrevious,
  onPressComplete,
  onSelectView,
  onSelectPlaybackRate,
  onToggleMuscles,
  onToggleVoice,
  children,
}: ExerciseGuidanceTemplateProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={[
        'top',
        'bottom',
      ]}
    >
      <View className="flex-1 bg-background">
        {/* Üst bar */}
        <View className="border-b border-border bg-background px-lg pb-sm pt-xs">
          <View className="min-h-16 flex-row items-center">
            <Pressable
              onPress={onClose}
              hitSlop={10}
              className="h-11 w-11 items-center justify-center rounded-full"
            >
              <Ionicons
                name="chevron-back"
                size={27}
                color={colors.text}
              />
            </Pressable>

            <View className="flex-1 px-sm">
              <Typography
                variant="caption"
                tone="muted"
              >
                {progressLabel}
              </Typography>

              <Typography
                variant="label"
                numberOfLines={1}
              >
                {exerciseName}
              </Typography>

              <Typography
                variant="caption"
                tone="muted"
              >
                {disciplineLabel}
              </Typography>
            </View>

            <Pressable
              onPress={onToggleVoice}
              hitSlop={10}
              className="h-11 w-11 items-center justify-center rounded-full"
            >
              <Ionicons
                name={
                  voiceEnabled
                    ? 'volume-high-outline'
                    : 'volume-mute-outline'
                }
                size={24}
                color={colors.text}
              />
            </Pressable>
          </View>
        </View>

        {/* Ana görsel alanı */}
        <View className="mt-xs flex-1">
          <View className="relative flex-1 overflow-hidden bg-surface">
            <View className="absolute right-4 top-4 z-10">
              <Pressable
                disabled={
                  !supportsMuscleOverlay
                }
                onPress={onToggleMuscles}
                className="flex-row items-center gap-sm rounded-full bg-background px-md py-sm"
                style={{
                  opacity:
                    supportsMuscleOverlay
                      ? 1
                      : 0.5,
                }}
              >
                <Typography variant="caption">
                  Kasları Göster
                </Typography>

                <View
                  className="h-5 w-9 justify-center rounded-full px-0.5"
                  style={{
                    backgroundColor:
                      showMuscles
                        ? colors.primary
                        : colors.border,
                  }}
                >
                  <View
                    className="h-4 w-4 rounded-full bg-white"
                    style={{
                      alignSelf:
                        showMuscles
                          ? 'flex-end'
                          : 'flex-start',
                    }}
                  />
                </View>
              </Pressable>
            </View>

            {showMuscles ? (
              <View className="absolute right-4 top-16 z-10 w-52 rounded-2xl bg-background p-md">
                {primaryMuscles.length > 0 ? (
                  <View>
                    <Typography
                      variant="caption"
                      tone="muted"
                    >
                      Birincil Kaslar
                    </Typography>

                    <View className="mt-xs gap-xs">
                      {primaryMuscles.map(
                        (muscle) => (
                          <View
                            key={muscle}
                            className="flex-row items-center gap-sm"
                          >
                            <View
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor:
                                  colors.primary,
                              }}
                            />

                            <Typography variant="bodySmall">
                              {muscle}
                            </Typography>
                          </View>
                        ),
                      )}
                    </View>
                  </View>
                ) : null}

                {secondaryMuscles.length > 0 ? (
                  <View
                    className={
                      primaryMuscles.length > 0
                        ? 'mt-md'
                        : undefined
                    }
                  >
                    <Typography
                      variant="caption"
                      tone="muted"
                    >
                      İkincil Kaslar
                    </Typography>

                    <View className="mt-xs gap-xs">
                      {secondaryMuscles.map(
                        (muscle) => (
                          <View
                            key={muscle}
                            className="flex-row items-center gap-sm"
                          >
                            <View
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor:
                                  colors.textMuted,
                                opacity: 0.55,
                              }}
                            />

                            <Typography variant="bodySmall">
                              {muscle}
                            </Typography>
                          </View>
                        ),
                      )}
                    </View>
                  </View>
                ) : null}

                {primaryMuscles.length === 0 &&
                secondaryMuscles.length === 0 ? (
                  <Typography
                    variant="bodySmall"
                    tone="muted"
                  >
                    Kas bilgisi henüz eklenmedi.
                  </Typography>
                ) : null}
              </View>
            ) : null}

            <View className="flex-1">
              {children}
            </View>
          </View>
        </View>

        {/* Alt içerik */}
        <View className="px-lg pb-sm pt-md">
          {/* İnce progress */}
          <View
            className="h-1.5 overflow-hidden rounded-full"
            style={{
              backgroundColor:
                colors.border,
            }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    progressPercentage,
                  ),
                )}%`,
                backgroundColor:
                  colors.primary,
              }}
            />
          </View>

          {/* Nefes rehberi */}
          <View className="mt-md items-center">
            <Typography
              variant="caption"
              tone="muted"
            >
              {breathLabel}
            </Typography>

            <View className="mt-xs">
              <Typography
                variant="h3"
                className="text-center"
                numberOfLines={2}
              >
                {breathInstruction}
              </Typography>
            </View>
          </View>

          {/* Süre */}
          <View className="mt-md items-center">
            <Typography
              variant="h1"
              className="text-center"
            >
              {formatSeconds(
                remainingSeconds,
              )}
            </Typography>
          </View>

          {/* Oynatma kontrolleri */}
          <View className="mt-md flex-row items-center justify-between">
            <Pressable
              onPress={() => {
                onSelectPlaybackRate(
                  playbackRate === 0.5
                    ? 1
                    : 0.5,
                );
              }}
              className="h-12 w-12 items-center justify-center rounded-full bg-surface"
            >
              <Typography variant="label">
                {playbackRate === 0.5
                  ? '1x'
                  : '0.5x'}
              </Typography>
            </Pressable>

            <Pressable
              disabled={
                isFirstExercise
              }
              onPress={onPressPrevious}
              className="h-12 w-12 items-center justify-center rounded-full"
              style={{
                opacity:
                  isFirstExercise
                    ? 0.35
                    : 1,
              }}
            >
              <Ionicons
                name="play-skip-back"
                size={24}
                color={colors.text}
              />
            </Pressable>

            <Pressable
              onPress={onTogglePause}
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  colors.primary,
              }}
            >
              <Ionicons
                name={
                  isPaused
                    ? 'play'
                    : 'pause'
                }
                size={30}
                color="#FFFFFF"
              />
            </Pressable>

            <Pressable
              disabled={
                completeLoading
              }
              onPress={onPressComplete}
              className="h-12 w-12 items-center justify-center rounded-full"
              style={{
                opacity:
                  completeLoading
                    ? 0.5
                    : 1,
              }}
            >
              <Ionicons
                name={
                  isLastExercise
                    ? 'checkmark'
                    : 'play-skip-forward'
                }
                size={25}
                color={colors.text}
              />
            </Pressable>

            <Pressable
              onPress={() => {
                onSelectPlaybackRate(
                  playbackRate === 1
                    ? 0.75
                    : 1,
                );
              }}
              className="h-12 w-12 items-center justify-center rounded-full bg-surface"
            >
              <Typography variant="label">
                {playbackRate === 1
                  ? '1x'
                  : `${playbackRate}x`}
              </Typography>
            </Pressable>
          </View>

          {/* Görünüm seçici */}
          <View className="mt-md flex-row rounded-full bg-surface p-1">
            <Pressable
              disabled={
                !supportsFrontView
              }
              onPress={() => {
                onSelectView('front');
              }}
              className="flex-1 items-center justify-center rounded-full py-sm"
              style={{
                backgroundColor:
                  selectedView ===
                    'front'
                    ? colors.background
                    : 'transparent',
                opacity:
                  supportsFrontView
                    ? 1
                    : 0.4,
              }}
            >
              <Typography variant="label">
                Önden
              </Typography>
            </Pressable>

            <Pressable
              disabled={
                !supportsSideView
              }
              onPress={() => {
                onSelectView('side');
              }}
              className="flex-1 items-center justify-center rounded-full py-sm"
              style={{
                backgroundColor:
                  selectedView ===
                    'side'
                    ? colors.background
                    : 'transparent',
                opacity:
                  supportsSideView
                    ? 1
                    : 0.4,
              }}
            >
              <Typography variant="label">
                Yandan
              </Typography>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}