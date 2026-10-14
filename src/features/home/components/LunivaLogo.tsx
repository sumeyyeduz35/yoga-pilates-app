
import { View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { Typography } from '@/components/ui/Typography';
import { BRAND } from '@/config/branding';

type LunivaLogoProps = {
  compact?: boolean;
};

function BotanicalMark() {
  return (
    <Svg width={37} height={43} viewBox="0 0 44 50">
      <Path
        d="M22 46 C22 34 22 21 22 7"
        stroke="#658B76"
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />

      <Ellipse
        cx={22}
        cy={15}
        rx={7}
        ry={15}
        fill="#789986"
      />

      <Ellipse
        cx={12}
        cy={30}
        rx={6}
        ry={14}
        fill="#8CA998"
        transform="rotate(-42 12 30)"
      />

      <Ellipse
        cx={32}
        cy={30}
        rx={6}
        ry={14}
        fill="#658B76"
        transform="rotate(42 32 30)"
      />

      <Path
        d="M5 43 Q22 38 39 43"
        stroke="#658B76"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function LunivaLogo({
  compact = false,
}: LunivaLogoProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <BotanicalMark />

      <View>
        <Typography
          variant={compact ? 'h2' : 'h1'}
          tone="primary"
        >
          {BRAND.wordmark}
        </Typography>

        <Typography
          variant="caption"
          tone="muted"
          style={{
            letterSpacing: 2.2,
          }}
        >
          KENDİNE İYİ GEL
        </Typography>
      </View>
    </View>
  );
}
