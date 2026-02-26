import { NextResponse } from 'next/server';
import { readProperties, writeProperties, Property } from '@/lib/excel';

export async function GET() {
  try {
    const properties = readProperties();
    return NextResponse.json(properties);
  } catch (e) {
    console.error('GET /api/properties error:', e);
    return NextResponse.json([], { status: 200 }); // return empty array, not error object
  }
}

export async function POST(request: Request) {
  try {
    const newProp = await request.json() as Omit<Property, 'id'>;
    const properties = readProperties();
    const maxId = properties.reduce((m, p) => Math.max(m, p.id), -1);
    const created = { ...newProp, id: maxId + 1 };
    properties.push(created);
    writeProperties(properties);
    return NextResponse.json(created);
  } catch (e) {
    console.error('POST /api/properties error:', e);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
