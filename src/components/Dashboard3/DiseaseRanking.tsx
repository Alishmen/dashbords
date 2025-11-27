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
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { DiseaseRankingData } from '../../types/dashboard.types';

interface DiseaseRankingProps {
  data: DiseaseRankingData[];
}

export const DiseaseRanking: React.FC<DiseaseRankingProps> = ({ data }) => {
  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
        Рейтинг групп заболеваний по числу умерших, чел.
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 60, bottom: 60, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="code"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            label={{ value: 'Число умерших, чел.', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            label={{ value: 'Кумулятивный процент, %', angle: 90, position: 'insideRight' }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'cumulativePercent') {
                return [`${value.toFixed(1)}%`, 'Кривая Парето'];
              }
              return [value, name === 'deaths' ? 'Число умерших' : ''];
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="deaths" name="Число умерших" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isSignificant ? '#f44336' : '#9e9e9e'}
              />
            ))}
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulativePercent"
            stroke="#1976d2"
            strokeWidth={2}
            name="Кривая Парето"
            dot={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

