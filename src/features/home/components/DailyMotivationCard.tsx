
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    View,
} from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { getDailyMotivation } from '@/features/home/data/daily-motivations';

const SCREEN_WIDTH = Dimensions.get('window').width;

type MotivationSlide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  backgroundColor: string;
  accentColor: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export function DailyMotivationCard() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const slides: MotivationSlide[] = [
    {
      id: 'motivation',
      eyebrow: 'GÜNÜN MOTİVASYONU',
      title: getDailyMotivation(),
      backgroundColor: '#E4EBDF',
      accentColor: '#55765A',
      icon: 'flower-outline',
    },
    {
      id: 'breathing',
      eyebrow: 'NEFES MOLASI',
      title: 'Bir dakika dur, nefes al.',
      subtitle: '60 saniyelik nefes egzersizi',
      backgroundColor: '#E6ECE8',
      accentColor: '#638C80',
      icon: 'leaf-outline',
    },
    {
      id: 'wellness',
      eyebrow: 'GÜNÜN WELLNESS ÖNERİSİ',
      title: 'Bugün bedenine küçük bir iyilik yap.',
      subtitle: 'Kendine bir esneme molası ver.',
      backgroundColor: '#F3E9E0',
      accentColor: '#B78D77',
      icon: 'sunny-outline',
    },
  ];

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (cardWidth === 0) {
      return;
    }

    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / cardWidth);

    setActiveIndex(
      Math.max(0, Math.min(nextIndex, slides.length - 1)),
    );
  };

  const goToSlide = (index: number) => {
    if (cardWidth === 0) {
      return;
    }

    scrollRef.current?.scrollTo({
      x: index * cardWidth,
      animated: true,
    });

    setActiveIndex(index);
  };

  return (
    <View
      className="mt-lg overflow-hidden rounded-xl"
      style={{ height: 200 }}
      onLayout={(event) => {
        setCardWidth(event.nativeEvent.layout.width);
      }}
    >
      {cardWidth > 0 && (
        <>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
            decelerationRate="fast"
          >
            {slides.map((slide, index) => (
              <View
                key={slide.id}
                style={{
                  width: cardWidth,
                  height: 200,
                  backgroundColor: slide.backgroundColor,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: '44%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  {index === 0 ? (
                    <Image
                      source={require('../../../../assets/images/home/welcome-character.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons
                      name={slide.icon}
                      size={88}
                      color={slide.accentColor}
                      style={{ opacity: 0.55 }}
                    />
                  )}
                </View>

                <View
                  style={{
                    flex: 1,
                    paddingRight: 20,
                    paddingVertical: 16,
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    tone="primary"
                  >
                    {slide.eyebrow}
                  </Typography>

                  <Typography
                    variant="h3"
                    className="mt-sm"
                  >
                    {slide.title}
                  </Typography>

                  {slide.subtitle && (
                    <Typography
                      variant="caption"
                      tone="muted"
                      className="mt-sm"
                    >
                      {slide.subtitle}
                    </Typography>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              bottom: 12,
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 7,
            }}
          >
            {slides.map((slide, index) => (
              <View
                key={slide.id}
                onTouchEnd={() => goToSlide(index)}
                style={{
                  width: activeIndex === index ? 17 : 6,
                  height: 6,
                  borderRadius: 99,
                  backgroundColor:
                    activeIndex === index
                      ? '#55765A'
                      : '#B4C6B6',
                }}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}
