import React from 'react';
import { PopulationPyramid } from '../shared/PopulationPyramid';
import { AgeGroupData } from '../../types/dashboard.types';

interface MorbidityChartProps {
  men: AgeGroupData[];
  women: AgeGroupData[];
}

export const MorbidityChart: React.FC<MorbidityChartProps> = ({ men, women }) => {
  // Подготовка данных для пирамиды
  const chartData = men.map((item, index) => ({
    ageGroup: item.ageGroup,
    menPrimary: item.primary,
    menTotal: item.total,
    womenPrimary: women[index]?.primary || 0,
    womenTotal: women[index]?.total || 0,
  })).reverse(); // Переворачиваем порядок: старшие возраста вверху, младшие внизу

  return (
    <PopulationPyramid
      data={chartData}
      leftDataKey="menPrimary"
      rightDataKey="womenPrimary"
      leftLabel="Мужчины"
      rightLabel="Женщины"
      leftColor="#1976d2"
      rightColor="#d32f2f"
      title="Заболеваемость."
      leftMax={200}
      rightMax={600}
      leftBars={[
        { key: 'menPrimary', color: '#1565c0', label: 'Первичная заболеваемость' },
        { key: 'menTotal', color: '#64b5f6', label: 'Общая заболеваемость' },
      ]}
      rightBars={[
        { key: 'womenPrimary', color: '#c62828', label: 'Первичная заболеваемость' },
        { key: 'womenTotal', color: '#ef5350', label: 'Общая заболеваемость' },
      ]}
    />
  );
};

