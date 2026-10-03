import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import {
  useDisciplinesQuery,
  useProgramQuery,
  useProgramsQuery,
} from '@/features/content/queries/content-queries';
import type {
  Discipline,
  Program,
} from '@/features/content/types/content';
import { ContinuePracticeCard } from '@/features/home/components/ContinuePracticeCard';
import { DisciplineCard } from '@/features/home/components/DisciplineCard';
import { FeaturedPracticeCard } from '@/features/home/components/FeaturedPracticeCard';
import {
  featuredPractice,
  homeDisciplines,
} from '@/features/home/data/home-data';
import {
  useActiveUserProgramsQuery,
  useUserProgramExerciseProgressQuery,
} from '@/features/program-progress/queries/program-progress-queries';
import type { UserProgram } from '@/features/program-progress/types/program-progress';
import { useAuth } from '@/providers/auth-provider';

type ActiveProgramCardProps = {
  userProgram: UserProgram;
  programSummary: Program | undefined;
  disciplines: Discipline[];
};

function ActiveProgramCard({
  userProgram,
  programSummary,
  disciplines,
}: ActiveProgramCardProps) {
  const {
    data: program,
    isLoading: isProgramLoading,
  } = useProgramQuery(
    programSummary?.slug,
  );

  const {
    data: exerciseProgress = [],
    isLoading: isProgressLoading,
  } = useUserProgramExerciseProgressQuery(
    userProgram.id,
  );

  if (
    isProgramLoading ||
    isProgressLoading
  ) {
    return (
      <Card
        variant="elevated"
        padding="lg"
      >
        <View className="min-h-24 justify-center">
          <Typography
            variant="body"
            tone="muted"
          >
            İlerlemen yükleniyor...
          </Typography>
        </View>
      </Card>
    );
  }

  if (!program) {
    return null;
  }

  const discipline = disciplines.find(
    (item) =>
      item.id === program.disciplineId,
  );

  const totalExercises =
    program.exercises.length;

  const completedExercises =
    exerciseProgress.filter(
      (item) => item.isCompleted,
    ).length;

  const progress =
    totalExercises > 0
      ? Math.round(
          (completedExercises /
            totalExercises) *
            100,
        )
      : 0;

  return (
    <ContinuePracticeCard
      title={program.title}
      discipline={
        discipline?.name ?? 'Program'
      }
      duration={
        program.durationMinutes
          ? `${program.durationMinutes} dk`
          : 'Süre belirtilmedi'
      }
      progress={progress}
      onPress={() =>
        router.push(
          `/program/${program.slug}/session`,
        )
      }
    />
  );
}

export default function HomeScreen() {
  const { session } = useAuth();

  const userId = session?.user.id;

  const [continueAreaWidth, setContinueAreaWidth] =
    useState(0);

  const primaryDisciplines =
    homeDisciplines.slice(0, 2);

  const reformer =
    homeDisciplines[2];

  const {
    data: activeUserPrograms = [],
    isLoading: isActiveProgramsLoading,
  } = useActiveUserProgramsQuery(userId);

  const {
    data: programs = [],
    isLoading: isProgramsLoading,
  } = useProgramsQuery();

  const {
    data: disciplines = [],
    isLoading: isDisciplinesLoading,
  } = useDisciplinesQuery();

  const isContinuePracticeLoading =
    isActiveProgramsLoading ||
    isProgramsLoading ||
    isDisciplinesLoading;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-lg pb-2xl pt-lg"
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome */}
      <View className="gap-xs">
        <Typography
          variant="body"
          tone="muted"
        >
          Merhaba
        </Typography>

        <Typography variant="h1">
          Bugün kendin için hareket et.
        </Typography>

        <Typography
          variant="body"
          tone="muted"
        >
          Bedenine ve enerjine uygun pratiği seç.
        </Typography>
      </View>

      {/* Continue Practice */}
      <View className="mt-xl">
        <View className="flex-row items-center justify-between">
          <Typography variant="h2">
            Devam Et
          </Typography>

          {activeUserPrograms.length > 1 && (
            <Typography
              variant="caption"
              tone="muted"
            >
              {activeUserPrograms.length} program
            </Typography>
          )}
        </View>

        <View
          className="mt-md"
          onLayout={(event) => {
            setContinueAreaWidth(
              event.nativeEvent.layout.width,
            );
          }}
        >
          {isContinuePracticeLoading ? (
            <Card
              variant="elevated"
              padding="lg"
            >
              <View className="min-h-24 justify-center">
                <Typography
                  variant="body"
                  tone="muted"
                >
                  İlerlemen yükleniyor...
                </Typography>
              </View>
            </Card>
          ) : activeUserPrograms.length > 0 &&
            continueAreaWidth > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
            >
              {activeUserPrograms.map(
                (userProgram) => {
                  const programSummary =
                    programs.find(
                      (program) =>
                        program.id ===
                        userProgram.programId,
                    );

                  return (
                    <View
                      key={userProgram.id}
                      style={{
                        width: continueAreaWidth,
                      }}
                    >
                      <ActiveProgramCard
                        userProgram={userProgram}
                        programSummary={
                          programSummary
                        }
                        disciplines={
                          disciplines
                        }
                      />
                    </View>
                  );
                },
              )}
            </ScrollView>
          ) : (
            <Card
              variant="elevated"
              padding="lg"
            >
              <View className="min-h-24 justify-center">
                <Typography variant="h3">
                  Henüz devam eden bir programın yok.
                </Typography>

                <Typography
                  variant="bodySmall"
                  tone="muted"
                  className="mt-xs"
                >
                  Programlar bölümünden bir program
                  seçerek başlayabilirsin.
                </Typography>
              </View>
            </Card>
          )}
        </View>
      </View>

      {/* Disciplines */}
      <View className="mt-xl">
        <Typography variant="h2">
          Disiplinler
        </Typography>

        <View className="mt-md gap-md">
          <View className="flex-row gap-md">
            {primaryDisciplines.map(
              (discipline) => (
                <DisciplineCard
                  key={discipline.key}
                  className="flex-1"
                  discipline={
                    discipline.key
                  }
                  title={
                    discipline.title
                  }
                  description={
                    discipline.description
                  }
                  icon={
                    discipline.icon
                  }
                />
              ),
            )}
          </View>

          <DisciplineCard
            className="w-full"
            discipline={reformer.key}
            title={reformer.title}
            description={
              reformer.description
            }
            icon={reformer.icon}
          />
        </View>
      </View>

      {/* Featured Practice */}
      <View className="mt-xl">
        <Typography variant="h2">
          Bugünün pratiği
        </Typography>

        <View className="mt-md">
          <FeaturedPracticeCard
            title={
              featuredPractice.title
            }
            description={
              featuredPractice.description
            }
            duration={
              featuredPractice.duration
            }
            level={
              featuredPractice.level
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}