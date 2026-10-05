import { Ionicons } from '@expo/vector-icons';
import {
  router,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import {
  useEffect,
  useRef,
} from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useProgramQuery } from '@/features/content/queries/content-queries';
import { ExerciseGuidanceTemplate } from '@/features/exercise-guidance/components/ExerciseGuidanceTemplate';
import { useExerciseGuidanceStore } from '@/features/exercise-guidance/exercise-guidance-store';
import { getExerciseGuidanceConfig } from '@/features/exercise-guidance/services/exercise-guidance-service';
import { ExerciseVisual } from '@/features/exercise-session/components/ExerciseVisual';
import { SessionCompletion } from '@/features/exercise-session/components/SessionCompletion';
import { SessionCountdown } from '@/features/exercise-session/components/SessionCountdown';
import { SessionRest } from '@/features/exercise-session/components/SessionRest';
import { SessionScreen } from '@/features/exercise-session/components/SessionScreen';
import { useExerciseSessionStore } from '@/features/exercise-session/exercise-session-store';
import { getExerciseSessionProgress } from '@/features/exercise-session/services/exercise-session-service';
import type { ExerciseSession } from '@/features/exercise-session/types/exercise-session';
import {
  useCompleteProgramMutation,
  useSetProgramExerciseCompletedMutation,
  useUserProgramExerciseProgressQuery,
  useUserProgramQuery,
} from '@/features/program-progress/queries/program-progress-queries';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/providers/theme-provider';

