import React from 'react';
import { PopulationPyramid } from '../shared/PopulationPyramid';
import { DeathsByAgeSex as DeathsByAgeSexType } from '../../types/dashboard.types';

interface DeathsByAgeSexProps {
  data: DeathsByAgeSexType[];
}

export const DeathsByAgeSex: React.FC<DeathsByAgeSexProps> = ({ data }) => {
  return (
    <PopulationPyramid
      data={data.map(item => ({
        ageGroup: item.ageGroup,
        men: item.men,
        women: item.women,
      })).reverse()}
      leftDataKey="men"
      rightDataKey="women"
      leftLabel="Мужчины, умерло по причине: по всем причинам"
      rightLabel="Женщины, умерло по причине: по всем причинам"
      leftColor="#ff9800"
      rightColor="#2196f3"
      title="Число умерших по полу и возрасту, чел."
    />
  );
};

