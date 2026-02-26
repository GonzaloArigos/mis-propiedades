'use client';
import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, Download, Home, RefreshCw } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import PropertyForm from '@/components/PropertyForm';

interface Property {
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

type SortKey = 'precio' | 'metrosCubiertos' | 'tiempoAlTrabajo' | 'zona';

export default function Page() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterZona, setFilterZona] = useState('');
  const [filterAmbientes, setFilterAmbientes] = useState('');
  const [filterCochera, setFilterCochera] = useState('');
  const [showDescartados, setShowDescartados] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('precio');
  const [sortAsc, setSortAsc] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      console.log('Loaded properties:', data);
      setProperties(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load properties:', e);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const zonas = useMemo(() => [...new Set(properties.map(p => p.zona))].sort(), [properties]);

  const filtered = useMemo(() => {
    let list = [...properties];

    if (!showDescartados) list = list.filter(p => p.descartado !== 'SI');
    if (filterZona) list = list.filter(p => p.zona === filterZona);
    if (filterAmbientes) list = list.filter(p => p.ambientes === Number(filterAmbientes));
    if (filterCochera) list = list.filter(p => p.cochera === filterCochera);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.zona.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

    return list;
  }, [properties, search, filterZona, filterAmbientes, filterCochera, showDescartados, sortKey, sortAsc]);

  const handleSave = async (data: Omit<Property, 'id'>) => {
    if (editTarget) {
      await fetch(`/api/property/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    setShowForm(false);
    setEditTarget(null);
    load();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/property/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    load();
  };

  const avgPrice = filtered.length > 0
    ? Math.round(filtered.reduce((s, p) => s + p.precio, 0) / filtered.length)
    : 0;

  const selectClass = "px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-300 transition-all";
  const selectStyle = { borderColor: 'var(--border)', background: 'white' };

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ background: 'rgba(247,243,238,0.95)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                <Home size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold leading-none" style={{ color: 'var(--dark)' }}>
                  Mis Propiedades - Gonzalo Arigos
                </h1>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {filtered.length} propiedades{avgPrice > 0 ? ` · Promedio USD ${avgPrice.toLocaleString()}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={load}
                className="p-2 rounded-xl border transition-colors hover:bg-white"
                style={{ borderColor: 'var(--border)' }}
                title="Recargar"
              >
                <RefreshCw size={16} style={{ color: 'var(--muted)' }} />
              </button>
              <button
                onClick={() => { setEditTarget(null); setShowForm(true); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'var(--accent)' }}
              >
                <Plus size={15} /> Nueva
              </button>
            </div>
          </div>

          {/* Search + Filter row */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
              <input
                type="text"
                placeholder="Buscar por zona o descripción..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                style={{ borderColor: 'var(--border)', background: 'white' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:bg-white"
              style={{
                borderColor: showFilters ? 'var(--accent)' : 'var(--border)',
                color: showFilters ? 'var(--accent)' : 'var(--dark)',
                background: showFilters ? '#FEF0E8' : 'white'
              }}
            >
              <SlidersHorizontal size={14} /> Filtros
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <select className={selectClass} style={selectStyle} value={filterZona} onChange={e => setFilterZona(e.target.value)}>
                <option value="">Todas las zonas</option>
                {zonas.map(z => <option key={z}>{z}</option>)}
              </select>
              <select className={selectClass} style={selectStyle} value={filterAmbientes} onChange={e => setFilterAmbientes(e.target.value)}>
                <option value="">Ambientes</option>
                {[1,2,3,4].map(n => <option key={n} value={n}>{n} amb.</option>)}
              </select>
              <select className={selectClass} style={selectStyle} value={filterCochera} onChange={e => setFilterCochera(e.target.value)}>
                <option value="">Cochera</option>
                <option value="SI">Con cochera</option>
                <option value="NO">Sin cochera</option>
              </select>
              <select
                className={selectClass}
                style={selectStyle}
                value={sortKey}
                onChange={e => setSortKey(e.target.value as SortKey)}
              >
                <option value="precio">Ordenar: Precio</option>
                <option value="metrosCubiertos">Ordenar: Metros</option>
                <option value="tiempoAlTrabajo">Ordenar: Tiempo trabajo</option>
                <option value="zona">Ordenar: Zona</option>
              </select>
              <button
                onClick={() => setSortAsc(a => !a)}
                className={selectClass + ' font-medium'}
                style={selectStyle}
              >
                {sortAsc ? '↑ Ascendente' : '↓ Descendente'}
              </button>
              
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-sm font-medium transition-colors hover:bg-white" style={selectStyle}>
                <input
                  type="checkbox"
                  checked={showDescartados}
                  onChange={e => setShowDescartados(e.target.checked)}
                  className="accent-orange-500"
                />
                Ver descartados
              </label>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin mx-auto mb-4" />
              <p style={{ color: 'var(--muted)' }}>Cargando propiedades...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--border)' }}>
              <Home size={28} style={{ color: 'var(--muted)' }} />
            </div>
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--dark)' }}>Sin resultados</h3>
            <p style={{ color: 'var(--muted)' }}>Probá con otros filtros o agregá una nueva propiedad.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <PropertyCard
                key={p.id}
                property={p}
                index={i}
                onEdit={() => { setEditTarget(p); setShowForm(true); }}
                onDelete={() => setDeleteId(p.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Form modal */}
      {showForm && (
        <PropertyForm
          initial={editTarget ?? undefined}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center" style={{ border: '1px solid var(--border)' }}>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--dark)' }}>¿Eliminar propiedad?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Esta acción eliminará la propiedad del Excel permanentemente.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl border font-medium text-sm transition-all hover:bg-gray-50"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
