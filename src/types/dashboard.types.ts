// Общие типы для фильтрации
export interface FilterOptions {
  territory?: string;
  mo?: string; // Медицинская организация
  site?: string; // Участок
  gender?: 'all' | 'male' | 'female';
  age?: string;
  nosologicalGroup?: string; // Нозологическая группа
}

// Типы для Dashboard 1: Заболеваемость и ДН
export interface AgeGroupData {
  ageGroup: string;
  primary: number;
  total: number;
}

export interface MorbidityData {
  men: AgeGroupData[];
  women: AgeGroupData[];
}

export interface DNCoverageData {
  men: AgeGroupData[];
  women: AgeGroupData[];
}

export interface GaugeData {
  coverage: number; // Охват ДН
  completeness: number; // Полнота охвата ДН
  continuity: number; // Преемственность
  timeliness: number; // Своевременность
}

export interface Dashboard1Data {
  morbidity: MorbidityData;
  dnCoverage: DNCoverageData;
  gauges: GaugeData;
  filterOptions: FilterOptions;
}

// Типы для Dashboard 2: Структура смертности
export interface DeathsByAgeSex {
  ageGroup: string;
  men: number;
  women: number;
}

export interface PlaceOfDeathData {
  ageGroup: string;
  home: number; // На дому
  hospital: number; // В стационаре
}

export interface OutpatientStructureData {
  ageGroup: string;
  visitedMOPerCause: number; // Посещали МО по причине 100-99
  didNotVisitMO: number; // Не посещали МО
  visitedMOOtherReason: number; // Посещали МО по другой причине
}

export interface MortalityRateData {
  ageGroup: string;
  overallHospital: number; // Общебольничная летальность
  daily: number; // Досуточная летальность
}

export interface Dashboard2Data {
  deathsByAgeSex: DeathsByAgeSex[];
  placeOfDeath: {
    men: PlaceOfDeathData[];
    women: PlaceOfDeathData[];
  };
  outpatientStructure: {
    men: OutpatientStructureData[];
    women: OutpatientStructureData[];
  };
  mortalityRates: {
    men: MortalityRateData[];
    women: MortalityRateData[];
  };
  filterOptions: FilterOptions;
}

// Типы для Dashboard 3: Общий показатель смертности
export interface MOData {
  id: string;
  name: string;
  mortalityRate: number;
  status: 'high' | 'medium' | 'low' | 'normal';
}

export interface PopulationPyramidData {
  ageGroup: string;
  men: number;
  women: number;
}

export interface DiseaseRankingData {
  code: string;
  name: string;
  deaths: number;
  isSignificant: boolean;
  cumulativePercent: number;
}

export interface MORankingData {
  name: string;
  mortalityRate: number;
  isSignificant: boolean;
  cumulativePercent: number;
}

export interface Dashboard3Data {
  overallMortality: {
    republic: number;
    izhevsk: number;
  };
  mortalityByMO: MOData[];
  populationPyramid: PopulationPyramidData[];
  diseaseRanking: DiseaseRankingData[];
  moRanking: MORankingData[];
  filterOptions: FilterOptions;
}

