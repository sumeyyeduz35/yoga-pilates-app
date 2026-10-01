import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useProgramQuery } from '@/features/content/queries/content-queries';
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
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const programQuery = useProgramQuery(slug);
  const program = programQuery.data;

  const userProgramQuery = useUserProgramQuery(user?.id, program?.id);
  const userProgram = userProgramQuery.data;

  const exerciseProgressQuery = useUserProgramExerciseProgressQuery(userProgram?.id);

  const exerciseProgress = exerciseProgressQuery.data ?? [];

  const setExerciseCompletedMutation = useSetProgramExerciseCompletedMutation(userProgram?.id);

  const completeProgramMutation = useCompleteProgramMutation(
    user?.id,
    program?.id,
    userProgram?.id,
  );

  const isLoading =
    programQuery.isLoading || userProgramQuery.isLoading || exerciseProgressQuery.isLoading;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <ActivityIndicator size="large" color={colors.primary} />

        <View className="mt-md">
          <Typography variant="body" tone="muted">
            Program hazırlanıyor...
          </Typography>
        </View>
      </View>
    );
  }

  if (!program || !userProgram) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <Ionicons name="alert-circle-outline" size={40} color={colors.textMuted} />

        <View className="mt-md">
          <Typography variant="h3">Program oturumu bulunamadı</Typography>
        </View>

        <View className="mt-xs">
          <Typography variant="body" tone="muted" className="text-center">
            Bu programa başlamadan oturum ekranı açılamaz.
          </Typography>
        </View>
      </View>
    );
  }

  const completedCount = exerciseProgress.filter((item) => item.isCompleted).length;

  const totalExerciseCount = program.exercises.length;

  const allExercisesCompleted = totalExerciseCount > 0 && completedCount === totalExerciseCount;

  const isProgramCompleted = userProgram.status === 'completed';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-lg pb-2xl pt-lg"
      showsVerticalScrollIndicator={false}
    >
      <Typography variant="h1">{program.title}</Typography>

      <View className="mt-xs">
        <Typography variant="body" tone="muted">
          {isProgramCompleted ? 'Program tamamlandı' : 'Aktif program oturumu'}
        </Typography>
      </View>

      <View className="mt-lg">
        <Card variant="outlined" padding="lg">
          <View className="flex-row items-center justify-between gap-md">
            <View className="flex-1">
              <Typography variant="h3">İlerleme</Typography>

              <View className="mt-sm">
                <Typography variant="body" tone="muted">
                  {completedCount} / {totalExerciseCount} hareket tamamlandı
                </Typography>
              </View>
            </View>

            <Ionicons
              name={allExercisesCompleted ? 'checkmark-circle' : 'fitness-outline'}
              size={32}
              color={allExercisesCompleted ? colors.primary : colors.textMuted}
            />
          </View>
        </Card>
      </View>

      {isProgramCompleted ? (
        <View className="mt-lg">
          <Card variant="outlined" padding="lg">
            <View className="items-center">
              <Ionicons name="checkmark-circle" size={44} color={colors.primary} />

              <View className="mt-sm">
                <Typography variant="h3">Tebrikler!</Typography>
              </View>

              <View className="mt-xs">
                <Typography variant="body" tone="muted" className="text-center">
                  Bu programı başarıyla tamamladın.
                </Typography>
              </View>
            </View>
          </Card>
        </View>
      ) : null}

      <View className="mt-xl">
        <Typography variant="h2">Hareketler</Typography>
      </View>

      <View className="mt-md gap-md">
        {program.exercises.map((programExercise, index) => {
          const progress = exerciseProgress.find(
            (item) => item.programExerciseId === programExercise.id,
          );

          const isCompleted = progress?.isCompleted ?? false;

          const isThisMutationPending =
            setExerciseCompletedMutation.isPending &&
            setExerciseCompletedMutation.variables?.programExerciseId === programExercise.id;

          return (
            <Card key={programExercise.id} variant="outlined" padding="lg">
              <View className="flex-row items-start justify-between gap-md">
                <View className="flex-1">
                  <Typography variant="caption">Hareket {index + 1}</Typography>

                  <View className="mt-xs">
                    <Typography variant="h3">{programExercise.exercise.name}</Typography>
                  </View>

                  {programExercise.exercise.description ? (
                    <View className="mt-xs">
                      <Typography variant="body" tone="muted">
                        {programExercise.exercise.description}
                      </Typography>
                    </View>
                  ) : null}
                </View>

                <Ionicons
                  name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                  size={28}
                  color={isCompleted ? colors.primary : colors.textMuted}
                />
              </View>

              {!isProgramCompleted ? (
                <View className="mt-md">
                  <Button
                    label={isCompleted ? 'Tamamlamayı Geri Al' : 'Hareketi Tamamla'}
                    variant={isCompleted ? 'outline' : 'secondary'}
                    fullWidth
                    loading={isThisMutationPending}
                    onPress={() => {
                      setExerciseCompletedMutation.mutate({
                        programExerciseId: programExercise.id,
                        isCompleted: !isCompleted,
                      });
                    }}
                  />
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>

      {setExerciseCompletedMutation.isError ? (
        <View className="mt-md">
          <Typography variant="caption" tone="muted" className="text-center">
            Hareket durumu güncellenirken bir sorun oluştu.
          </Typography>
        </View>
      ) : null}

      {!isProgramCompleted ? (
        <View className="mt-xl">
          <Button
            label="Programı Bitir"
            size="lg"
            fullWidth
            loading={completeProgramMutation.isPending}
            disabled={!allExercisesCompleted}
            onPress={() => {
              completeProgramMutation.mutate();
            }}
          />

          {!allExercisesCompleted ? (
            <View className="mt-sm">
              <Typography variant="caption" tone="muted" className="text-center">
                Programı bitirmek için tüm hareketleri tamamla.
              </Typography>
            </View>
          ) : null}
        </View>
      ) : null}

      {completeProgramMutation.isError ? (
        <View className="mt-sm">
          <Typography variant="caption" tone="muted" className="text-center">
            Program tamamlanırken bir sorun oluştu. Lütfen tekrar dene.
          </Typography>
        </View>
      ) : null}
    </ScrollView>
  );
}
