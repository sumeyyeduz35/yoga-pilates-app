import { ScrollView, View } from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { ContinuePracticeCard } from '@/features/home/components/ContinuePracticeCard';
import { DisciplineCard } from '@/features/home/components/DisciplineCard';
import { FeaturedPracticeCard } from '@/features/home/components/FeaturedPracticeCard';
import {
  continuePractice,
  featuredPractice,
  homeDisciplines,
} from '@/features/home/data/home-data';

export default function HomeScreen() {
  const primaryDisciplines = homeDisciplines.slice(0, 2);
  const reformer = homeDisciplines[2];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-lg pb-2xl pt-lg"
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome */}
      <View className="gap-xs">
        <Typography variant="body" tone="muted">
          Merhaba
        </Typography>

        <Typography variant="h1">Bugün kendin için hareket et.</Typography>

        <Typography variant="body" tone="muted">
          Bedenine ve enerjine uygun pratiği seç.
        </Typography>
      </View>

      {/* Continue Practice */}
      <View className="mt-xl">
        <Typography variant="h2">Devam Et</Typography>

        <View className="mt-md">
          <ContinuePracticeCard
            title={continuePractice.title}
            discipline={continuePractice.discipline}
            duration={continuePractice.duration}
            progress={continuePractice.progress}
          />
        </View>
      </View>

      {/* Disciplines */}
      <View className="mt-xl">
        <Typography variant="h2">Disiplinler</Typography>

        <View className="mt-md gap-md">
          <View className="flex-row gap-md">
            {primaryDisciplines.map((discipline) => (
              <DisciplineCard
                key={discipline.key}
                discipline={discipline.key}
                title={discipline.title}
                description={discipline.description}
                icon={discipline.icon}
              />
            ))}
          </View>

          <DisciplineCard
            discipline={reformer.key}
            title={reformer.title}
            description={reformer.description}
            icon={reformer.icon}
          />
        </View>
      </View>

      {/* Featured Practice */}
      <View className="mt-xl">
        <Typography variant="h2">Bugünün pratiği</Typography>

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
