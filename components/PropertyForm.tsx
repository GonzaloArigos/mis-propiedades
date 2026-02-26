'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

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

const ZONAS = ['Villa Devoto', 'Villa Urquiza', 'Villa Ballester', 'San Martin', 'Saavedra', 'Villa Pureyredon', 'Otra'];

const EMPTY: Omit<Property, 'id'> = {
  zona: 'Villa Devoto',
  descripcion: '',
  direccion: '',
  link: '',
  ambientes: 2,
  precio: 0,
  expensas: 0,
  cochera: 'NO',
  antiguedad: 0,
  metrosTotales: 0,
  metrosCubiertos: 0,
  tiempoAlTrabajo: 0,
  descartado: 'NO',
  motivo: '',
  visitado: 'NO',
};

// Defined OUTSIDE the component — if inside, React remounts the element
// on every keystroke and the input loses focus
const inputClass = "w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all";
const inputStyle: React.CSSProperties = { borderColor: 'var(--border)', background: 'var(--cream)' };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

interface Props {
  initial?: Property;
  onSave: (data: Omit<Property, 'id'>) => void;
  onClose: () => void;
}

export default function PropertyForm({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Property, 'id'>>(
    initial ? { ...initial } : EMPTY
  );

  const set = (key: keyof typeof form, val: string | number) =>
    setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--dark)' }}>
            {initial ? 'Editar propiedad' : 'Nueva propiedad'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          <Field label="Zona">
            <select className={inputClass} style={inputStyle} value={form.zona} onChange={e => set('zona', e.target.value)}>
              {ZONAS.map(z => <option key={z}>{z}</option>)}
            </select>
          </Field>

          <Field label="Ambientes">
            <select className={inputClass} style={inputStyle} value={form.ambientes} onChange={e => set('ambientes', Number(e.target.value))}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>

          <Field label="Visitado">
            <select className={inputClass} style={inputStyle} value={form.visitado} onChange={e => set('visitado', e.target.value)}>
              <option value="NO">No</option>
              <option value="SI">Sí</option>
            </select>
          </Field>

          <div className="col-span-2">
            <Field label="Descripción / Notas">
              <textarea
                className={inputClass}
                style={inputStyle}
                rows={3}
                value={form.descripcion}
                onChange={e => set('descripcion', e.target.value)}
                placeholder="Ej: A estrenar, piso 3, con amenities..."
              />
            </Field>
          </div>

          <Field label="Dirección / Maps Link">
            <input className={inputClass} style={inputStyle} value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="URL Google Maps" />
          </Field>

          <Field label="Link Publicación">
            <input className={inputClass} style={inputStyle} value={form.link} onChange={e => set('link', e.target.value)} placeholder="URL MercadoLibre / Zonaprop" />
          </Field>

          <Field label="Precio (USD)">
            <input type="number" className={inputClass} style={inputStyle} value={form.precio} onChange={e => set('precio', Number(e.target.value))} />
          </Field>

          <Field label="Expensas ($)">
            <input type="number" className={inputClass} style={inputStyle} value={form.expensas} onChange={e => set('expensas', Number(e.target.value))} />
          </Field>

          <Field label="Metros Totales">
            <input type="number" className={inputClass} style={inputStyle} value={form.metrosTotales} onChange={e => set('metrosTotales', Number(e.target.value))} />
          </Field>

          <Field label="Metros Cubiertos">
            <input type="number" className={inputClass} style={inputStyle} value={form.metrosCubiertos} onChange={e => set('metrosCubiertos', Number(e.target.value))} />
          </Field>

          <Field label="Antigüedad (años)">
            <input type="number" className={inputClass} style={inputStyle} value={form.antiguedad} onChange={e => set('antiguedad', Number(e.target.value))} />
          </Field>

          <Field label="Tiempo al trabajo (min)">
            <input type="number" className={inputClass} style={inputStyle} value={form.tiempoAlTrabajo} onChange={e => set('tiempoAlTrabajo', Number(e.target.value))} />
          </Field>

          <Field label="Cochera">
            <select className={inputClass} style={inputStyle} value={form.cochera} onChange={e => set('cochera', e.target.value)}>
              <option value="SI">Sí</option>
              <option value="NO">No</option>
            </select>
          </Field>

          <Field label="Descartado">
            <select className={inputClass} style={inputStyle} value={form.descartado} onChange={e => set('descartado', e.target.value)}>
              <option value="NO">No</option>
              <option value="SI">Sí</option>
            </select>
          </Field>

          {form.descartado === 'SI' && (
            <div className="col-span-2">
              <Field label="Motivo de descarte">
                <input className={inputClass} style={inputStyle} value={form.motivo} onChange={e => set('motivo', e.target.value)} placeholder="¿Por qué se descartó?" />
              </Field>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border font-medium text-sm transition-all hover:bg-gray-50"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            {initial ? 'Guardar cambios' : 'Agregar propiedad'}
          </button>
        </div>
      </div>
    </div>
  );
}
