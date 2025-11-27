import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Typography } from '@mui/material';
import { FilterPanel } from '../shared/FilterPanel';
import { MortalityTable } from './MortalityTable';
import { PopulationPyramid } from '../shared/PopulationPyramid';
import { DiseaseRanking } from './DiseaseRanking';
import { MORanking } from './MORanking';
import { Dashboard3Data, FilterOptions } from '../../types/dashboard.types';
import dashboard3Data from '../../data/dashboard3.json';

export const Dashboard3: React.FC = () => {
  const [data, setData] = useState<Dashboard3Data>(dashboard3Data as Dashboard3Data);
  const [filters, setFilters] = useState<FilterOptions>(data.filterOptions);

  useEffect(() => {
    setData({
      ...data,
      filterOptions: filters,
    });
  }, [filters]);

  const availableOptions = {
    territories: ['Удмуртская Республика', 'Ижевск'],
    mos: data.mortalityByMO.map((mo) => mo.name),
    nosologicalGroups: ['По всем причинам', 'I00-I99', 'C00-C97'],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 600 }}
      >
        Декомпозиция данных. Общий показатель смертности.*
      </Typography>

      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        availableOptions={availableOptions}
      />

      <Grid container spacing={3}>
        {/* Таблица смертности по МО */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <MortalityTable
              overallMortality={data.overallMortality}
              mortalityByMO={data.mortalityByMO}
            />
          </Paper>
        </Grid>

        {/* Половозрастная структура населения */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <PopulationPyramid
              data={data.populationPyramid.map(item => ({
                ageGroup: item.ageGroup,
                men: item.men,
                women: item.women,
              }))}
              leftDataKey="men"
              rightDataKey="women"
              leftLabel="Мужчины"
              rightLabel="Женщины"
              leftColor="#2196f3"
              rightColor="#e91e63"
              title="Половозрастная структура населения."
              leftMax={70000}
              rightMax={70000}
            />
          </Paper>
        </Grid>

        {/* Рейтинг групп заболеваний */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <DiseaseRanking data={data.diseaseRanking} />
          </Paper>
        </Grid>

        {/* Рейтинг МО */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <MORanking data={data.moRanking} />
          </Paper>
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        sx={{ mt: 3, display: 'block', fontStyle: 'italic', color: 'text.secondary' }}
      >
        * Интерактивная фильтрация по территории, МО, участку, полу, возрасту, нозологической группе в соответствии с уровнем доступа роли
      </Typography>
    </Box>
  );
};

