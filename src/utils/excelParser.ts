// @ts-ignore
import * as XLSX from 'xlsx';
import { AgeGroupData, MorbidityData } from '../types/dashboard.types';

// Возрастные группы для группировки
const AGE_GROUPS = [
  { name: '0-1', min: 0, max: 1 },
  { name: '2-4', min: 2, max: 4 },
  { name: '5-9', min: 5, max: 9 },
  { name: '10-14', min: 10, max: 14 },
  { name: '15-19', min: 15, max: 19 },
  { name: '20-24', min: 20, max: 24 },
  { name: '25-29', min: 25, max: 29 },
  { name: '30-34', min: 30, max: 34 },
  { name: '35-39', min: 35, max: 39 },
  { name: '40-44', min: 40, max: 44 },
  { name: '45-49', min: 45, max: 49 },
  { name: '50-54', min: 50, max: 54 },
  { name: '55-59', min: 55, max: 59 },
  { name: '60-64', min: 60, max: 64 },
  { name: '65-69', min: 65, max: 69 },
  { name: '70-74', min: 70, max: 74 },
  { name: '75-79', min: 75, max: 79 },
  { name: '80-84', min: 80, max: 84 },
  { name: '85-89', min: 85, max: 89 },
  { name: '90-94', min: 90, max: 94 },
  { name: '95-99+', min: 95, max: 999 },
];

export interface MOInfo {
  code: string;
  name: string;
}

export interface ExcelFileData {
  year: string;
  mos: MOInfo[];
  morbidity: MorbidityData;
}

// Парсинг возраста из строки
function parseAgeFromString(ageStr: string): number | null {
  if (!ageStr) return null;
  const str = String(ageStr).trim().toLowerCase();
  
  // "0 мес", "1 мес" и т.д.
  const monthMatch = str.match(/(\d+)\s*мес/);
  if (monthMatch) {
    return parseInt(monthMatch[1]) / 12; // Преобразуем месяцы в годы
  }
  
  // "0", "1", "2" и т.д.
  const numMatch = str.match(/^(\d+)$/);
  if (numMatch) {
    return parseInt(numMatch[1]);
  }
  
  return null;
}

// Определение возрастной группы
function getAgeGroup(age: number): string | null {
  for (const group of AGE_GROUPS) {
    if (age >= group.min && age <= group.max) {
      return group.name;
    }
  }
  return null;
}

