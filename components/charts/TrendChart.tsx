import React from "react";
import { Text, View } from "react-native";
import { AreaChart, Grid } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { useAppTheme } from "@/hooks/useAppTheme";

interface TrendChartProps {
  title: string;
  data: number[];
  color: string;
  unit?: string;
  textColor?: string;
  mutedColor?: string;
  gridColor?: string;
}

export function TrendChart({ title, data, color, unit, textColor, mutedColor, gridColor }: TrendChartProps) {
  const theme = useAppTheme();
  const safeData = data.length > 0 ? data : [0];

  return (
    <View>
      <Text style={{ color: textColor ?? theme.text, fontSize: 15, fontWeight: "700", marginBottom: 12 }}>{title}</Text>
      <AreaChart
        style={{ height: 140 }}
        data={safeData}
        contentInset={{ top: 16, bottom: 16 }}
        curve={shape.curveMonotoneX}
        svg={{ fill: `${color}33`, stroke: color, strokeWidth: 2.5 }}
      >
        <Grid svg={{ stroke: gridColor ?? theme.border, strokeDasharray: [4, 4] }} />
      </AreaChart>
      {unit ? (
        <Text style={{ color: mutedColor ?? theme.textMuted, fontSize: 11, marginTop: 6 }}>Unidad: {unit}</Text>
      ) : null}
    </View>
  );
}
