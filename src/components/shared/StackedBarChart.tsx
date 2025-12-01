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
  // Если нет rightBars, отображаем leftBars справа (положительные значения) для растяжения на всю ширину
  const chartData = data.map((item) => {
    const result: any = { ageGroup: item.ageGroup };
    
    if (rightBars) {
      // Есть rightBars - используем стандартную логику: leftBars слева (отрицательные), rightBars справа (положительные)
      leftBars.forEach((bar) => {
        result[`left_${bar.key}`] = -(item[bar.key] as number || 0);
      });
      rightBars.forEach((bar) => {
        result[`right_${bar.key}`] = item[bar.key] as number || 0;
      });
    } else {
      // Нет rightBars - отображаем leftBars справа (положительные значения) для растяжения на всю ширину
      leftBars.forEach((bar) => {
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
      <ResponsiveContainer width="100%" height={Math.max(500, data.length * 25 + 100)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={rightBars ? [-maxValue, maxValue] : [0, maxValue]}
            tickFormatter={(value) => Math.abs(value).toString()}
          />
          <YAxis
            dataKey="ageGroup"
            type="category"
            width={90}
            tick={{ fontSize: 12 }}
            interval={0}
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
          
          {/* Левая сторона (stacked) - только если есть rightBars */}
          {rightBars && leftBars.map((bar, index) => (
            <Bar
              key={`left_${bar.key}`}
              dataKey={`left_${bar.key}`}
              stackId="left"
              fill={bar.color}
              name={bar.label}
              radius={index === leftBars.length - 1 ? [0, 4, 4, 0] : 0}
            />
          ))}
          
          {/* Правая сторона (stacked) - либо rightBars, либо leftBars если нет rightBars */}
          {rightBars ? (
            rightBars.map((bar, index) => (
              <Bar
                key={`right_${bar.key}`}
                dataKey={`right_${bar.key}`}
                stackId="right"
                fill={bar.color}
                name={bar.label}
                radius={index === 0 ? [4, 0, 0, 4] : 0}
              />
            ))
          ) : (
            leftBars.map((bar, index) => (
              <Bar
                key={`right_${bar.key}`}
                dataKey={`right_${bar.key}`}
                stackId="right"
                fill={bar.color}
                name={bar.label}
                radius={index === leftBars.length - 1 ? [4, 4, 0, 0] : 0}
              />
            ))
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