// Парсинг файла формата 2026
function parse2026Format(data: any[][]): ExcelFileData {
  // Строка 0: заголовки
  // Строка 1: возрасты (0, 1, 2, 3...)
  // Строка 2: пол (м, ж, м, ж...)
  // Строка 3: Итого
  // Строка 4+: данные по МО
  
  const agesRow = data[1] || [];
  const genderRow = data[2] || [];
  const totalRow = data[3] || [];
  
  // Создаем маппинг колонок: индекс -> возраст, пол
  const columnMapping: Array<{ colIndex: number; age: number; gender: 'men' | 'women'; ageGroup: string }> = [];
  
  let currentAge: number | null = null;
  for (let i = 2; i < agesRow.length; i++) {
    const ageStr = String(agesRow[i] || '').trim();
    const genderStr = String(genderRow[i] || '').trim().toLowerCase();
    
    // Если есть возраст в этой колонке, обновляем currentAge
    // Возраст указан только для мужчин (в четных колонках: 2, 4, 6...)
    if (ageStr && !isNaN(parseInt(ageStr))) {
      currentAge = parseInt(ageStr);
    }
    
    // Определяем пол
    if (genderStr === 'м' || genderStr === 'м') {
      if (currentAge !== null) {
        const ageGroup = getAgeGroup(currentAge);
        if (ageGroup) {
          columnMapping.push({
            colIndex: i,
            age: currentAge,
            gender: 'men',
            ageGroup: ageGroup
          });
        }
      }
    } else if (genderStr === 'ж' || genderStr === 'жен' || genderStr === 'ж') {
      // Для женщин используем тот же возраст, что был установлен для предыдущей колонки (мужчин)
      // В структуре файла: колонка с возрастом (м), следующая колонка без возраста (ж) - та же возрастная группа
      if (currentAge !== null) {
        const ageGroup = getAgeGroup(currentAge);
        if (ageGroup) {
          columnMapping.push({
            colIndex: i,
            age: currentAge,
            gender: 'women',
            ageGroup: ageGroup
          });
        }
      }
    }
  }
  
  // Извлекаем МО
  const mos: MOInfo[] = [];
  for (let i = 4; i < data.length; i++) {
    const row = data[i];
    if (row && row[0] && row[1]) {
      const moCode = String(row[0]).trim();
      const moName = String(row[1]).trim();
      if (moCode && moName && moCode !== 'Итого' && moCode !== 'Итог') {
        mos.push({ code: moCode, name: moName });
      }
    }
  }
  
  // Группируем данные по возрастным группам для "Итого"
  const totalByAgeGroup: Record<string, { men: number; women: number }> = {};
  AGE_GROUPS.forEach(ag => {
    totalByAgeGroup[ag.name] = { men: 0, women: 0 };
  });
  
  columnMapping.forEach(m => {
    const value = Number(totalRow[m.colIndex]) || 0;
    if (value > 0) {
      totalByAgeGroup[m.ageGroup][m.gender] += value;
    }
  });
  
  // Преобразуем в формат AgeGroupData
  const men: AgeGroupData[] = AGE_GROUPS.map(ag => ({
    ageGroup: ag.name,
    primary: totalByAgeGroup[ag.name].men,
    total: totalByAgeGroup[ag.name].men, // Одинаковое значение
  }));
  
  const women: AgeGroupData[] = AGE_GROUPS.map(ag => ({
    ageGroup: ag.name,
    primary: totalByAgeGroup[ag.name].women,
    total: totalByAgeGroup[ag.name].women, // Одинаковое значение
  }));
  
  return {
    year: '2026',
    mos,
    morbidity: { men, women }
  };
}

// Парсинг файла формата 2024/2025
function parse2024_2025Format(data: any[][], year: string): ExcelFileData {
  // Ищем строку с заголовками возраста
  let ageHeaderRowIndex = -1;
  let moRowIndex = -1;
  
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = data[i];
    if (row && row.length > 0) {
      const firstCell = String(row[0] || '').toLowerCase();
      if (firstCell.includes('возраст') || firstCell === 'возраст') {
        ageHeaderRowIndex = i;
        moRowIndex = i - 1;
        break;
      }
    }
  }
  
  if (ageHeaderRowIndex < 0) {
    throw new Error('Не найдена строка с заголовками возраста');
  }
  
  const moRow = data[moRowIndex] || [];
  const ageHeaderRow = data[ageHeaderRowIndex] || [];
  
  // Извлекаем МО
  const mos: MOInfo[] = [];
  for (let i = 1; i < moRow.length; i += 2) {
    const moCell = String(moRow[i] || '').trim();
    if (moCell && moCell.length > 0 && !moCell.toLowerCase().includes('половозрастная')) {
      const parts = moCell.split(/\s+/);
      const code = parts[0];
      const name = parts.slice(1).join(' ');
      if (code && name && code !== 'Итог' && code !== 'Итого') {
        mos.push({ code: code, name: name });
      }
    }
  }
  
  // Группируем данные по возрастным группам
  const totalByAgeGroup: Record<string, { men: number; women: number }> = {};
  AGE_GROUPS.forEach(ag => {
    totalByAgeGroup[ag.name] = { men: 0, women: 0 };
  });
  
  // Обрабатываем данные по строкам (месяцам/годам)
  for (let i = ageHeaderRowIndex + 1; i < data.length; i++) {
    const row = data[i];
    if (row && row[0]) {
      const ageStr = String(row[0]).trim();
      const age = parseAgeFromString(ageStr);
      
      if (age !== null) {
        const ageGroup = getAgeGroup(age);
        if (ageGroup) {
          // Данные идут парами: муж, жен для каждой МО
          for (let moIndex = 0; moIndex < mos.length; moIndex++) {
            const menCol = 1 + moIndex * 2;
            const womenCol = 2 + moIndex * 2;
            const menValue = Number(row[menCol]) || 0;
            const womenValue = Number(row[womenCol]) || 0;
            
            if (menValue > 0) {
              totalByAgeGroup[ageGroup].men += menValue;
            }
            if (womenValue > 0) {
              totalByAgeGroup[ageGroup].women += womenValue;
            }
          }
        }
      }
    }
  }
  
  // Преобразуем в формат AgeGroupData
  const men: AgeGroupData[] = AGE_GROUPS.map(ag => ({
    ageGroup: ag.name,
    primary: totalByAgeGroup[ag.name].men,
    total: totalByAgeGroup[ag.name].men,
  }));
  
  const women: AgeGroupData[] = AGE_GROUPS.map(ag => ({
    ageGroup: ag.name,
    primary: totalByAgeGroup[ag.name].women,
    total: totalByAgeGroup[ag.name].women,
  }));
  
  return {
    year,
    mos,
    morbidity: { men, women }
  };
}

