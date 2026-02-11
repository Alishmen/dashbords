import React from 'react';
import {
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { FilterOptions } from '../../types/dashboard.types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableOptions?: {
    territories?: string[];
    years?: string[];
    mos?: Array<{ code: string; name: string }>;
    sites?: string[];
    ages?: string[];
    nosologicalGroups?: string[];
  };
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  availableOptions,
}) => {
  const handleChange = (field: keyof FilterOptions) => (
    event: SelectChangeEvent<string>
  ) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value === 'all' ? undefined : event.target.value,
    });
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Grid container spacing={2}>
        {availableOptions?.years && (
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Год</InputLabel>
              <Select
                value={filters.year || 'all'}
                label="Год"
                onChange={handleChange('year')}
              >
                <MenuItem value="all">Все</MenuItem>
                {availableOptions.years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {availableOptions?.mos && (
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Медицинская организация</InputLabel>
              <Select
                value={filters.mo || 'all'}
                label="Медицинская организация"
                onChange={handleChange('mo')}
              >
                <MenuItem value="all">Все МО</MenuItem>
                {availableOptions.mos.map((mo) => (
                  <MenuItem key={mo.code} value={mo.code}>
                    {mo.code} - {mo.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {availableOptions?.territories && (
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Территория</InputLabel>
              <Select
                value={filters.territory || 'all'}
                label="Территория"
                onChange={handleChange('territory')}
              >
                <MenuItem value="all">Все</MenuItem>
                {availableOptions.territories.map((territory) => (
                  <MenuItem key={territory} value={territory}>
                    {territory}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {availableOptions?.sites && (
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Участок</InputLabel>
              <Select
                value={filters.site || 'all'}
                label="Участок"
                onChange={handleChange('site')}
              >
                <MenuItem value="all">Все</MenuItem>
                {availableOptions.sites.map((site) => (
                  <MenuItem key={site} value={site}>
                    {site}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth size="small">
            <InputLabel>Пол</InputLabel>
            <Select
              value={filters.gender || 'all'}
              label="Пол"
              onChange={handleChange('gender')}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="male">Мужчины</MenuItem>
              <MenuItem value="female">Женщины</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {availableOptions?.ages && (
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Возраст</InputLabel>
              <Select
                value={filters.age || 'all'}
                label="Возраст"
                onChange={handleChange('age')}
              >
                <MenuItem value="all">Все</MenuItem>
                {availableOptions.ages.map((age) => (
                  <MenuItem key={age} value={age}>
                    {age}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {availableOptions?.nosologicalGroups && (
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Нозологическая группа</InputLabel>
              <Select
                value={filters.nosologicalGroup || 'all'}
                label="Нозологическая группа"
                onChange={handleChange('nosologicalGroup')}
              >
                <MenuItem value="all">Все</MenuItem>
                {availableOptions.nosologicalGroups.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

