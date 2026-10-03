import { Ionicons } from '@expo/vector-icons';
import {
  router,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useProgramQuery } from '@/features/content/queries/content-queries';
import { ExerciseVisual } from '@/features/exercise-session/components/ExerciseVisual';
import { SessionCompletion } from '@/features/exercise-session/components/SessionCompletion';
import { SessionCountdown } from '@/features/exercise-session/components/SessionCountdown';
import { SessionProgressBar } from '@/features/exercise-session/components/SessionProgressBar';
import { SessionRest } from '@/features/exercise-session/components/SessionRest';
import { SessionScreen } from '@/features/exercise-session/components/SessionScreen';
import { TimerRing } from '@/features/exercise-session/components/TimerRing';
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

  const isLoading =
    programQuery.isLoading ||
    userProgramQuery.isLoading ||
    exerciseProgressQuery.isLoading;

  const currentExercise =
    session?.exercises[
      session.currentExerciseIndex
    ];

  const isFirstExercise =
    session?.currentExerciseIndex ===
    0;

  const isLastExercise =
    !!session &&
    session.currentExerciseIndex ===
      session.exercises.length - 1;

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
   * Toplam aktif seans süresi.
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
   * Süreli egzersiz sayacı.
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
   * Dinlenme sayacı.
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
   * Süreli egzersiz 0'a ulaştığında
   * otomatik olarak tamamlanır.
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

  const handleClose = () => {
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
   * HAZIRLIK EKRANI
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
   * 3 - 2 - 1 COUNTDOWN
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
   * DİNLENME
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
   * TAMAMLANDI
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
          clearSession();
          router.back();
        }}
      />
    );
  }

  /*
   * AKTİF / PAUSED EGZERSİZ
   */
  const isPaused =
    session.phase === 'paused';

  return (
    <SessionScreen>
      {/* Üst kontrol alanı */}
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
          {progress.totalExerciseCount}
        </Typography>
      </View>

      {/* Seans ilerlemesi */}
      <View className="mt-md">
        <SessionProgressBar
          progress={
            progress.progressPercentage
          }
        />

        <View className="mt-sm flex-row items-center justify-between">
          <View className="flex-1 pr-md">
            <Typography
              variant="caption"
              tone="muted"
            >
              {program.title}
            </Typography>
          </View>

          <Typography
            variant="caption"
            tone="muted"
          >
            %
            {Math.round(
              progress.progressPercentage,
            )}{' '}
            tamamlandı
          </Typography>
        </View>
      </View>

      {/* Egzersiz */}
      <View className="mt-lg flex-1">
        <ExerciseVisual
          exerciseName={
            currentExercise?.name ??
            'Egzersiz'
          }
          isPaused={isPaused}
        />

        {/* Süreli egzersiz */}
        {currentExercise?.durationSeconds ? (
          <View className="mt-lg items-center">
            <TimerRing
              remainingSeconds={
                remainingSeconds ??
                currentExercise.durationSeconds
              }
              totalSeconds={
                currentExercise.durationSeconds
              }
              isPaused={isPaused}
              size={160}
            />
          </View>
        ) : null}

        {/* Tekrarlı egzersiz */}
        {currentExercise?.repetitionCount ? (
          <View className="mt-lg">
            <Card
              variant="outlined"
              padding="lg"
            >
              <View className="items-center">
                <Typography
                  variant="caption"
                  tone="muted"
                >
                  Tekrar
                </Typography>

                <View className="mt-xs">
                  <Typography variant="display">
                    {
                      currentExercise.repetitionCount
                    }
                  </Typography>
                </View>

                <Typography
                  variant="bodySmall"
                  tone="muted"
                  className="text-center"
                >
                  Hareketi kontrollü ve
                  nefesinle uyumlu tamamla.
                </Typography>
              </View>
            </Card>
          </View>
        ) : null}
      </View>

      {/* Kontroller */}
      <View className="mt-lg gap-md">
        <Button
          label={
            isPaused
              ? 'Devam Et'
              : 'Duraklat'
          }
          variant="outline"
          fullWidth
          onPress={
            isPaused
              ? resume
              : pause
          }
        />

        <View className="flex-row gap-md">
          <View className="flex-1">
            <Button
              label="Önceki"
              variant="secondary"
              fullWidth
              disabled={
                isFirstExercise ||
                !isPaused
              }
              onPress={
                previousExercise
              }
            />
          </View>

          <View className="flex-1">
            <Button
              label={
                isLastExercise
                  ? 'Seansı Bitir'
                  : currentExercise?.durationSeconds
                    ? 'Hareketi Bitir'
                    : 'Hareketi Tamamla'
              }
              fullWidth
              loading={
                setExerciseCompletedMutation
                  .isPending ||
                completeProgramMutation
                  .isPending
              }
              disabled={isPaused}
              onPress={
                handleExerciseCompleted
              }
            />
          </View>
        </View>

        {setExerciseCompletedMutation
          .isError ||
        completeProgramMutation
          .isError ? (
          <Typography
            variant="caption"
            tone="danger"
            className="text-center"
          >
            İşlem sırasında bir sorun
            oluştu. Tekrar dene.
          </Typography>
        ) : null}
      </View>
    </SessionScreen>
  );
}