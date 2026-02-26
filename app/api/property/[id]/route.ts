import { NextResponse } from 'next/server';
import { readProperties, writeProperties, Property } from '@/lib/excel';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const updated = await request.json() as Property;
    const properties = readProperties();
    const idx = properties.findIndex(p => p.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    properties[idx] = { ...updated, id };
    writeProperties(properties);
    return NextResponse.json(properties[idx]);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const properties = readProperties();
    const filtered = properties.filter(p => p.id !== id);
    if (filtered.length === properties.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    writeProperties(filtered);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
