import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useDisciplinesQuery, useProgramsQuery } from '@/features/content/queries/content-queries';
import type { DisciplineSlug } from '@/features/content/types/content';
import { useTheme } from '@/providers/theme-provider';
import { disciplineTheme } from '@/theme/discipline-theme';

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

export default function ProgramsScreen() {
  const { colors } = useTheme();

  const disciplinesQuery = useDisciplinesQuery();
  const programsQuery = useProgramsQuery();

  const disciplines = disciplinesQuery.data ?? [];
  const programs = programsQuery.data ?? [];

  const isLoading = disciplinesQuery.isLoading || programsQuery.isLoading;
  const isError = disciplinesQuery.isError || programsQuery.isError;

  const getDisciplineSlug = (disciplineId: string): DisciplineSlug | undefined =>
    disciplines.find((discipline) => discipline.id === disciplineId)?.slug;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <ActivityIndicator size="large" color={colors.primary} />

        <View className="mt-md">
          <Typography variant="body" tone="muted">
            Programlar yükleniyor...
          </Typography>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <Ionicons name="alert-circle-outline" size={36} color={colors.textMuted} />

        <View className="mt-md">
          <Typography variant="h3">Programlar yüklenemedi</Typography>
        </View>

        <View className="mt-xs">
          <Typography variant="body" tone="muted" className="text-center">
            İçeriklere ulaşırken bir sorun oluştu. Lütfen tekrar dene.
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
      <Typography variant="h1">Programlar</Typography>

      <View className="mt-xs">
        <Typography variant="body" tone="muted">
          Yoga, Pilates ve Reformer programlarını keşfet.
        </Typography>
      </View>

      <View className="mt-xl flex-row items-end justify-between">
        <Typography variant="h2">Tüm Programlar</Typography>

        <Typography variant="caption" tone="muted">
          {programs.length} program
        </Typography>
      </View>

      <View className="mt-md gap-md">
        {programs.length > 0 ? (
          programs.map((program) => {
            const disciplineSlug = getDisciplineSlug(program.disciplineId);

            if (!disciplineSlug) {
              return null;
            }

            const discipline = disciplineTheme[disciplineSlug];

            return (
              <Card key={program.id} variant="outlined" discipline={disciplineSlug} padding="lg">
                <View className="flex-row items-start justify-between gap-md">
                  <View className="flex-1">
                    <Typography variant="caption">{discipline.label}</Typography>

                    <View className="mt-xs">
                      <Typography variant="h3">{program.title}</Typography>
                    </View>
                  </View>

                  <Ionicons name="fitness-outline" size={24} color={discipline.color} />
                </View>

                {program.description ? (
                  <View className="mt-sm">
                    <Typography variant="body" tone="muted">
                      {program.description}
                    </Typography>
                  </View>
                ) : null}

                <View className="mt-md flex-row items-center gap-lg">
                  <View className="flex-row items-center gap-xs">
                    <Ionicons name="speedometer-outline" size={16} color={colors.textMuted} />

                    <Typography variant="caption" tone="muted">
                      {getDifficultyLabel(program.difficulty)}
                    </Typography>
                  </View>

                  {program.durationMinutes ? (
                    <View className="flex-row items-center gap-xs">
                      <Ionicons name="time-outline" size={16} color={colors.textMuted} />

                      <Typography variant="caption" tone="muted">
                        {program.durationMinutes} dk
                      </Typography>
                    </View>
                  ) : null}
                </View>
              </Card>
            );
          })
        ) : (
          <View className="items-center py-2xl">
            <Ionicons name="fitness-outline" size={36} color={colors.textMuted} />

            <View className="mt-md">
              <Typography variant="h3">Henüz program yok</Typography>
            </View>

            <View className="mt-xs">
              <Typography variant="body" tone="muted" className="text-center">
                Yeni programlar eklendiğinde burada görüntülenecek.
              </Typography>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
