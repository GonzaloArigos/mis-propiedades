'use client';
import { MapPin, Clock, Maximize2, Car, Edit2, Trash2, ExternalLink, Home } from 'lucide-react';

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
}

interface Props {
  property: Property;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const ZONA_COLORS: Record<string, string> = {
  'Villa Devoto': '#4A7C59',
  'Villa Urquiza': '#5B6BAD',
  'Villa Ballester': '#A0522D',
  'San Martin': '#8B5E83',
  'Saavedra': '#4A7A8A',
  'Villa Pureyredon': '#7A6B3E',
  'Otra': '#6B7280',
};

export default function PropertyCard({ property: p, index, onEdit, onDelete }: Props) {
  const isDescartado = p.descartado === 'SI';
  const zoneColor = ZONA_COLORS[p.zona] ?? '#6B7280';
  const pricePerM2 = p.metrosCubiertos > 0 ? Math.round(p.precio / p.metrosCubiertos) : 0;

  return (
    <div
      className="property-card fade-up bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        border: '1px solid var(--border)',
        filter: isDescartado ? 'grayscale(60%)' : 'none',
      }}
    >
      {/* Color header band */}
      <div className="h-2 w-full" style={{ background: isDescartado ? '#9CA3AF' : zoneColor }} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: `${zoneColor}18`, color: zoneColor }}
              >
                {p.zona}
              </span>
              {isDescartado && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-500">
                  Descartado
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Home size={13} style={{ color: 'var(--muted)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--dark)' }}>
                {p.ambientes} {p.ambientes === 1 ? 'ambiente' : 'ambientes'}
                {p.antiguedad === 0 ? ' · A estrenar' : ` · ${p.antiguedad} años`}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-xl font-bold" style={{ color: 'var(--dark)' }}>
              USD {p.precio && p.precio.toLocaleString()}
            </div>
            {p.expensas > 0 && (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                + ${p.expensas.toLocaleString()} exp.
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {p.descripcion && (
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--muted)' }}>
            {p.descripcion}
          </p>
        )}

        {isDescartado && p.motivo && (
          <div className="text-xs px-3 py-2 rounded-lg bg-red-50 text-red-500 font-medium">
            ✕ {p.motivo}
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Stat icon={<Maximize2 size={12} />} label="Totales" value={`${p.metrosTotales} m²`} />
          <Stat icon={<Maximize2 size={12} />} label="Cubiertos" value={`${p.metrosCubiertos} m²`} />
          <Stat icon={<Clock size={12} />} label="Al trabajo" value={`${p.tiempoAlTrabajo} min`} />
          <Stat icon={<Car size={12} />} label="Cochera" value={p.cochera === 'SI' ? 'Sí ✓' : 'No'} highlight={p.cochera === 'SI'} />
        </div>

        {pricePerM2 > 0 && (
          <div className="text-xs text-center pt-1" style={{ color: 'var(--muted)' }}>
            ~USD {pricePerM2.toLocaleString()} / m² cubierto
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-4 flex items-center gap-2">
        {p.link && p.link !== 'LINK' && (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors hover:opacity-80"
            style={{ background: `${zoneColor}15`, color: zoneColor }}
          >
            <ExternalLink size={12} /> Ver publicación
          </a>
        )}
        {p.direccion && p.direccion !== 'MAPS' && (
          <a
            href={p.direccion}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors hover:opacity-80"
            style={{ background: `${zoneColor}15`, color: zoneColor }}
          >
            <MapPin size={12} /> Mapa
          </a>
        )}
        <div className="ml-auto flex gap-1">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Editar"
          >
            <Edit2 size={14} style={{ color: 'var(--muted)' }} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--cream)' }}>
      <span style={{ color: 'var(--muted)' }}>{icon}</span>
      <div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
        <div className={`text-sm font-semibold ${highlight ? 'text-green-600' : ''}`} style={highlight ? {} : { color: 'var(--dark)' }}>
          {value}
        </div>
      </div>
    </div>
  );
}
