import { NextResponse } from 'next/server';
import { readProperties, writeProperties, Property } from '@/lib/sheets';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const updated = await request.json() as Property;
    const properties = await readProperties();
    const idx = properties.findIndex(p => p.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    properties[idx] = { ...updated, id };
    await writeProperties(properties);
    return NextResponse.json(properties[idx]);
  } catch (e) {
    console.error('PUT error:', e);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const properties = await readProperties();
    const filtered = properties.filter(p => p.id !== id);
    if (filtered.length === properties.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await writeProperties(filtered);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE error:', e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
