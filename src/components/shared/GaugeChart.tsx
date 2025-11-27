import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

interface GaugeChartProps {
  value: number;
  label: string;
  min?: number;
  max?: number;
  unit?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  label,
  min = 0,
  max = 100,
  unit = '%',
}) => {
  // Нормализуем значение для отображения (0-180 градусов, полукруг)
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  // Угол стрелки: 0% = 180°, 100% = 0° (полукруг слева направо)
  const angle = 180 - (percentage / 100) * 180;

  const RADIAN = Math.PI / 180;
  const cx = 120;
  const cy = 120;
  const innerRadius = 50;
  const outerRadius = 80;

  // Расчет позиции стрелки
  const arrowLength = outerRadius - 5;
  const arrowX = cx + Math.cos(angle * RADIAN) * arrowLength;
  const arrowY = cy - Math.sin(angle * RADIAN) * arrowLength;

  // Фоновые сегменты: красный (180-120°), желтый (120-60°), зеленый (60-0°)
  // Визуально: красный слева, желтый посередине, зеленый справа
  const redSegment = { start: 180, end: 120, fill: '#f44336' };
  const yellowSegment = { start: 120, end: 60, fill: '#ffc107' };
  const greenSegment = { start: 60, end: 0, fill: '#4caf50' };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: 280,
        width: '100%',
      }}
    >
      {/* Заголовок */}
      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: '12px', 
          textAlign: 'center', 
          fontWeight: 500,
          mb: 1,
          lineHeight: 1.4,
        }}
      >
        Группа заболеваний: По всем причинам. {label}
      </Typography>

      {/* Датчик */}
      <Box 
        sx={{ 
          width: '100%', 
          height: 140, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <Box sx={{ width: 240, height: 140, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Красный сегмент (слева) */}
              <Pie
                data={[{ value: 60 }]}
                cx={cx}
                cy={cy}
                startAngle={redSegment.start}
                endAngle={redSegment.end}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                dataKey="value"
                isAnimationActive={false}
              >
                <Cell fill={redSegment.fill} />
              </Pie>
              
              {/* Желтый сегмент (посередине) */}
              <Pie
                data={[{ value: 60 }]}
                cx={cx}
                cy={cy}
                startAngle={yellowSegment.start}
                endAngle={yellowSegment.end}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                dataKey="value"
                isAnimationActive={false}
              >
                <Cell fill={yellowSegment.fill} />
              </Pie>
              
              {/* Зеленый сегмент (справа) */}
              <Pie
                data={[{ value: 60 }]}
                cx={cx}
                cy={cy}
                startAngle={greenSegment.start}
                endAngle={greenSegment.end}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                dataKey="value"
                isAnimationActive={false}
              >
                <Cell fill={greenSegment.fill} />
              </Pie>

              {/* Стрелка */}
              <g>
                <line
                  x1={cx}
                  y1={cy}
                  x2={arrowX}
                  y2={arrowY}
                  stroke="#000"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <circle cx={cx} cy={cy} r={4} fill="#000" />
              </g>
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Значение */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 'bold', 
          fontSize: '20px',
          mt: 1,
          mb: 0.5,
        }}
      >
        {value.toFixed(2)}
        {unit}
      </Typography>

      {/* Подписи */}
      <Box sx={{ textAlign: 'center', mt: 0.5 }}>
        <Typography variant="caption" sx={{ fontSize: '10px', display: 'block', color: 'text.secondary' }}>
          Удмуртская Республика
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '10px', display: 'block', color: 'text.secondary' }}>
          Группа заболеваний: По всем причинам
        </Typography>
      </Box>
    </Paper>
  );
};

export default GaugeChart;

