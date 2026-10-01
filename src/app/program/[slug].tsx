import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useProgramQuery } from '@/features/content/queries/content-queries';
import {
  useStartProgramMutation,
  useUserProgramQuery,
} from '@/features/program-progress/queries/program-progress-queries';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/providers/theme-provider';

function getDifficultyLabel(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return 'Başlangıç';
    case 'intermediate':
      return 'Orta';
    case 'advanced':
      return 'İleri';
    default:
      return difficulty;
  }
}

function formatExercisePrescription(durationSeconds: number | null, repetitions: number | null) {
  if (durationSeconds) {
    return `${durationSeconds} sn`;
  }

  if (repetitions) {
    return `${repetitions} tekrar`;
  }

  return 'Serbest';
}

export default function ProgramDetailScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const { slug } = useLocalSearchParams<{ slug: string }>();

  const programQuery = useProgramQuery(slug);
  const program = programQuery.data;

  const userProgramQuery = useUserProgramQuery(user?.id, program?.id);

  const startProgramMutation = useStartProgramMutation(user?.id, program?.id);

  const userProgram = userProgramQuery.data;

  const handleStartProgram = () => {
    if (!user || !program) {
      return;
    }

    startProgramMutation.mutate();
  };

  if (programQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <ActivityIndicator size="large" color={colors.primary} />

        <View className="mt-md">
          <Typography variant="body" tone="muted">
            Program yükleniyor...
          </Typography>
        </View>
      </View>
    );
  }

  if (programQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <Ionicons name="alert-circle-outline" size={40} color={colors.textMuted} />

        <View className="mt-md">
          <Typography variant="h3">Program yüklenemedi</Typography>
        </View>

        <View className="mt-xs">
          <Typography variant="body" tone="muted" className="text-center">
            Program bilgilerine ulaşırken bir sorun oluştu. Lütfen tekrar dene.
          </Typography>
        </View>
      </View>
    );
  }

  if (!program) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <Ionicons name="search-outline" size={40} color={colors.textMuted} />

        <View className="mt-md">
          <Typography variant="h3">Program bulunamadı</Typography>
        </View>

        <View className="mt-xs">
          <Typography variant="body" tone="muted" className="text-center">
            Bu program artık mevcut olmayabilir.
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-lg pb-2xl pt-lg"
      showsVerticalScrollIndicator={false}
    >
      <Typography variant="h1">{program.title}</Typography>

      {program.description ? (
        <View className="mt-sm">
          <Typography variant="body" tone="muted">
            {program.description}
          </Typography>
        </View>
      ) : null}

      <View className="mt-lg flex-row flex-wrap gap-lg">
        <View className="flex-row items-center gap-xs">
          <Ionicons name="speedometer-outline" size={18} color={colors.textMuted} />

          <Typography variant="caption" tone="muted">
            {getDifficultyLabel(program.difficulty)}
          </Typography>
        </View>

        {program.durationMinutes ? (
          <View className="flex-row items-center gap-xs">
            <Ionicons name="time-outline" size={18} color={colors.textMuted} />

            <Typography variant="caption" tone="muted">
              {program.durationMinutes} dk
            </Typography>
          </View>
        ) : null}

        <View className="flex-row items-center gap-xs">
          <Ionicons name="fitness-outline" size={18} color={colors.textMuted} />

          <Typography variant="caption" tone="muted">
            {program.exercises.length} hareket
          </Typography>
        </View>
      </View>

      <View className="mt-xl">
        {userProgramQuery.isLoading ? (
          <View className="items-center py-md">
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <Button
            label={userProgram ? 'Programa Devam Et' : 'Programa Başla'}
            size="lg"
            fullWidth
            loading={startProgramMutation.isPending}
            disabled={!user}
            onPress={() => {
              if (userProgram) {
                router.push(`/program/${program.slug}/session` as Href);
                return;
              }

              handleStartProgram();
            }}
          />
        )}

        {startProgramMutation.isError ? (
          <View className="mt-sm">
            <Typography variant="caption" tone="muted" className="text-center">
              Program başlatılırken bir sorun oluştu. Lütfen tekrar dene.
            </Typography>
          </View>
        ) : null}

        {!user ? (
          <View className="mt-sm">
            <Typography variant="caption" tone="muted" className="text-center">
              Programa başlamak için giriş yapmalısın.
            </Typography>
          </View>
        ) : null}
      </View>

      <View className="mt-2xl">
        <Typography variant="h2">Program İçeriği</Typography>

        <View className="mt-xs">
          <Typography variant="body" tone="muted">
            Hareketleri aşağıdaki sırayla tamamla.
          </Typography>
        </View>
      </View>

      <View className="mt-md gap-md">
        {program.exercises.length > 0 ? (
          program.exercises.map((programExercise, index) => (
            <Card key={programExercise.id} variant="outlined" padding="lg">
              <View className="flex-row items-start gap-md">
                <View className="items-center justify-center">
                  <Typography variant="h3">{index + 1}</Typography>
                </View>

                <View className="flex-1">
                  <Typography variant="h3">{programExercise.exercise.name}</Typography>

                  {programExercise.exercise.description ? (
                    <View className="mt-xs">
                      <Typography variant="body" tone="muted">
                        {programExercise.exercise.description}
                      </Typography>
                    </View>
                  ) : null}

                  <View className="mt-md flex-row flex-wrap gap-lg">
                    <View className="flex-row items-center gap-xs">
                      <Ionicons name="repeat-outline" size={16} color={colors.textMuted} />

                      <Typography variant="caption" tone="muted">
                        {formatExercisePrescription(
                          programExercise.durationSeconds,
                          programExercise.repetitions,
                        )}
                      </Typography>
                    </View>

                    {programExercise.restSeconds ? (
                      <View className="flex-row items-center gap-xs">
                        <Ionicons name="timer-outline" size={16} color={colors.textMuted} />

                        <Typography variant="caption" tone="muted">
                          {programExercise.restSeconds} sn dinlenme
                        </Typography>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <View className="items-center py-2xl">
            <Ionicons name="fitness-outline" size={36} color={colors.textMuted} />

            <View className="mt-md">
              <Typography variant="h3">Henüz hareket eklenmemiş</Typography>
            </View>

            <View className="mt-xs">
              <Typography variant="body" tone="muted" className="text-center">
                Bu programın hareketleri daha sonra eklenecek.
              </Typography>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