export default function ProgramSessionScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();

  const { slug } =
    useLocalSearchParams<{
      slug: string;
    }>();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const autoCompletingExerciseRef =
    useRef<string | null>(null);

  const programQuery =
    useProgramQuery(slug);

  const program =
    programQuery.data;

  const userProgramQuery =
    useUserProgramQuery(
      user?.id,
      program?.id,
    );

  const userProgram =
    userProgramQuery.data;

  const exerciseProgressQuery =
    useUserProgramExerciseProgressQuery(
      userProgram?.id,
    );

  const exerciseProgress =
    exerciseProgressQuery.data;

  const setExerciseCompletedMutation =
    useSetProgramExerciseCompletedMutation(
      userProgram?.id,
    );

  const completeProgramMutation =
    useCompleteProgramMutation(
      user?.id,
      program?.id,
      userProgram?.id,
    );

  /*
   * Phase 8 Session Store
   */

  const session =
    useExerciseSessionStore(
      (state) => state.session,
    );

  const setSession =
    useExerciseSessionStore(
      (state) => state.setSession,
    );

  const clearSession =
    useExerciseSessionStore(
      (state) => state.clearSession,
    );

  const remainingSeconds =
    useExerciseSessionStore(
      (state) =>
        state.remainingSeconds,
    );

  const restRemainingSeconds =
    useExerciseSessionStore(
      (state) =>
        state.restRemainingSeconds,
    );

  const countdownSeconds =
    useExerciseSessionStore(
      (state) =>
        state.countdownSeconds,
    );

  const startCountdown =
    useExerciseSessionStore(
      (state) =>
        state.startCountdown,
    );

  const decrementCountdown =
    useExerciseSessionStore(
      (state) =>
        state.decrementCountdown,
    );

  const startCurrentExercise =
    useExerciseSessionStore(
      (state) =>
        state.startCurrentExercise,
    );

  const pause =
    useExerciseSessionStore(
      (state) => state.pause,
    );

  const resume =
    useExerciseSessionStore(
      (state) => state.resume,
    );

  const nextExercise =
    useExerciseSessionStore(
      (state) =>
        state.nextExercise,
    );

  const previousExercise =
    useExerciseSessionStore(
      (state) =>
        state.previousExercise,
    );

  const complete =
    useExerciseSessionStore(
      (state) => state.complete,
    );

  const decrementRemainingSeconds =
    useExerciseSessionStore(
      (state) =>
        state.decrementRemainingSeconds,
    );

  const startRest =
    useExerciseSessionStore(
      (state) => state.startRest,
    );

  const decrementRest =
    useExerciseSessionStore(
      (state) =>
        state.decrementRest,
    );

  const finishRest =
    useExerciseSessionStore(
      (state) => state.finishRest,
    );

  const incrementElapsedSeconds =
    useExerciseSessionStore(
      (state) =>
        state.incrementElapsedSeconds,
    );

  /*
   * Phase 9 Guidance Store
   */

  const selectedView =
    useExerciseGuidanceStore(
      (state) => state.view,
    );

  const playbackRate =
    useExerciseGuidanceStore(
      (state) =>
        state.playbackRate,
    );

  const showMuscles =
    useExerciseGuidanceStore(
      (state) =>
        state.showMuscles,
    );

  const voiceEnabled =
    useExerciseGuidanceStore(
      (state) =>
        state.voiceEnabled,
    );

  const setView =
    useExerciseGuidanceStore(
      (state) => state.setView,
    );

  const setPlaybackRate =
    useExerciseGuidanceStore(
      (state) =>
        state.setPlaybackRate,
    );

  const toggleMuscles =
    useExerciseGuidanceStore(
      (state) =>
        state.toggleMuscles,
    );

  const toggleVoice =
    useExerciseGuidanceStore(
      (state) =>
        state.toggleVoice,
    );

  const resetGuidancePlayer =
    useExerciseGuidanceStore(
      (state) =>
        state.resetPlayer,
    );

  const isLoading =
    programQuery.isLoading ||
    userProgramQuery.isLoading ||
    exerciseProgressQuery.isLoading;

  const currentExercise =
    session?.exercises[
      session.currentExerciseIndex
    ];

  const guidanceConfig =
    getExerciseGuidanceConfig(
      currentExercise?.exerciseSlug,
    );

  const isFirstExercise =
    session?.currentExerciseIndex ===
    0;

  const isLastExercise =
    !!session &&
    session.currentExerciseIndex ===
      session.exercises.length - 1;

  /*
   * Yeni egzersize geçildiğinde
   * guidance player state sıfırlanır.
   */

  useEffect(() => {
    resetGuidancePlayer();

    if (guidanceConfig) {
      setView(
        guidanceConfig.animation
          .defaultView,
      );
    }
  }, [
    currentExercise?.exerciseSlug,
    guidanceConfig,
    resetGuidancePlayer,
    setView,
  ]);

  /*
   * Session oluşturma
   */

  useEffect(() => {
    if (!program || !userProgram) {
      return;
    }

    const currentExerciseProgress =
      exerciseProgress ?? [];

    if (
      session?.id ===
      userProgram.id
    ) {
      return;
    }

    const firstIncompleteIndex =
      program.exercises.findIndex(
        (programExercise) => {
          const progress =
            currentExerciseProgress.find(
              (item) =>
                item.programExerciseId ===
                programExercise.id,
            );

          return !progress?.isCompleted;
        },
      );

    const initialIndex =
      firstIncompleteIndex >= 0
        ? firstIncompleteIndex
        : 0;

    const newSession: ExerciseSession =
      {
        id: userProgram.id,
        programId: program.id,
        programDayId: null,

        status: 'idle',
        phase: 'ready',

        currentExerciseIndex:
          initialIndex,

        startedAt: null,
        pausedAt: null,
        completedAt: null,

        elapsedSeconds: 0,

        exercises:
          program.exercises.map(
            (
              programExercise,
              index,
            ) => ({
              id: programExercise.id,

              exerciseId:
                programExercise
                  .exercise.id,

              exerciseSlug:
                programExercise
                  .exercise.slug,

              name:
                programExercise
                  .exercise.name,

              order: index,

              durationSeconds:
                programExercise
                  .durationSeconds,

              repetitionCount:
                programExercise
                  .repetitions,

              restSeconds:
                programExercise
                  .restSeconds,
            }),
          ),
      };

    setSession(newSession);
  }, [
    exerciseProgress,
    program,
    session?.id,
    setSession,
    userProgram,
  ]);

  /*
   * 3 → 2 → 1 hazırlık sayacı
   */

  useEffect(() => {
    if (
      session?.phase !==
        'countdown' ||
      countdownSeconds === null
    ) {
      return;
    }

    if (countdownSeconds <= 0) {
      startCurrentExercise();
      return;
    }

    const timer = setTimeout(
      () => {
        decrementCountdown();
      },
      1000,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    countdownSeconds,
    decrementCountdown,
    session?.phase,
    startCurrentExercise,
  ]);

  /*
   * Toplam aktif seans süresi
   */

  useEffect(() => {
    if (
      session?.phase !==
        'active' &&
      session?.phase !==
        'resting'
    ) {
      return;
    }

    const timer = setInterval(
      () => {
        incrementElapsedSeconds();
      },
      1000,
    );

    return () => {
      clearInterval(timer);
    };
  }, [
    incrementElapsedSeconds,
    session?.phase,
  ]);

  /*
   * Egzersiz sayacı
   */

  useEffect(() => {
    if (
      session?.phase !==
        'active' ||
      remainingSeconds === null ||
      remainingSeconds <= 0
    ) {
      return;
    }

    const timer = setTimeout(
      () => {
        decrementRemainingSeconds();
      },
      1000,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    decrementRemainingSeconds,
    remainingSeconds,
    session?.phase,
  ]);

  /*
   * Dinlenme sayacı
   */

  useEffect(() => {
    if (
      session?.phase !==
        'resting' ||
      restRemainingSeconds === null
    ) {
      return;
    }

    if (
      restRemainingSeconds <= 0
    ) {
      finishRest();
      nextExercise();

      return;
    }

    const timer = setTimeout(
      () => {
        decrementRest();
      },
      1000,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    decrementRest,
    finishRest,
    nextExercise,
    restRemainingSeconds,
    session?.phase,
  ]);

  /*
   * Süre 0 olduğunda hareketi
   * otomatik tamamla
   */

  useEffect(() => {
    if (
      session?.phase !==
        'active' ||
      !currentExercise?.durationSeconds ||
      remainingSeconds !== 0
    ) {
      return;
    }

    if (
      autoCompletingExerciseRef
        .current ===
      currentExercise.id
    ) {
      return;
    }

    autoCompletingExerciseRef.current =
      currentExercise.id;

    setExerciseCompletedMutation.mutate(
      {
        programExerciseId:
          currentExercise.id,

        isCompleted: true,
      },
      {
        onSuccess: () => {
          autoCompletingExerciseRef.current =
            null;

          if (isLastExercise) {
            completeProgramMutation.mutate(
              undefined,
              {
                onSuccess: () => {
                  complete();
                },
              },
            );

            return;
          }

          if (
            currentExercise.restSeconds &&
            currentExercise.restSeconds >
              0
          ) {
            startRest(
              currentExercise
                .restSeconds,
            );

            return;
          }

          nextExercise();
        },

        onError: () => {
          autoCompletingExerciseRef.current =
            null;
        },
      },
    );
  }, [
    complete,
    completeProgramMutation,
    currentExercise,
    isLastExercise,
    nextExercise,
    remainingSeconds,
    session?.phase,
    setExerciseCompletedMutation,
    startRest,
  ]);

  /*
   * Loading
   */

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <View className="mt-md">
          <Typography
            variant="body"
            tone="muted"
          >
            Seans hazırlanıyor...
          </Typography>
        </View>
      </View>
    );
  }

  /*
   * Session bulunamadı
   */

  if (
    !program ||
    !userProgram ||
    !session
  ) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <Ionicons
          name="alert-circle-outline"
          size={40}
          color={colors.textMuted}
        />

        <View className="mt-md">
          <Typography variant="h3">
            Seans bulunamadı
          </Typography>
        </View>

        <View className="mt-xs">
          <Typography
            variant="body"
            tone="muted"
            className="text-center"
          >
            Bu program için aktif bir
            seans oluşturulamadı.
          </Typography>
        </View>
      </View>
    );
  }

  const progress =
    getExerciseSessionProgress(
      session,
    );

  /*
   * Genel handlers
   */

  const handleClose = () => {
    resetGuidancePlayer();
    clearSession();
    router.back();
  };

  const handleExerciseCompleted =
    () => {
      if (
        !currentExercise ||
        setExerciseCompletedMutation
          .isPending ||
        completeProgramMutation
          .isPending
      ) {
        return;
      }

      setExerciseCompletedMutation.mutate(
        {
          programExerciseId:
            currentExercise.id,

          isCompleted: true,
        },
        {
          onSuccess: () => {
            if (isLastExercise) {
              completeProgramMutation.mutate(
                undefined,
                {
                  onSuccess: () => {
                    complete();
                  },
                },
              );

              return;
            }

            if (
              currentExercise.restSeconds &&
              currentExercise.restSeconds >
                0
            ) {
              startRest(
                currentExercise
                  .restSeconds,
              );

              return;
            }

            nextExercise();
          },
        },
      );
    };

  /*
   * Hazırlık ekranı
   */

  if (session.phase === 'ready') {
    return (
      <SessionScreen>
        <View className="flex-row items-center justify-between">
          <Button
            label="Kapat"
            variant="ghost"
            size="sm"
            onPress={handleClose}
          />

          <Typography
            variant="label"
            tone="muted"
          >
            {session.currentExerciseIndex +
              1}{' '}
            /{' '}
            {
              progress.totalExerciseCount
            }
          </Typography>
        </View>

        <View className="flex-1 justify-center">
          <Card
            variant="outlined"
            padding="lg"
          >
            <View className="items-center py-lg">
              <Ionicons
                name="fitness-outline"
                size={72}
                color={colors.primary}
              />

              <View className="mt-lg">
                <Typography
                  variant="caption"
                  tone="muted"
                >
                  Sıradaki hareket
                </Typography>
              </View>

              <View className="mt-xs">
                <Typography
                  variant="h1"
                  className="text-center"
                >
                  {currentExercise?.name ??
                    'Egzersiz'}
                </Typography>
              </View>

              {currentExercise?.durationSeconds ? (
                <View className="mt-lg items-center">
                  <Typography
                    variant="caption"
                    tone="muted"
                  >
                    Süre
                  </Typography>

                  <Typography variant="h2">
                    {
                      currentExercise.durationSeconds
                    }{' '}
                    saniye
                  </Typography>
                </View>
              ) : null}

              {currentExercise?.repetitionCount ? (
                <View className="mt-lg items-center">
                  <Typography
                    variant="caption"
                    tone="muted"
                  >
                    Tekrar
                  </Typography>

                  <Typography variant="h2">
                    {
                      currentExercise.repetitionCount
                    }{' '}
                    tekrar
                  </Typography>
                </View>
              ) : null}

              {currentExercise?.restSeconds ? (
                <View className="mt-md items-center">
                  <Typography
                    variant="caption"
                    tone="muted"
                  >
                    Sonraki dinlenme
                  </Typography>

                  <Typography variant="body">
                    {
                      currentExercise.restSeconds
                    }{' '}
                    saniye
                  </Typography>
                </View>
              ) : null}
            </View>
          </Card>
        </View>

        <Button
          label="Egzersizi Başlat"
          size="lg"
          fullWidth
          onPress={startCountdown}
        />

        {!isFirstExercise ? (
          <View className="mt-sm">
            <Button
              label="Önceki Harekete Dön"
              variant="ghost"
              fullWidth
              onPress={
                previousExercise
              }
            />
          </View>
        ) : null}
      </SessionScreen>
    );
  }

  /*
   * Countdown
   */

  if (
    session.phase ===
    'countdown'
  ) {
    return (
      <SessionCountdown
        seconds={Math.max(
          countdownSeconds ?? 3,
          1,
        )}
        exerciseName={
          currentExercise?.name
        }
      />
    );
  }

  /*
   * Dinlenme
   */

  if (
    session.phase ===
    'resting'
  ) {
    return (
      <SessionRest
        remainingSeconds={
          restRemainingSeconds ?? 0
        }
        totalSeconds={Math.max(
          currentExercise?.restSeconds ??
            restRemainingSeconds ??
            1,
          1,
        )}
        onClose={handleClose}
        onSkip={() => {
          finishRest();
          nextExercise();
        }}
      />
    );
  }

  /*
   * Session tamamlandı
   */

  if (
    session.phase ===
    'completed'
  ) {
    return (
      <SessionCompletion
        completedExerciseCount={
          session.exercises.length
        }
        elapsedSeconds={
          session.elapsedSeconds
        }
        onReturn={() => {
          resetGuidancePlayer();
          clearSession();
          router.back();
        }}
      />
    );
  }

  /*
   * Aktif / Paused
   */

  const isPaused =
    session.phase === 'paused';

  const supportsFrontView =
    guidanceConfig?.animation.supportedViews.includes(
      'front',
    ) ?? false;

  const supportsSideView =
    guidanceConfig?.animation.supportedViews.includes(
      'side',
    ) ?? false;

  const supportsMuscleOverlay =
    guidanceConfig?.animation
      .supportsMuscleOverlay ??
    false;

  const disciplineLabel =
    guidanceConfig?.discipline ===
    'yoga'
      ? 'Yoga'
      : guidanceConfig?.discipline ===
          'pilates'
        ? 'Pilates'
        : guidanceConfig?.discipline ===
            'reformer'
          ? 'Reformer'
          : 'Egzersiz';

  const breathCue =
    guidanceConfig?.breathCues[0];

  const voiceCue =
    guidanceConfig?.voiceCues[0];

  /*
   * Phase 9 kas bilgileri
   */

  const primaryMuscles =
    guidanceConfig?.muscles
      .filter(
        (muscle) =>
          muscle.role === 'primary',
      )
      .map(
        (muscle) => muscle.name,
      ) ?? [];

  const secondaryMuscles =
    guidanceConfig?.muscles
      .filter(
        (muscle) =>
          muscle.role === 'secondary',
      )
      .map(
        (muscle) => muscle.name,
      ) ?? [];

  const totalSeconds =
    Math.max(
      currentExercise
        ?.durationSeconds ??
        remainingSeconds ??
        1,
      1,
    );

  const activeRemainingSeconds =
    remainingSeconds ??
    totalSeconds;

  return (
    <ExerciseGuidanceTemplate
      programTitle={program.title}
      progressLabel={`${
        session.currentExerciseIndex +
        1
      } / ${
        progress.totalExerciseCount
      }`}
      progressPercentage={
        progress.progressPercentage
      }
      exerciseName={
        currentExercise?.name ??
        'Egzersiz'
      }
      disciplineLabel={
        disciplineLabel
      }
      breathLabel={
        breathCue?.label ??
        'Nefesine odaklan'
      }
      breathInstruction={
        voiceCue?.text ??
        guidanceConfig?.fallback
          .textInstruction ??
        'Hareketi kontrollü şekilde uygula.'
      }
      remainingSeconds={
        activeRemainingSeconds
      }
      totalSeconds={
        totalSeconds
      }
      isPaused={isPaused}
      isFirstExercise={
        isFirstExercise
      }
      isLastExercise={
        isLastExercise
      }
      selectedView={
        selectedView
      }
      playbackRate={
        playbackRate
      }
      showMuscles={
        showMuscles
      }
      voiceEnabled={
        voiceEnabled
      }
      primaryMuscles={
        primaryMuscles
      }
      secondaryMuscles={
        secondaryMuscles
      }
      supportsFrontView={
        supportsFrontView
      }
      supportsSideView={
        supportsSideView
      }
      supportsMuscleOverlay={
        supportsMuscleOverlay
      }
      completeLoading={
        setExerciseCompletedMutation
          .isPending ||
        completeProgramMutation
          .isPending
      }
      onClose={handleClose}
      onTogglePause={() => {
        if (isPaused) {
          resume();
          return;
        }

        pause();
      }}
      onPressPrevious={() => {
        if (!isPaused) {
          return;
        }

        previousExercise();
      }}
      onPressComplete={() => {
        if (isPaused) {
          return;
        }

        handleExerciseCompleted();
      }}
      onSelectView={
        setView
      }
      onSelectPlaybackRate={
        setPlaybackRate
      }
      onToggleMuscles={
        toggleMuscles
      }
      onToggleVoice={
        toggleVoice
      }
    >
      <ExerciseVisual
        exerciseSlug={
          currentExercise
            ?.exerciseSlug
        }
        isPaused={isPaused}
      />
    </ExerciseGuidanceTemplate>
  );
}