import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { MOData } from '../../types/dashboard.types';

interface MortalityTableProps {
  overallMortality: {
    republic: number;
    izhevsk: number;
  };
  mortalityByMO: MOData[];
}

export const MortalityTable: React.FC<MortalityTableProps> = ({
  overallMortality,
  mortalityByMO,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return '#ffcdd2';
      case 'medium':
        return '#fff9c4';
      case 'low':
        return '#c8e6c9';
      default:
        return '#ffffff';
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Смертность по медицинским организациям
      </Typography>
      
      <Box sx={{ mb: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body1">
          <strong>Удмуртская Республика:</strong> {overallMortality.republic.toFixed(2)}
        </Typography>
        <Typography variant="body1">
          <strong>Город Ижевск:</strong> {overallMortality.izhevsk.toFixed(2)}
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Медицинская организация</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Показатель смертности</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mortalityByMO.map((mo) => (
              <TableRow
                key={mo.id}
                sx={{
                  backgroundColor: getStatusColor(mo.status),
                  '&:hover': { backgroundColor: getStatusColor(mo.status), opacity: 0.8 },
                }}
              >
                <TableCell>{mo.name}</TableCell>
                <TableCell align="right">{mo.mortalityRate.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

