
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

export type ExploreDiscipline =
  | 'yoga'
  | 'pilates'
  | 'reformer';

type Props = {
  onSelect: (discipline: ExploreDiscipline) => void;
};

const CARD_GAP = 8;
const CARD_HEIGHT = 145;

const items = [
  {
    key: 'yoga' as const,
    title: 'Yoga',
    subtitle: 'Daha sakin\nve dengeli bir sen',
    background: '#E5E9DC',
    leaf: '#91A18B',
    arrow: '#4A6757',
    image: require('../../../../assets/images/explore/disciplines/yoga.png'),
  },
  {
    key: 'pilates' as const,
    title: 'Pilates',
    subtitle: 'Daha güçlü\nve kontrollü bir sen',
    background: '#F7E9DD',
    leaf: '#D5AD8E',
    arrow: '#A78464',
    image: require('../../../../assets/images/explore/disciplines/pilates.png'),
  },
  {
    key: 'reformer' as const,
    title: 'Reformer',
    subtitle: 'Daha esnek\nve dengeli bir sen',
    background: '#F4E0DC',
    leaf: '#C99B91',
    arrow: '#A77970',
    image: require('../../../../assets/images/explore/disciplines/reformer.png'),
  },
];

function BotanicalLeaves({ color }: { color: string }) {
  return (
    <View pointerEvents="none" style={styles.botanical}>
      <Svg
        width={88}
        height={146}
        viewBox="0 0 88 146"
        fill="none"
      >
        <Path
          d="M83 146C77 115 64 90 48 68M70 115C54 99 35 94 20 91M59 84C68 66 69 45 67 19"
          stroke={color}
          strokeWidth={1.1}
          opacity={0.27}
        />
        <Path
          d="M50 72C31 59 24 39 25 24C42 33 51 52 50 72Z"
          fill={color}
          opacity={0.16}
        />
        <Path
          d="M67 52C52 37 54 18 63 3C74 17 78 36 67 52Z"
          fill={color}
          opacity={0.21}
        />
        <Path
          d="M64 100C48 104 31 102 17 92C35 82 55 87 64 100Z"
          fill={color}
          opacity={0.20}
        />
        <Path
          d="M79 131C63 129 53 116 51 103C66 106 77 116 79 131Z"
          fill={color}
          opacity={0.19}
        />
        <Path
          d="M45 65C45 50 35 33 25 24M64 100C47 93 33 92 17 92"
          stroke={color}
          strokeWidth={0.7}
          opacity={0.18}
        />
      </Svg>
    </View>
  );
}

export function DisciplineCards({ onSelect }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const measuredWidth = event.nativeEvent.layout.width;

    if (Math.abs(measuredWidth - containerWidth) > 0.5) {
      setContainerWidth(measuredWidth);
    }
  };

  const cardWidth =
    containerWidth > 0
      ? (containerWidth - CARD_GAP * 2) / 3
      : 0;

  return (
    <View
      style={styles.row}
      onLayout={handleLayout}
    >
      {items.map((item) => (
        <View
          key={item.key}
          style={[
            styles.cardWrapper,
            cardWidth > 0
              ? { width: cardWidth }
              : { flex: 1, minWidth: 0 },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.title} disiplinini keşfet`}
            onPress={() => onSelect(item.key)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: item.background,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            {/* Desenler bu katmanın dışına çıkamaz */}
            <View
              pointerEvents="none"
              style={styles.backgroundLayer}
            >
              <BotanicalLeaves color={item.leaf} />
            </View>

            {/* İkon */}
            <Image
              source={item.image}
              style={styles.icon}
              resizeMode="contain"
            />

            {/* Başlık */}
            <Text
              style={styles.title}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {item.title}
            </Text>

            {/* Açıklama */}
            <Text
              style={styles.subtitle}
              numberOfLines={2}
            >
              {item.subtitle}
            </Text>

            {/* Sağ alt yönlendirme */}
            <View
              pointerEvents="none"
              style={[
                styles.arrow,
                { backgroundColor: item.arrow },
              ]}
            >
              <Ionicons
                name="arrow-forward"
                size={13}
                color="#FFFFFF"
              />
            </View>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    gap: CARD_GAP,
  },

  cardWrapper: {
    height: CARD_HEIGHT,
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 0,
    borderRadius: 18,
    overflow: 'hidden',
  },

  card: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 9,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(80, 75, 65, 0.10)',
  },

  // Kartın arka plan katmanı
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    borderRadius: 18,
  },

  botanical: {
    position: 'absolute',
    right: -12,
    top: -8,
    opacity: 0.65,
  },

  icon: {
    width: 54,
    height: 43,
    marginLeft: -2,
    marginBottom: 4,
  },

  title: {
    fontSize: 15,
    lineHeight: 20,
    color: '#253027',
    fontFamily: 'serif',
    includeFontPadding: false,
  },

  subtitle: {
    fontSize: 9,
    lineHeight: 12,
    color: '#53544D',
    marginTop: 4,
    paddingRight: 2,
    includeFontPadding: false,
  },

  arrow: {
    position: 'absolute',
    right: 7,
    bottom: 7,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
