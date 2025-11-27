import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Typography } from '@mui/material';
import { FilterPanel } from '../shared/FilterPanel';
import { DeathsByAgeSex } from './DeathsByAgeSex';
import { PlaceOfDeath } from './PlaceOfDeath';
import { OutpatientStructure } from './OutpatientStructure';
import { MortalityRates } from './MortalityRates';
import { Dashboard2Data, FilterOptions } from '../../types/dashboard.types';
import dashboard2Data from '../../data/dashboard2.json';

export const Dashboard2: React.FC = () => {
  const [data, setData] = useState<Dashboard2Data>(dashboard2Data as Dashboard2Data);
  const [filters, setFilters] = useState<FilterOptions>(data.filterOptions);

  useEffect(() => {
    setData({
      ...data,
      filterOptions: filters,
    });
  }, [filters]);

  const availableOptions = {
    territories: ['Удмуртская Республика', 'Ижевск'],
    nosologicalGroups: ['По всем причинам', 'I00-I99', 'C00-C97'],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 600 }}
      >
        Декомпозиция данных. Структура смертности.*
      </Typography>

      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        availableOptions={availableOptions}
      />

      <Grid container spacing={3}>
        {/* Число умерших по полу и возрасту */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <DeathsByAgeSex data={data.deathsByAgeSex} />
          </Paper>
        </Grid>

        {/* Половозрастная структура по месту смерти */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <PlaceOfDeath men={data.placeOfDeath.men} women={data.placeOfDeath.women} />
          </Paper>
        </Grid>

        {/* Структура обращаемости */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <OutpatientStructure men={data.outpatientStructure.men} women={data.outpatientStructure.women} />
          </Paper>
        </Grid>

        {/* Общебольничная и досуточная летальность */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <MortalityRates men={data.mortalityRates.men} women={data.mortalityRates.women} />
          </Paper>
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        sx={{ mt: 3, display: 'block', fontStyle: 'italic', color: 'text.secondary' }}
      >
        * Интерактивная фильтрация по территории МО, участку, полу, возрасту, нозологической группе в соответствии с уровнем доступа роли
      </Typography>
    </Box>
  );
};

