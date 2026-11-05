import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};

export function YogaIcon({ size = 48, color = '#263D32' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle cx="32" cy="12" r="5" stroke={color} strokeWidth="1.8" />
      <Path d="M27 23C27 19 29 18 32 18S37 19 37 23L39 37M27 23L25 37M32 19V39" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M25 37L17 43C12 46 15 51 20 50L32 47L44 50C49 51 52 46 47 43L39 37" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 43L28 45M47 43L36 45M20 54H44" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function PilatesIcon({ size = 48, color = '#263D32' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle cx="15" cy="22" r="4" stroke={color} strokeWidth="1.8" />
      <Path d="M19 25L27 34L39 39L51 34M27 34L35 45L49 45M12 27L19 37L30 42" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M51 34L55 25M49 45L55 45M9 50H57" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function ReformerIcon({ size = 48, color = '#263D32' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="7" y="40" width="50" height="6" rx="2" stroke={color} strokeWidth="1.8" />
      <Path d="M12 46V53M52 46V53M8 53H16M48 53H56M17 40L30 34L42 26M42 26L49 35L54 40" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="43" cy="20" r="4" stroke={color} strokeWidth="1.8" />
      <Path d="M47 22L51 30L55 37M30 34L23 28L16 33" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
