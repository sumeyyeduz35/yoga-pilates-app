
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
import { DailyGoals } from '@/features/home/components/DailyGoals';
import { DailyMotivationCard } from '@/features/home/components/DailyMotivationCard';
import { FeaturedPracticeCard } from '@/features/home/components/FeaturedPracticeCard';
import { HomeDisciplineCard } from '@/features/home/components/HomeDisciplineCard';
import { RecommendedProgramCard } from '@/features/home/components/RecommendedProgramCard';

import { featuredPractice } from '@/features/home/data/home-data';

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
  } = useProgramQuery(programSummary?.slug);

  const {
    data: exerciseProgress = [],
    isLoading: isProgressLoading,
  } = useUserProgramExerciseProgressQuery(userProgram.id);

  if (isProgramLoading || isProgressLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <View className="min-h-24 justify-center">
          <Typography variant="body" tone="muted">
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
    (item) => item.id === program.disciplineId,
  );

  const totalExercises = program.exercises.length;

  const completedExercises = exerciseProgress.filter(
    (item) => item.isCompleted,
  ).length;

  const progress =
    totalExercises > 0
      ? Math.round(
          (completedExercises / totalExercises) * 100,
        )
      : 0;

  return (
    <ContinuePracticeCard
      title={program.title}
      discipline={discipline?.name ?? 'Program'}
      duration={
        program.durationMinutes
          ? `${program.durationMinutes} dk`
          : 'Süre belirtilmedi'
      }
      progress={progress}
      onPress={() =>
        router.push(`/program/${program.slug}/session`)
      }
    />
  );
}

export default function HomeScreen() {
  const { session } = useAuth();

  const userId = session?.user.id;

  const [continueAreaWidth, setContinueAreaWidth] =
    useState(0);

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

  // Geçici öneriler: katalogdaki ilk üç program.
  const recommendedPrograms = programs.slice(0, 3);

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
      <View className="mb-sm">
        <Typography variant="h2">
          Merhaba 🌿
        </Typography>

        <Typography
          variant="bodySmall"
          tone="muted"
          className="mt-xs"
        >
          Bugün kendine iyi gelecek bir şey yap.
        </Typography>
      </View>

      {/* Daily Motivation Carousel */}
      <DailyMotivationCard />

      {/* Daily Goals */}
      <DailyGoals />

      {/* Continue Practice */}
      <View className="mt-xl">
        <View className="flex-row items-center justify-between">
          <Typography variant="h2">
            Devam Et
          </Typography>

          {activeUserPrograms.length > 1 && (
            <Typography variant="caption" tone="muted">
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
            <Card variant="elevated" padding="lg">
              <View className="min-h-24 justify-center">
                <Typography variant="body" tone="muted">
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
              {activeUserPrograms.map((userProgram) => {
                const programSummary = programs.find(
                  (program) =>
                    program.id === userProgram.programId,
                );

                return (
                  <View
                    key={userProgram.id}
                    style={{ width: continueAreaWidth }}
                  >
                    <ActiveProgramCard
                      userProgram={userProgram}
                      programSummary={programSummary}
                      disciplines={disciplines}
                    />
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <Card variant="elevated" padding="lg">
              <View className="min-h-24 justify-center">
                <Typography variant="h3">
                  Henüz devam eden bir programın yok.
                </Typography>

                <Typography
                  variant="bodySmall"
                  tone="muted"
                  className="mt-xs"
                >
                  Programlar bölümünden bir program seçerek
                  başlayabilirsin.
                </Typography>
              </View>
            </Card>
          )}
        </View>
      </View>

      {/* Recommended Programs */}
      <View className="mt-xl">
        <Typography variant="h2">
          Senin İçin Öneriler
        </Typography>

        {isProgramsLoading || isDisciplinesLoading ? (
          <Typography
            variant="bodySmall"
            tone="muted"
            className="mt-md"
          >
            Programlar yükleniyor...
          </Typography>
        ) : recommendedPrograms.length > 0 ? (
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-md py-sm"
            className="mt-md"
          >
            {recommendedPrograms.map((program) => {
              const discipline = disciplines.find(
                (item) => item.id === program.disciplineId,
              );

              return (
                <RecommendedProgramCard
                  key={program.id}
                  title={program.title}
                  discipline={discipline?.name ?? 'Program'}
                  level="Tüm seviyeler"
                  duration={
                    program.durationMinutes
                      ? `${program.durationMinutes} dk`
                      : 'Süre belirtilmedi'
                  }
                  image={require('../../../../assets/images/home/welcome-character.png')}
                  onPress={() =>
                    router.push(`/program/${program.slug}`)
                  }
                />
              );
            })}
          </ScrollView>
        ) : (
          <Typography
            variant="bodySmall"
            tone="muted"
            className="mt-md"
          >
            Henüz önerilebilecek program bulunmuyor.
          </Typography>
        )}
      </View>

      {/* Disciplines */}
      <View className="mt-xl">
        <View className="flex-row items-center justify-between">
          <Typography variant="h2">
            Disiplinler
          </Typography>

          <Typography variant="caption" tone="muted">
            Tümünü gör ›
          </Typography>
        </View>

        <View className="mt-md flex-row gap-sm">
          <HomeDisciplineCard
            title="Yoga"
            description="Zihin ve beden dengesi"
            icon="flower-outline"
            backgroundColor="#E4EBDF"
            accentColor="#779778"
          />

          <HomeDisciplineCard
            title="Pilates"
            description="Güçlü ve esnek bir beden"
            icon="leaf-outline"
            backgroundColor="#F5E3D8"
            accentColor="#BF917C"
          />

          <HomeDisciplineCard
            title="Reformer"
            description="Derinlemesine güçlenme"
            icon="barbell-outline"
            backgroundColor="#EBE2F0"
            accentColor="#9075AA"
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
            title={featuredPractice.title}
            description={featuredPractice.description}
            duration={featuredPractice.duration}
            level={featuredPractice.level}
          />
        </View>
      </View>
    </ScrollView>
  );
}
