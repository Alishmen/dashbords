import React from 'react';
import { StackedBarChart } from '../shared/StackedBarChart';
import { PlaceOfDeathData } from '../../types/dashboard.types';

interface PlaceOfDeathProps {
  men: PlaceOfDeathData[];
  women: PlaceOfDeathData[];
}

export const PlaceOfDeath: React.FC<PlaceOfDeathProps> = ({ men, women }) => {
  const menData = men.map((item) => ({
    ageGroup: item.ageGroup,
    home: item.home,
    hospital: item.hospital,
  }));

  const womenData = women.map((item) => ({
    ageGroup: item.ageGroup,
    home: item.home,
    hospital: item.hospital,
  }));

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
        Половозрастная структура по месту смерти
      </h3>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Мужчины</h4>
          <StackedBarChart
            data={menData}
            leftBars={[
              { key: 'home', color: '#2196f3', label: 'Доля умерших на дому от БСК, %' },
            ]}
            rightBars={[
              { key: 'hospital', color: '#ff9800', label: 'Доля умерших от БСК в стационаре, %' },
            ]}
            maxValue={100}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Женщины</h4>
          <StackedBarChart
            data={womenData}
            leftBars={[
              { key: 'home', color: '#2196f3', label: 'Доля умерших на дому от БСК, %' },
            ]}
            rightBars={[
              { key: 'hospital', color: '#ff9800', label: 'Доля умерших от БСК в стационаре, %' },
            ]}
            maxValue={100}
          />
        </div>
      </div>
    </div>
  );
};

