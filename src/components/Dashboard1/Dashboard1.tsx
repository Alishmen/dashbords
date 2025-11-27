import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { FilterPanel } from '../shared/FilterPanel';
import { MorbidityChart } from './MorbidityChart';
import { DNCoverageChart } from './DNCoverageChart';
import GaugeChart from '../shared/GaugeChart';
import { Dashboard1Data, FilterOptions } from '../../types/dashboard.types';
import dashboard1Data from '../../data/dashboard1.json';

export const Dashboard1: React.FC = () => {
  const [data, setData] = useState<Dashboard1Data>(dashboard1Data as Dashboard1Data);
  const [filters, setFilters] = useState<FilterOptions>(data.filterOptions);

  // Применение фильтров (в реальном приложении здесь был бы запрос к API)
  useEffect(() => {
    // Здесь можно добавить логику фильтрации данных
    // Пока просто обновляем данные при изменении фильтров
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
        Декомпозиция данных. Заболеваемость. ДН.*
      </Typography>

      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        availableOptions={availableOptions}
      />

      <Grid container spacing={3}>
        {/* Заболеваемость */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <MorbidityChart
              men={data.morbidity.men}
              women={data.morbidity.women}
            />
          </Paper>
        </Grid>

        {/* Охват ДН */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <DNCoverageChart
              men={data.dnCoverage.men}
              women={data.dnCoverage.women}
            />
          </Paper>
        </Grid>

        {/* Датчики */}
        <Grid item xs={12}>
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Диспансерное наблюдение
          </Typography>
          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <GaugeChart
                value={data.gauges.coverage}
                label="Охват ДН"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <GaugeChart
                value={data.gauges.completeness}
                label="Полнота охвата ДН"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <GaugeChart
                value={data.gauges.continuity}
                label="Преемственность"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <GaugeChart
                value={data.gauges.timeliness}
                label="Своевременность"
                min={0}
                max={100}
              />
            </Grid>
          </Grid>
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

