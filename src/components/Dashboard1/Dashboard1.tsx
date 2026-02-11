import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { FilterPanel } from '../shared/FilterPanel';
import { MorbidityChart } from './MorbidityChart';
import { DNCoverageChart } from './DNCoverageChart';
import GaugeChart from '../shared/GaugeChart';
import { Dashboard1Data, FilterOptions, MorbidityData, AgeGroupData } from '../../types/dashboard.types';
import dashboard1Data from '../../data/dashboard1.json';
import { loadExcelFiles, getAllMOs, getMorbidityData } from '../../utils/excelLoader';

export const Dashboard1: React.FC = () => {
  const [data, setData] = useState<Dashboard1Data>(dashboard1Data as Dashboard1Data);
  const [filters, setFilters] = useState<FilterOptions>({
    ...data.filterOptions,
    year: '2026', // По умолчанию 2026
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<Record<string, any>>({});
  const [availableMOs, setAvailableMOs] = useState<Array<{ code: string; name: string }>>([]);

  // Загрузка Excel файлов при монтировании
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const filesData = await loadExcelFiles();
        
        // Проверяем, загрузились ли файлы
        const loadedYears = Object.keys(filesData);
        if (loadedYears.length === 0) {
          setError('Не удалось загрузить Excel файлы. Убедитесь, что файлы находятся в папке public/excel/');
          setLoading(false);
          return;
        }
        
        setExcelData(filesData);
        
        // Получаем список всех МО
        const allMOs = getAllMOs(filesData);
        setAvailableMOs(allMOs);
        
        console.log(`Загружено файлов: ${loadedYears.length}, МО: ${allMOs.length}`);
      } catch (err: any) {
        setError(`Ошибка при загрузке Excel файлов: ${err.message || 'Неизвестная ошибка'}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Загрузка данных при изменении фильтров
  useEffect(() => {
    const loadMorbidityData = async () => {
      if (!filters.year) {
        // Если год не выбран, используем данные по умолчанию
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const morbidityData = await getMorbidityData(
          filters.year,
          filters.mo || null
        );

        if (morbidityData) {
          setData(prevData => ({
            ...prevData,
            morbidity: morbidityData,
            filterOptions: filters,
          }));
        }
      } catch (err) {
        setError('Ошибка при загрузке данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMorbidityData();
  }, [filters.year, filters.mo]);

  const availableOptions = {
    years: ['2024', '2025', '2026'],
    mos: availableMOs,
    territories: ['Удмуртская Республика', 'Ижевск'],
    nosologicalGroups: ['По всем причинам', 'I00-I99', 'C00-C97'],
  };

  // Формируем название графика с годом и МО
  const getChartTitle = (): string => {
    if (!filters.year) {
      return 'Половозрастная структура населения';
    }
    
    let title = `Половозрастная структура населения, ${filters.year}`;
    
    if (filters.mo) {
      const selectedMO = availableMOs.find(mo => mo.code === filters.mo);
      if (selectedMO) {
        title += `, ${selectedMO.name}`;
      } else {
        title += `, МО ${filters.mo}`;
      }
    } else {
      title += ', Все МО';
    }
    
    return title;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 600 }}
      >
        Декомпозиция данных. Заболеваемость. ДН.*
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        availableOptions={availableOptions}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Половозрастная структура населения */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <MorbidityChart
              men={data.morbidity.men}
              women={data.morbidity.women}
              title={getChartTitle()}
            />
          </Paper>
        </Grid>

        {/* Половозрастная структура населения - второй график */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <MorbidityChart
              men={data.morbidity.men}
              women={data.morbidity.women}
              title={getChartTitle()}
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

