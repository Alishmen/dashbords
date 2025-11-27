import React from 'react';
import { StackedBarChart } from '../shared/StackedBarChart';
import { OutpatientStructureData } from '../../types/dashboard.types';

interface OutpatientStructureProps {
  men: OutpatientStructureData[];
  women: OutpatientStructureData[];
}

export const OutpatientStructure: React.FC<OutpatientStructureProps> = ({ men, women }) => {
  const menData = men.map((item) => ({
    ageGroup: item.ageGroup,
    visitedMOPerCause: item.visitedMOPerCause,
    didNotVisitMO: item.didNotVisitMO,
    visitedMOOtherReason: item.visitedMOOtherReason,
  }));

  const womenData = women.map((item) => ({
    ageGroup: item.ageGroup,
    visitedMOPerCause: item.visitedMOPerCause,
    didNotVisitMO: item.didNotVisitMO,
    visitedMOOtherReason: item.visitedMOOtherReason,
  }));

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
        Структура обращаемости среди умерших вне стационара, %
      </h3>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Мужчины</h4>
          <StackedBarChart
            data={menData}
            leftBars={[
              { key: 'visitedMOPerCause', color: '#ff9800', label: 'Из умерших вне стационара по причине 100-99 посещали МО по причине 100-99' },
              { key: 'didNotVisitMO', color: '#2196f3', label: 'Из умерших вне стационара по причине 100-99 не посещали МО' },
              { key: 'visitedMOOtherReason', color: '#4caf50', label: 'Из умерших вне стационара по причине 100-99 посещали МО по другой причине' },
            ]}
            maxValue={100}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Женщины</h4>
          <StackedBarChart
            data={womenData}
            leftBars={[
              { key: 'visitedMOPerCause', color: '#ff9800', label: 'Из умерших вне стационара по причине 100-99 посещали МО по причине 100-99' },
              { key: 'didNotVisitMO', color: '#2196f3', label: 'Из умерших вне стационара по причине 100-99 не посещали МО' },
              { key: 'visitedMOOtherReason', color: '#4caf50', label: 'Из умерших вне стационара по причине 100-99 посещали МО по другой причине' },
            ]}
            maxValue={100}
          />
        </div>
      </div>
    </div>
  );
};