// Парсинг данных для конкретной МО (формат 2026)
export function parseMOData2026(
  data: any[][],
  moCode: string
): MorbidityData | null {
  const agesRow = data[1] || [];
  const genderRow = data[2] || [];
  
  // Создаем маппинг колонок
  const columnMapping: Array<{ colIndex: number; age: number; gender: 'men' | 'women'; ageGroup: string }> = [];
  
  let currentAge: number | null = null;
  for (let i = 2; i < agesRow.length; i++) {
    const ageStr = String(agesRow[i] || '').trim();
    const genderStr = String(genderRow[i] || '').trim().toLowerCase();
    
    // Если есть возраст в этой колонке, обновляем currentAge
    if (ageStr && !isNaN(parseInt(ageStr))) {
      currentAge = parseInt(ageStr);
    }
    
    if (genderStr === 'м' || genderStr === 'м') {
      if (currentAge !== null) {
        const ageGroup = getAgeGroup(currentAge);
        if (ageGroup) {
          columnMapping.push({
            colIndex: i,
            age: currentAge,
            gender: 'men',
            ageGroup: ageGroup
          });
        }
      }
    } else if (genderStr === 'ж' || genderStr === 'жен' || genderStr === 'ж') {
      // Для женщин используем тот же возраст из предыдущей колонки
      if (currentAge !== null) {
        const ageGroup = getAgeGroup(currentAge);
        if (ageGroup) {
          columnMapping.push({
            colIndex: i,
            age: currentAge,
            gender: 'women',
            ageGroup: ageGroup
          });
        }
      }
    }
  }
  
  // Находим строку с данными МО
  let moRow: any[] | null = null;
  for (let i = 4; i < data.length; i++) {
    const row = data[i];
    if (row && String(row[0]).trim() === moCode) {
      moRow = row;
      break;
    }
  }
  
  if (!moRow) return null;
  
  // Группируем данные
  const moDataByAgeGroup: Record<string, { men: number; women: number }> = {};
  AGE_GROUPS.forEach(ag => {
    moDataByAgeGroup[ag.name] = { men: 0, women: 0 };
  });
  
  columnMapping.forEach(m => {
    const value = Number(moRow![m.colIndex]) || 0;
    if (value > 0) {
      moDataByAgeGroup[m.ageGroup][m.gender] += value;
    }
  });
  
  const men: AgeGroupData[] = AGE_GROUPS.map(ag => ({
    ageGroup: ag.name,
    primary: moDataByAgeGroup[ag.name].men,
    total: moDataByAgeGroup[ag.name].men,
  }));
  
  const women: AgeGroupData[] = AGE_GROUPS.map(ag => ({
    ageGroup: ag.name,
    primary: moDataByAgeGroup[ag.name].women,
    total: moDataByAgeGroup[ag.name].women,
  }));
  
  return { men, women };
}

