
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};

export function YogaIcon({
  size = 48,
  color = '#263D32',
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle
        cx="32"
        cy="12"
        r="5"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M27 23C27 19 29 18 32 18S37 19 37 23L39 37M27 23L25 37M32 19V39"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M25 37L17 43C12 46 15 51 20 50L32 47L44 50C49 51 52 46 47 43L39 37"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 43L28 45M47 43L36 45M20 54H44"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PilatesIcon({
  size = 48,
  color = '#263D32',
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle
        cx="15"
        cy="22"
        r="4"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M19 25L27 34L39 39L51 34M27 34L35 45L49 45M12 27L19 37L30 42"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M51 34L55 25M49 45L55 45M9 50H57"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ReformerIcon({
  size = 48,
  color = '#263D32',
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect
        x="7"
        y="40"
        width="50"
        height="6"
        rx="2"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M12 46V53M52 46V53M8 53H16M48 53H56M17 40L30 34L42 26M42 26L49 35L54 40"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="43"
        cy="20"
        r="4"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M47 22L51 30L55 37M30 34L23 28L16 33"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Takip ekranı — Hızlı Kayıt
 * İçinde su bulunan özel bardak ikonu.
 */
export function WaterGlassIcon({
  size = 48,
  color = '#67ACCD',
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path
        d="M19 13H45L42 47C41.6 52 37.5 55 32 55C26.5 55 22.4 52 22 47L19 13Z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 25C24 22 28 22 32 25C36 28 40 28 44 25"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M23 31C27 29 30 29 33 31C36 33 39 33 42 31"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity={0.65}
      />
      <Path
        d="M25 38C28 36 31 36 34 38C36 39.5 38 39.5 40 38"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity={0.45}
      />
    </Svg>
  );
}

/**
 * Takip ekranı — Günlük Seri
 * İki renkli, dolu ateş ikonu.
 */
export function WellnessFlameIcon({
  size = 32,
  color = '#E59A43',
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path
        d="M34 6C36 17 27 20 28 29C23 26 23 21 23 18C15 25 12 34 15 43C18 53 25 58 33 58C45 58 52 49 52 38C52 26 44 17 34 6Z"
        fill={color}
        opacity={0.95}
      />
      <Path
        d="M34 31C35 37 29 40 28 44C27 47 29 52 33 54C39 54 43 49 42 43C41 38 38 34 34 31Z"
        fill="#FFF1D6"
      />
    </Svg>
  );
}
