import { NextResponse } from 'next/server';
import { readProperties, writeProperties, ensureHeaders, Property } from '@/lib/sheets';

export async function GET() {
  try {
    await ensureHeaders();
    const properties = await readProperties();
    return NextResponse.json(properties);
  } catch (e) {
    console.error('GET /api/properties error:', e);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const newProp = await request.json() as Omit<Property, 'id'>;
    const properties = await readProperties();
    const maxId = properties.reduce((m, p) => Math.max(m, p.id), -1);
    const created = { ...newProp, id: maxId + 1 };
    properties.push(created);
    await writeProperties(properties);
    return NextResponse.json(created);
  } catch (e) {
    console.error('POST /api/properties error:', e);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
