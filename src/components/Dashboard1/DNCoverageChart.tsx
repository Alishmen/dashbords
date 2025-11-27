import React from 'react';
import { PopulationPyramid } from '../shared/PopulationPyramid';
import { AgeGroupData } from '../../types/dashboard.types';

interface DNCoverageChartProps {
  men: AgeGroupData[];
  women: AgeGroupData[];
}

export const DNCoverageChart: React.FC<DNCoverageChartProps> = ({ men, women }) => {
  // Подготовка данных для пирамиды
  const chartData = men.map((item, index) => ({
    ageGroup: item.ageGroup,
    menPrimary: item.primary,
    menTotal: item.total,
    womenPrimary: women[index]?.primary || 0,
    womenTotal: women[index]?.total || 0,
  }));

  return (
    <PopulationPyramid
      data={chartData}
      leftDataKey="menPrimary"
      rightDataKey="womenPrimary"
      leftLabel="Мужчины"
      rightLabel="Женщины"
      leftColor="#1976d2"
      rightColor="#d32f2f"
      title="Охват ДН"
      leftMax={110}
      rightMax={110}
      leftBars={[
        { key: 'menPrimary', color: '#1565c0', label: 'Охват ДН первичным' },
        { key: 'menTotal', color: '#64b5f6', label: 'Охват ДН общим' },
      ]}
      rightBars={[
        { key: 'womenPrimary', color: '#c62828', label: 'Охват ДН первичным' },
        { key: 'womenTotal', color: '#ef5350', label: 'Охват ДН общим' },
      ]}
    />
  );
};

