import { google } from 'googleapis';

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
  visitado: string;
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = 'Propiedades';

const HEADERS = [
  'Zona', 'Descripción', 'Dirección', 'Link', 'Ambientes', 'Precio',
  'Expensas', 'Cochera', 'Antigüedad', 'Metros Totales', 'Metros Cubiertos',
  'Tiempo al trabajo', 'Descartado', 'MOTIVO', 'Visitado'
];

// Derive the last column letter from HEADERS length — no more hardcoded "N"
const LAST_COL = String.fromCharCode(64 + HEADERS.length); // 15 cols = "O"

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function getSheets() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

function rowToProperty(row: string[], id: number): Property {
  const [zona, descripcion, direccion, link, ambientes, precio, expensas,
    cochera, antiguedad, metrosTotales, metrosCubiertos, tiempoAlTrabajo,
    descartado, motivo, visitado] = row;
  return {
    id,
    zona: zona ?? '',
    descripcion: descripcion ?? '',
    direccion: direccion ?? '',
    link: link ?? '',
    ambientes: Number(ambientes ?? 0),
    precio: Number(precio ?? 0),
    expensas: Number(expensas ?? 0),
    cochera: cochera ?? 'NO',
    antiguedad: Number(antiguedad ?? 0),
    metrosTotales: Number(metrosTotales ?? 0),
    metrosCubiertos: Number(metrosCubiertos ?? 0),
    tiempoAlTrabajo: Number(tiempoAlTrabajo ?? 0),
    descartado: descartado ?? 'NO',
    motivo: motivo ?? '',
    visitado: visitado ?? 'NO',
  };
}

function propertyToRow(p: Omit<Property, 'id'>): string[] {
  return [
    p.zona, p.descripcion, p.direccion, p.link,
    String(p.ambientes), String(p.precio), String(p.expensas),
    p.cochera, String(p.antiguedad), String(p.metrosTotales),
    String(p.metrosCubiertos), String(p.tiempoAlTrabajo),
    p.descartado, p.motivo, p.visitado,
  ];
}

export async function ensureHeaders() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:${LAST_COL}1`,
  });
  const firstRow = res.data.values?.[0];
  if (!firstRow || firstRow[0] !== 'Zona') {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADERS] },
    });
  }
}

export async function readProperties(): Promise<Property[]> {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:${LAST_COL}`,  // was hardcoded to N
  });
  const rows = res.data.values ?? [];
  return rows
    .filter(r => r.some(cell => cell !== ''))
    .map((r, i) => rowToProperty(r as string[], i));
}

export async function writeProperties(properties: Property[]): Promise<void> {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:${LAST_COL}`,  // was hardcoded to N
  });
  if (properties.length === 0) return;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2`,
    valueInputOption: 'RAW',
    requestBody: { values: properties.map(p => propertyToRow(p)) },
  });
}