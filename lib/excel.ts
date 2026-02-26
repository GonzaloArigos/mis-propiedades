import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export interface Property {
  id: number;
  zona: string;
  descripcion: string;
  direccion: string;
  link: string;
  ambientes: number;
  precio: number;
  expensas: number;
  cochera: string;
  antiguedad: number;
  metrosTotales: number;
  metrosCubiertos: number;
  tiempoAlTrabajo: number;
  descartado: string;
  motivo: string;
}

const EXCEL_PATH = path.resolve(process.cwd(), 'public', 'Deptos.xlsx');

const COL_MAP = [
  'Zona', 'Descripción', 'Dirección', 'Link', 'Ambientes', 'Precio',
  'Expensas', 'Cochera', 'Antigüedad', 'Metros Totales', 'Metros Cubiertos',
  'Tiempo al trabajo', 'Descartado', 'MOTIVO'
];

function openWorkbook(): XLSX.WorkBook {
  // Use fs.readFileSync + XLSX.read(buffer) instead of XLSX.readFile
  // because Next.js webpack blocks xlsx's own file access
  const buffer = fs.readFileSync(EXCEL_PATH);
  return XLSX.read(buffer, { type: 'buffer' });
}

function rowToProperty(row: Record<string, unknown>, id: number): Property {
  return {
    id,
    zona: String(row['Zona'] ?? ''),
    descripcion: String(row['Descripción'] ?? ''),
    direccion: String(row['Dirección'] ?? ''),
    link: String(row['Link'] ?? ''),
    ambientes: Number(row['Ambientes'] ?? 0),
    precio: Number(row['Precio'] ?? 0),
    expensas: Number(row['Expensas'] ?? 0),
    cochera: String(row['Cochera'] ?? 'NO'),
    antiguedad: Number(row['Antigüedad'] ?? 0),
    metrosTotales: Number(row['Metros Totales'] ?? 0),
    metrosCubiertos: Number(row['Metros Cubiertos'] ?? 0),
    tiempoAlTrabajo: Number(row['Tiempo al trabajo'] ?? 0),
    descartado: String(row['Descartado'] ?? 'NO'),
    motivo: row['MOTIVO'] != null ? String(row['MOTIVO']) : '',
  };
}

export function readProperties(): Property[] {
  if (!fs.existsSync(EXCEL_PATH)) {
    console.error('Excel file not found at:', EXCEL_PATH);
    return [];
  }
  const wb = openWorkbook();
  const ws = wb.Sheets['Sheet1'];
  if (!ws) return [];
  const rows = XLSX.utils.sheet_to_json(ws) as Record<string, unknown>[];
  return rows.map((r, i) => rowToProperty(r, i));
}

export function writeProperties(properties: Property[]): void {
  const wb = openWorkbook();

  const rows = properties.map(p => ({
    'Zona': p.zona,
    'Descripción': p.descripcion,
    'Dirección': p.direccion,
    'Link': p.link,
    'Ambientes': p.ambientes,
    'Precio': p.precio,
    'Expensas': p.expensas,
    'Cochera': p.cochera,
    'Antigüedad': p.antiguedad,
    'Metros Totales': p.metrosTotales,
    'Metros Cubiertos': p.metrosCubiertos,
    'Tiempo al trabajo': p.tiempoAlTrabajo,
    'Descartado': p.descartado,
    'MOTIVO': p.motivo,
  }));

  const ws = XLSX.utils.json_to_sheet(rows, { header: COL_MAP });
  wb.Sheets['Sheet1'] = ws;

  // Write back with fs.writeFileSync to avoid same bundling issue
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  fs.writeFileSync(EXCEL_PATH, buffer);
}
