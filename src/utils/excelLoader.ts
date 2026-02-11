import { parseExcelFile, parseMOData, ExcelFileData, MOInfo } from './excelParser';

// Загрузка всех Excel файлов из public/excel/
export async function loadExcelFiles(): Promise<Record<string, ExcelFileData>> {
  const files = [
    'Половозрастная структура на 01.01.2026 год ТФОМС.xlsx',
    'Половозрастная_структура_на_01_01_2024_по_МО.xlsx',
    'Половозрастная_структура_на_01_01_2025_по_МО от ТФОМС.xls',
  ];

  const result: Record<string, ExcelFileData> = {};

  for (const fileName of files) {
    try {
      // Используем прямой путь без encodeURIComponent для файлов в public
      // React автоматически обрабатывает файлы из public папки
      const url = `/excel/${fileName}`;
      console.log(`Загрузка файла: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        },
      });
      
      if (!response.ok) {
        console.warn(`Файл ${fileName} не найден (статус: ${response.status}, URL: ${url})`);
        // Пробуем с encodeURIComponent
        const encodedUrl = `/excel/${encodeURIComponent(fileName)}`;
        const retryResponse = await fetch(encodedUrl);
        if (!retryResponse.ok) {
          continue;
        }
        const arrayBuffer = await retryResponse.arrayBuffer();
        if (arrayBuffer.byteLength === 0) {
          continue;
        }
        const fileData = parseExcelFile(arrayBuffer, fileName);
        result[fileData.year] = fileData;
        continue;
      }
      
      // Проверяем, что это действительно бинарные данные, а не HTML
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        // Если это HTML, читаем текст для диагностики
        const text = await response.text();
        console.warn(`Файл ${fileName} вернул HTML вместо Excel файла. Первые 200 символов:`, text.substring(0, 200));
        continue;
      }
      
      // Читаем бинарные данные
      const arrayBuffer = await response.arrayBuffer();
      
      // Проверяем, что это не пустой ответ
      if (arrayBuffer.byteLength === 0) {
        console.warn(`Файл ${fileName} пустой`);
        continue;
      }
      
      // Проверяем сигнатуру Excel файла (первые байты)
      const view = new Uint8Array(arrayBuffer);
      const isExcel = view[0] === 0x50 && view[1] === 0x4B; // PK (ZIP signature для .xlsx)
      const isOldExcel = view[0] === 0xD0 && view[1] === 0xCF; // OLE2 для .xls
      
      if (!isExcel && !isOldExcel) {
        console.warn(`Файл ${fileName} не является валидным Excel файлом (сигнатура: ${view[0].toString(16)} ${view[1].toString(16)})`);
        continue;
      }
      
      const fileData = parseExcelFile(arrayBuffer, fileName);
      result[fileData.year] = fileData;
      console.log(`Файл ${fileName} успешно загружен`);
    } catch (error: any) {
      console.error(`Ошибка при загрузке файла ${fileName}:`, error.message || error);
    }
  }

  return result;
}

// Получение списка всех МО из всех файлов
export function getAllMOs(excelData: Record<string, ExcelFileData>): MOInfo[] {
  const moMap = new Map<string, MOInfo>();
  
  Object.values(excelData).forEach(fileData => {
    fileData.mos.forEach(mo => {
      // Используем код МО как ключ, чтобы избежать дубликатов
      if (!moMap.has(mo.code)) {
        moMap.set(mo.code, mo);
      }
    });
  });
  
  return Array.from(moMap.values()).sort((a, b) => a.code.localeCompare(b.code));
}

// Получение данных заболеваемости для выбранного года и МО
export async function getMorbidityData(
  year: string,
  moCode: string | null
): Promise<{ men: any[]; women: any[] } | null> {
  const files: Record<string, string> = {
    '2024': 'Половозрастная_структура_на_01_01_2024_по_МО.xlsx',
    '2025': 'Половозрастная_структура_на_01_01_2025_по_МО от ТФОМС.xls',
    '2026': 'Половозрастная структура на 01.01.2026 год ТФОМС.xlsx',
  };

  const fileName = files[year];
  if (!fileName) {
    return null;
  }

  try {
    // Используем прямой путь для файлов в public
    let url = `/excel/${fileName}`;
    let response = await fetch(url);
    
    // Если не получилось, пробуем с encodeURIComponent
    if (!response.ok) {
      url = `/excel/${encodeURIComponent(fileName)}`;
      response = await fetch(url);
    }
    
    if (!response.ok) {
      console.warn(`Файл ${fileName} не найден (статус: ${response.status})`);
      return null;
    }

    // Проверяем, что это действительно бинарные данные
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      console.warn(`Файл ${fileName} вернул HTML вместо Excel файла`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    
    if (arrayBuffer.byteLength === 0) {
      console.warn(`Файл ${fileName} пустой`);
      return null;
    }
    
    // Проверяем сигнатуру Excel файла
    const view = new Uint8Array(arrayBuffer);
    const isExcel = view[0] === 0x50 && view[1] === 0x4B; // PK (ZIP)
    const isOldExcel = view[0] === 0xD0 && view[1] === 0xCF; // OLE2
    
    if (!isExcel && !isOldExcel) {
      console.warn(`Файл ${fileName} не является валидным Excel файлом`);
      return null;
    }

    if (moCode) {
      // Данные для конкретной МО
      const moData = parseMOData(arrayBuffer, fileName, moCode);
      return moData;
    } else {
      // Данные для всех МО (Итого)
      const fileData = parseExcelFile(arrayBuffer, fileName);
      return fileData.morbidity;
    }
  } catch (error: any) {
    console.error(`Ошибка при загрузке данных для года ${year}:`, error.message || error);
    return null;
  }
}
