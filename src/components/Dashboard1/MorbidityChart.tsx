import React from 'react';
import { PopulationPyramid } from '../shared/PopulationPyramid';
import { AgeGroupData } from '../../types/dashboard.types';

interface MorbidityChartProps {
  men: AgeGroupData[];
  women: AgeGroupData[];
  title?: string; // Динамическое название графика
}

export const MorbidityChart: React.FC<MorbidityChartProps> = ({ men, women, title }) => {
  // Подготовка данных для пирамиды
  const chartData = men.map((item, index) => ({
    ageGroup: item.ageGroup,
    menPrimary: item.primary,
    menTotal: item.total,
    womenPrimary: women[index]?.primary || 0,
    womenTotal: women[index]?.total || 0,
  })).reverse(); // Переворачиваем порядок: старшие возраста вверху, младшие внизу

  // Автоматическое определение максимальных значений для масштабирования
  const maxMen = Math.max(...chartData.map(d => Math.max(d.menPrimary, d.menTotal)));
  const maxWomen = Math.max(...chartData.map(d => Math.max(d.womenPrimary, d.womenTotal)));
  
  // Добавляем 10% отступа для лучшей видимости
  const leftMax = Math.ceil(maxMen * 1.1);
  const rightMax = Math.ceil(maxWomen * 1.1);

  // Используем переданное название или значение по умолчанию
  const chartTitle = title || 'Половозрастная структура населения';

  return (
    <PopulationPyramid
      data={chartData}
      leftDataKey="menPrimary"
      rightDataKey="womenPrimary"
      leftLabel="Мужчины"
      rightLabel="Женщины"
      leftColor="#1976d2"
      rightColor="#d32f2f"
      title={chartTitle}
      leftMax={leftMax}
      rightMax={rightMax}
      leftBars={[
        { key: 'menPrimary', color: '#1565c0', label: 'Мужчины' },
        { key: 'menTotal', color: '#64b5f6', label: 'Мужчины (общее)' },
      ]}
      rightBars={[
        { key: 'womenPrimary', color: '#c62828', label: 'Женщины' },
        { key: 'womenTotal', color: '#ef5350', label: 'Женщины (общее)' },
      ]}
    />
  );
};

