import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface StackedBarChartProps {
  data: Array<{
    ageGroup: string;
    [key: string]: string | number;
  }>;
  leftBars: Array<{ key: string; color: string; label: string }>;
  rightBars?: Array<{ key: string; color: string; label: string }>;
  title?: string;
  leftLabel?: string;
  rightLabel?: string;
  maxValue?: number;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  leftBars,
  rightBars,
  title,
  leftLabel,
  rightLabel,
  maxValue = 100,
}) => {
  // Подготовка данных: инвертируем значения для левой стороны
  const chartData = data.map((item) => {
    const result: any = { ageGroup: item.ageGroup };
    
    leftBars.forEach((bar) => {
      result[`left_${bar.key}`] = -(item[bar.key] as number || 0);
    });
    
    if (rightBars) {
      rightBars.forEach((bar) => {
        result[`right_${bar.key}`] = item[bar.key] as number || 0;
      });
    }
    
    return result;
  });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {title && (
        <h3 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[-maxValue, maxValue]}
            tickFormatter={(value) => Math.abs(value).toString()}
          />
          <YAxis
            dataKey="ageGroup"
            type="category"
            width={90}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const absValue = Math.abs(value);
              const barInfo = [...leftBars, ...(rightBars || [])].find(
                b => name.includes(b.key)
              );
              return [absValue, barInfo?.label || name];
            }}
          />
          <Legend />
          
          {/* Левая сторона (stacked) */}
          {leftBars.map((bar, index) => (
            <Bar
              key={`left_${bar.key}`}
              dataKey={`left_${bar.key}`}
              stackId="left"
              fill={bar.color}
              name={bar.label}
              radius={index === leftBars.length - 1 ? [0, 4, 4, 0] : 0}
            />
          ))}
          
          {/* Правая сторона (stacked, если есть) */}
          {rightBars && rightBars.map((bar, index) => (
            <Bar
              key={`right_${bar.key}`}
              dataKey={`right_${bar.key}`}
              stackId="right"
              fill={bar.color}
              name={bar.label}
              radius={index === 0 ? [4, 0, 0, 4] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

