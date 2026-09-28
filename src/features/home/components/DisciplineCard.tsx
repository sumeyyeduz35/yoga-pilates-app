import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { Card, type CardDiscipline } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';

type DisciplineCardProps = {
  discipline: CardDiscipline;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export function DisciplineCard({
  discipline,
  title,
  description,
  icon,
  onPress,
}: DisciplineCardProps) {
  return (
    <Pressable
      className="flex-1"
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Card discipline={discipline} padding="md" className="min-h-40">
        <View className="flex-1 justify-between">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-surface">
            <Ionicons name={icon} size={20} />
          </View>

          <View className="mt-lg">
            <Typography variant="h3">{title}</Typography>

            <View className="mt-xs">
              <Typography variant="caption" tone="muted">
                {description}
              </Typography>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
