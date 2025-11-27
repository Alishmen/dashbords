import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MortalityRateData } from '../../types/dashboard.types';

interface MortalityRatesProps {
  men: MortalityRateData[];
  women: MortalityRateData[];
}

export const MortalityRates: React.FC<MortalityRatesProps> = ({ men, women }) => {
  const chartData = men.map((item, index) => ({
    ageGroup: item.ageGroup,
    menOverall: item.overallHospital,
    menDaily: item.daily,
    womenOverall: women[index]?.overallHospital || 0,
    womenDaily: women[index]?.daily || 0,
  }));

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
        Общебольничная и досуточная летальность, %
      </h3>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Мужчины</h4>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 30]} />
              <YAxis dataKey="ageGroup" type="category" width={80} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="menOverall" fill="#9e9e9e" name="Общебольничная летальность" />
              <Bar dataKey="menDaily" fill="#ffc107" name="Досуточная летальность" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Женщины</h4>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={chartData.map(item => ({
                ageGroup: item.ageGroup,
                womenOverall: item.womenOverall,
                womenDaily: item.womenDaily,
              }))}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="ageGroup" type="category" width={80} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="womenOverall" fill="#9e9e9e" name="Общебольничная летальность" />
              <Bar dataKey="womenDaily" fill="#ffc107" name="Досуточная летальность" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