// Парсинг данных для конкретной МО (формат 2024/2025)
export function parseMOData2024_2025(
  data: any[][],
  moCode: string,
  year: string
): MorbidityData | null {
  // Ищем строку с заголовками возраста
  let ageHeaderRowIndex = -1;
  let moRowIndex = -1;
  
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = data[i];
    if (row && row.length > 0) {
      const firstCell = String(row[0] || '').toLowerCase();
      if (firstCell.includes('возраст') || firstCell === 'возраст') {
        ageHeaderRowIndex = i;
        moRowIndex = i - 1;
        break;
      }
    }
  }
  
  if (ageHeaderRowIndex < 0) return null;
  
  const moRow = data[moRowIndex] || [];
  
  // Находим индекс колонки для данной МО
  let moColIndex = -1;
  for (let i = 1; i < moRow.length; i += 2) {
    const moCell = String(moRow[i] || '').trim();
    if (moCell.startsWith(moCode)) {
      moColIndex = i;
      break;
    }
  }
  
  if (moColIndex < 0) return null;
  
  const menCol = moColIndex;
  const womenCol = moColIndex + 1;
  
  // Группируем данные
  const moDataByAgeGroup: Record<string, { men: number; women: number }> = {};
  AGE_GROUPS.forEach(ag => {
    moDataByAgeGroup[ag.name] = { men: 0, women: 0 };
  });
  
  for (let i = ageHeaderRowIndex + 1; i < data.length; i++) {
    const row = data[i];
    if (row && row[0]) {
      const ageStr = String(row[0]).trim();
      const age = parseAgeFromString(ageStr);
      
      if (age !== null) {
        const ageGroup = getAgeGroup(age);
        if (ageGroup) {
          const menValue = Number(row[menCol]) || 0;
          const womenValue = Number(row[womenCol]) || 0;
          
          if (menValue > 0) {
            moDataByAgeGroup[ageGroup].men += menValue;
          }
          if (womenValue > 0) {
            moDataByAgeGroup[ageGroup].women += womenValue;
          }
        }
      }
    }
  }
  
  const men: AgeGroupData[] = AGE_GROUPS.map(ag => ({
    ageGroup: ag.name,
    primary: moDataByAgeGroup[ag.name].men,
    total: moDataByAgeGroup[ag.name].men,
  }));
  
  const women: AgeGroupData[] = AGE_GROUPS.map(ag => ({
    ageGroup: ag.name,
    primary: moDataByAgeGroup[ag.name].women,
    total: moDataByAgeGroup[ag.name].women,
  }));
  
  return { men, women };
}

// Основная функция парсинга Excel файла
export function parseExcelFile(fileContent: ArrayBuffer, fileName: string): ExcelFileData {
  try {
    const workbook = XLSX.read(fileContent, { type: 'array' });
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Excel файл не содержит листов');
    }
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!worksheet) {
      throw new Error('Не удалось прочитать первый лист Excel файла');
    }
    
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];
  
    // Определяем формат файла по имени
    if (fileName.includes('2026')) {
      return parse2026Format(data);
    } else if (fileName.includes('2024')) {
      return parse2024_2025Format(data, '2024');
    } else if (fileName.includes('2025')) {
      return parse2024_2025Format(data, '2025');
    } else {
      throw new Error('Неизвестный формат файла');
    }
  } catch (error: any) {
    // Если ошибка парсинга, проверяем, не HTML ли это
    if (error.message && error.message.includes('Invalid HTML')) {
      throw new Error(`Файл ${fileName} не является валидным Excel файлом. Возможно, файл не найден или путь указан неверно.`);
    }
    throw error;
  }
}

// Парсинг данных для конкретной МО
export function parseMOData(
  fileContent: ArrayBuffer,
  fileName: string,
  moCode: string
): MorbidityData | null {
  const workbook = XLSX.read(fileContent, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];
  
  if (fileName.includes('2026')) {
    return parseMOData2026(data, moCode);
  } else if (fileName.includes('2024') || fileName.includes('2025')) {
    const year = fileName.includes('2024') ? '2024' : '2025';
    return parseMOData2024_2025(data, moCode, year);
  }
  
  return null;
}
