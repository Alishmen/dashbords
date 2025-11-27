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

interface PopulationPyramidProps {
  data: Array<{
    ageGroup: string;
    [key: string]: string | number;
  }>;
  leftDataKey: string;
  rightDataKey: string;
  leftLabel: string;
  rightLabel: string;
  leftColor?: string;
  rightColor?: string;
  leftMax?: number;
  rightMax?: number;
  title?: string;
  leftBars?: Array<{ key: string; color: string; label: string }>;
  rightBars?: Array<{ key: string; color: string; label: string }>;
}

export const PopulationPyramid: React.FC<PopulationPyramidProps> = ({
  data,
  leftDataKey,
  rightDataKey,
  leftLabel,
  rightLabel,
  leftColor = '#1e88e5',
  rightColor = '#e53935',
  leftMax,
  rightMax,
  title,
  leftBars,
  rightBars,
}) => {
  // Подготовка данных для отображения
  const chartData = data.map((item) => {
    const result: any = { ageGroup: item.ageGroup };
    
    // Если есть несколько баров слева
    if (leftBars) {
      leftBars.forEach((bar) => {
        result[`left_${bar.key}`] = -(item[bar.key] as number || 0);
      });
    } else {
      result[leftDataKey] = -(item[leftDataKey] as number || 0);
    }
    
    // Если есть несколько баров справа
    if (rightBars) {
      rightBars.forEach((bar) => {
        result[`right_${bar.key}`] = item[bar.key] as number || 0;
      });
    } else {
      result[rightDataKey] = item[rightDataKey] as number || 0;
    }
    
    return result;
  });

  // Определение максимальных значений
  const maxLeft = leftMax || Math.max(...chartData.map(d => Math.abs(d[leftDataKey] || 0)));
  const maxRight = rightMax || Math.max(...chartData.map(d => d[rightDataKey] || 0));

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {title && (
        <h3 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={leftBars || rightBars ? ['auto', 'auto'] : [leftMax ? -leftMax : -maxLeft, rightMax || maxRight]}
            tickFormatter={(value) => Math.abs(value).toString()}
          />
          <YAxis
            dataKey="ageGroup"
            type="category"
            width={80}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const absValue = Math.abs(value);
              if (leftBars || rightBars) {
                const barName = leftBars?.find(b => name.includes(b.key))?.label || 
                               rightBars?.find(b => name.includes(b.key))?.label || 
                               name;
                return [absValue, barName];
              }
              return [absValue, name === leftDataKey ? leftLabel : rightLabel];
            }}
            labelFormatter={(label) => `Возраст: ${label}`}
          />
          <Legend />
          
          {leftBars ? (
            leftBars.map((bar, index) => (
              <Bar
                key={`left_${bar.key}`}
                dataKey={`left_${bar.key}`}
                stackId="left"
                fill={bar.color}
                name={bar.label}
              />
            ))
          ) : (
            <Bar dataKey={leftDataKey} fill={leftColor} name={leftLabel} />
          )}
          
          {rightBars ? (
            rightBars.map((bar) => (
              <Bar
                key={`right_${bar.key}`}
                dataKey={`right_${bar.key}`}
                stackId="right"
                fill={bar.color}
                name={bar.label}
              />
            ))
          ) : (
            <Bar dataKey={rightDataKey} fill={rightColor} name={rightLabel} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

