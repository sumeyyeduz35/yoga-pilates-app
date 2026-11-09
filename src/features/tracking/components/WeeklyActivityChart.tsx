
import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';

import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

export type ActivityChartItem = {
  date: string;
  label: string;
  minutes: number;
};

// Önceki kullanımlarla uyumluluğu koruyoruz.
export type WeeklyActivityDay = ActivityChartItem;

type WeeklyActivityChartProps = {
  data: ActivityChartItem[];
};

const CHART_WIDTH = 320;
const CHART_HEIGHT = 160;
const CHART_PADDING_TOP = 12;
const CHART_PADDING_BOTTOM = 8;
const MAX_TICKS = 4;

export function WeeklyActivityChart({
  data,
}: WeeklyActivityChartProps) {
  const { colors, mode } = useTheme();

  const chart = useMemo(() => {
    const maxMinutes = Math.max(
      0,
      ...data.map((item) => item.minutes),
    );

    const maxValue = Math.max(
      20,
      Math.ceil(maxMinutes / 20) * 20,
    );

    const innerHeight =
      CHART_HEIGHT -
      CHART_PADDING_TOP -
      CHART_PADDING_BOTTOM;

    const slotWidth =
      CHART_WIDTH / Math.max(data.length, 1);

    const barWidth = Math.min(
      32,
      slotWidth * 0.55,
    );

    return {
      maxValue,
      innerHeight,
      slotWidth,
      barWidth,
    };
  }, [data]);

  const barColor =
    mode === 'dark' ? colors.primary : '#91B19A';

  const gridColor = colors.border;

  return (
    <View>
      <View className="flex-row">
        {/* Y axis */}
        <View
          style={{
            width: 34,
            height: CHART_HEIGHT,
            justifyContent: 'space-between',
            paddingBottom: CHART_PADDING_BOTTOM,
          }}
        >
          {Array.from(
            { length: MAX_TICKS + 1 },
            (_, index) => {
              const value =
                chart.maxValue *
                (1 - index / MAX_TICKS);

              return (
                <Typography
                  key={index}
                  variant="caption"
                  tone="muted"
                  style={{
                    fontSize: 9,
                    textAlign: 'right',
                    paddingRight: 5,
                  }}
                >
                  {Math.round(value)}
                </Typography>
              );
            },
          )}
        </View>

        {/* Activity bars */}
        <View className="flex-1">
          <Svg
            width="100%"
            height={CHART_HEIGHT}
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          >
            {Array.from(
              { length: MAX_TICKS + 1 },
              (_, index) => {
                const y =
                  CHART_PADDING_TOP +
                  (index / MAX_TICKS) *
                    chart.innerHeight;

                return (
                  <Line
                    key={`grid-${index}`}
                    x1={0}
                    x2={CHART_WIDTH}
                    y1={y}
                    y2={y}
                    stroke={gridColor}
                    strokeWidth={1}
                    strokeDasharray="3 4"
                  />
                );
              },
            )}

            {data.map((item, index) => {
              const safeMinutes = Math.max(
                0,
                item.minutes,
              );

              const barHeight =
                (safeMinutes / chart.maxValue) *
                chart.innerHeight;

              const x =
                index * chart.slotWidth +
                (chart.slotWidth -
                  chart.barWidth) /
                  2;

              const y =
                CHART_PADDING_TOP +
                chart.innerHeight -
                barHeight;

              return (
                <Rect
                  key={item.date}
                  x={x}
                  y={y}
                  width={chart.barWidth}
                  height={barHeight}
                  rx={5}
                  fill={barColor}
                />
              );
            })}
          </Svg>
        </View>
      </View>

      {/* Dynamic period labels */}
      <View className="mt-sm flex-row">
        <View style={{ width: 34 }} />

        <View className="flex-1 flex-row">
          {data.map((item) => (
            <View
              key={item.date}
              className="flex-1 items-center"
            >
              <Typography
                variant="caption"
                tone="muted"
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                className="text-center"
                style={{
                  fontSize: 10,
                  lineHeight: 14,
                }}
              >
                {item.label}
              </Typography>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
