'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Ellipse,
  Line,
  Arrow,
  Star,
  RegularPolygon,
  Text,
  Image as KonvaImage,
  Transformer,
} from 'react-konva';

/* ─────────────────────────── constants ─────────────────────────── */
const CW = 794; // canvas width  (A4 portrait @ 96dpi)
const CH = 1123; // canvas height

const ZOOM_MIN = 0.1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.1;
const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

const FONT_FAMILIES = [
  'Georgia',
  'Times New Roman',
  'Arial',
  'Helvetica',
  'Verdana',
  'Trebuchet MS',
  'Courier New',
];

const SWATCHES = [
  '#0f172a',
  '#1e293b',
  '#334155',
  '#64748b',
  '#94a3b8',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#ffffff',
  '#f8fafc',
];

/* ─────────────────────────── helpers ─────────────────────────── */
const stripHtml = (html) => {
  if (!html) return '';
  if (typeof window === 'undefined') return html;
  const d = document.createElement('DIV');
  d.innerHTML = html;
  return d.textContent || d.innerText || '';
};
const uid = () => `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const pct = (z) => `${Math.round(z * 100)}%`;

/* ─────────────────────────── shape catalogue ─────────────────── */
const CATALOGUE = [
  {
    group: 'TEXT',
    items: [
      { type: 'text', icon: '𝐓', label: 'Heading', variant: 'heading' },
      { type: 'text', icon: '¶', label: 'Body Text', variant: 'body' },
      { type: 'text', icon: '─', label: 'Divider', variant: 'divider' },
    ],
  },
  {
    group: 'SHAPES',
    items: [
      { type: 'rect', icon: '▬', label: 'Rectangle' },
      { type: 'rect-round', icon: '▭', label: 'Pill' },
      { type: 'circle', icon: '●', label: 'Circle' },
      { type: 'ellipse', icon: '⬬', label: 'Ellipse' },
      { type: 'triangle', icon: '▲', label: 'Triangle' },
      { type: 'pentagon', icon: '⬠', label: 'Pentagon' },
      { type: 'hexagon', icon: '⬡', label: 'Hexagon' },
      { type: 'star', icon: '★', label: 'Star' },
    ],
  },
  {
    group: 'LINES',
    items: [
      { type: 'line', icon: '╱', label: 'Line' },
      { type: 'arrow', icon: '→', label: 'Arrow' },
    ],
  },
  { group: 'MEDIA', items: [{ type: 'image', icon: '🖼', label: 'Image' }] },
];

/* ─────────────────────────── default blocks ─────────────────── */
const makeBlock = (type, variant) => {
  const base = {
    id: uid(),
    type,
    variant,
    x: 120,
    y: 120,
    fill: '#1a1a2e',
    stroke: 'transparent',
    strokeWidth: 0,
    opacity: 1,
    rotation: 0,
  };
  switch (type) {
    case 'text':
      return {
        ...base,
        width: variant === 'heading' ? 460 : 400,
        height: variant === 'heading' ? 60 : 120,
        content:
          variant === 'heading'
            ? 'Your Name'
            : variant === 'divider'
              ? ''
              : 'Your summary…',
        fontSize: variant === 'heading' ? 28 : 14,
        fontFamily: 'Georgia',
        fontStyle: variant === 'heading' ? 'bold' : 'normal',
        align: 'left',
        color: variant === 'heading' ? '#0f172a' : '#374151',
        isDivider: variant === 'divider',
      };
    case 'rect':
    case 'rect-round':
      return {
        ...base,
        width: 200,
        height: 80,
        fill: '#0f172a',
        cornerRadius: type === 'rect-round' ? 40 : 4,
      };
    case 'circle':
      return { ...base, radius: 50, width: 100, height: 100 };
    case 'ellipse':
      return { ...base, radiusX: 80, radiusY: 40, width: 160, height: 80 };
    case 'triangle':
      return { ...base, sides: 3, radius: 60, width: 120, height: 120 };
    case 'pentagon':
      return { ...base, sides: 5, radius: 55, width: 110, height: 110 };
    case 'hexagon':
      return { ...base, sides: 6, radius: 55, width: 110, height: 110 };
    case 'star':
      return {
        ...base,
        numPoints: 5,
        innerRadius: 25,
        outerRadius: 55,
        width: 110,
        height: 110,
      };
    case 'line':
      return {
        ...base,
        points: [0, 0, 160, 0],
        stroke: '#0f172a',
        strokeWidth: 2,
        fill: 'transparent',
        width: 160,
        height: 4,
      };
    case 'arrow':
      return {
        ...base,
        points: [0, 0, 160, 0],
        stroke: '#0f172a',
        strokeWidth: 2,
        fill: '#0f172a',
        pointerLength: 10,
        pointerWidth: 8,
        width: 160,
        height: 20,
      };
    case 'image':
      return {
        ...base,
        fill: 'transparent',
        stroke: '#6366f1',
        strokeWidth: 1,
        width: 220,
        height: 160,
        src: null,
      };
    default:
      return { ...base, width: 120, height: 120 };
  }
};

/* ─────────────────────────── Konva image loader ─────────────── */
const KonvaImageBlock = ({ block, ...props }) => {
  const [img, setImg] = useState(null);
  useEffect(() => {
    if (!block.src) return;
    const i = new window.Image();
    i.src = block.src;
    i.onload = () => setImg(i);
  }, [block.src]);
  return <KonvaImage {...props} image={img} />;
};

/* ═══════════════════════════════════════════════════════════════
   COLOUR PICKER POPOVER
   (small swatch grid that pops on click — used in top bar)
═══════════════════════════════════════════════════════════════ */
const ColorPicker = ({ value, onChange, label }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      ref={ref}
      className='relative flex flex-col items-center gap-0.5 cursor-pointer'
      title={label}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className='w-7 h-7 rounded-lg border-2 border-white/20 hover:border-indigo-400 transition-all shadow-inner'
        style={{ background: value || '#000' }}
      />
      <span className='text-[8px] text-slate-500 leading-none'>{label}</span>
      {open && (
        <div className='absolute top-10 left-1/2 -translate-x-1/2 z-[500] p-2 bg-[#1e2638] border border-white/10 rounded-xl shadow-2xl w-[148px]'>
          <div className='flex flex-wrap gap-1 mb-2'>
            {SWATCHES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className={`w-[18px] h-[18px] rounded-full hover:scale-125 transition-transform ring-1 ring-white/10 ${value === c ? 'ring-2 ring-indigo-400 scale-110' : ''}`}
                style={{ background: c }}
              />
            ))}
          </div>
          <input
            type='color'
            value={value || '#000000'}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            className='w-full h-7 rounded cursor-pointer border-0 bg-transparent'
          />
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TOP BAR  —  contextual controls based on selected element
═══════════════════════════════════════════════════════════════ */
const Sep = () => <div className='w-px h-6 bg-white/10 mx-1 shrink-0' />;

const TBBtn = ({ active, onClick, children, title, className = '' }) => (
  <button
    onClick={onClick}
    title={title}
    className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-medium flex items-center justify-center shrink-0 transition-all duration-100 border
      ${
        active
          ? 'bg-indigo-600 text-white border-indigo-600'
          : `bg-white/[0.05] text-slate-300 border-white/10 hover:bg-white/10 hover:text-white ${className}`
      }`}
  >
    {children}
  </button>
);

const TopBar = ({ sel, update, selectedId, onDelete, imageInputRef }) => {
  if (!sel)
    return (
      <div className='h-12 shrink-0 flex items-center px-5 border-b border-white/[0.06] bg-[#161b27]'>
        <span className='text-xs text-slate-500 select-none'>
          Select an element to edit its properties
        </span>
      </div>
    );

  const isText = sel.type === 'text';
  const isShape = [
    'rect',
    'rect-round',
    'circle',
    'ellipse',
    'triangle',
    'pentagon',
    'hexagon',
    'star',
  ].includes(sel.type);
  const isLine = ['line', 'arrow'].includes(sel.type);
  const isImage = sel.type === 'image';

  return (
    <div className='h-12 shrink-0 flex items-center gap-2 px-4 border-b border-white/[0.06] bg-[#161b27] overflow-x-auto'>
      {/* ── TEXT controls ── */}
      {isText && (
        <>
          {/* Font family */}
          <select
            value={sel.fontFamily || 'Georgia'}
            onChange={(e) => update(selectedId, { fontFamily: e.target.value })}
            className='h-8 bg-white/[0.07] border border-white/10 rounded-lg px-2 text-slate-200 text-xs outline-none focus:border-indigo-500 cursor-pointer w-36 shrink-0'
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* Font size stepper */}
          <div className='flex items-center h-8 bg-white/[0.07] border border-white/10 rounded-lg overflow-hidden shrink-0'>
            <button
              onClick={() =>
                update(selectedId, {
                  fontSize: Math.max(6, (sel.fontSize || 16) - 1),
                })
              }
              className='w-7 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-base'
            >
              −
            </button>
            <input
              type='number'
              min={6}
              max={200}
              value={sel.fontSize || 16}
              onChange={(e) =>
                update(selectedId, { fontSize: parseInt(e.target.value) || 16 })
              }
              className='w-10 text-center bg-transparent text-slate-200 text-xs outline-none'
            />
            <button
              onClick={() =>
                update(selectedId, {
                  fontSize: Math.min(200, (sel.fontSize || 16) + 1),
                })
              }
              className='w-7 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-base'
            >
              +
            </button>
          </div>

          <Sep />
          <ColorPicker
            value={sel.color}
            onChange={(c) => update(selectedId, { color: c })}
            label='Text'
          />
          <Sep />

          {/* Bold / Italic */}
          <TBBtn
            active={sel.fontStyle === 'bold'}
            onClick={() =>
              update(selectedId, {
                fontStyle: sel.fontStyle === 'bold' ? 'normal' : 'bold',
              })
            }
            title='Bold'
          >
            𝐁
          </TBBtn>
          <TBBtn
            active={sel.fontStyle === 'italic'}
            onClick={() =>
              update(selectedId, {
                fontStyle: sel.fontStyle === 'italic' ? 'normal' : 'italic',
              })
            }
            title='Italic'
          >
            𝐼
          </TBBtn>

          <Sep />

          {/* Alignment */}
          {[
            ['left', '⬛⬜⬜'],
            ['center', '⬜⬛⬜'],
            ['right', '⬜⬜⬛'],
          ].map(([a]) => (
            <TBBtn
              key={a}
              active={sel.align === a}
              onClick={() => update(selectedId, { align: a })}
              title={`Align ${a}`}
            >
              {a === 'left' ? '⫷' : a === 'center' ? '≡' : '⫸'}
            </TBBtn>
          ))}

          <Sep />
        </>
      )}

      {/* ── SHAPE controls ── */}
      {isShape && (
        <>
          <ColorPicker
            value={sel.fill}
            onChange={(c) => update(selectedId, { fill: c })}
            label='Fill'
          />
          <ColorPicker
            value={sel.stroke}
            onChange={(c) => update(selectedId, { stroke: c })}
            label='Stroke'
          />

          {/* Stroke width */}
          <div className='flex items-center gap-1.5 shrink-0'>
            <span className='text-[9px] text-slate-500 uppercase tracking-wider'>
              SW
            </span>
            <input
              type='range'
              min={0}
              max={20}
              step={0.5}
              value={sel.strokeWidth || 0}
              onChange={(e) =>
                update(selectedId, { strokeWidth: parseFloat(e.target.value) })
              }
              className='w-20 accent-indigo-500 cursor-pointer'
            />
            <span className='text-[10px] text-slate-400 w-5'>
              {sel.strokeWidth || 0}
            </span>
          </div>

          {/* Corner radius – rect only */}
          {(sel.type === 'rect' || sel.type === 'rect-round') && (
            <div className='flex items-center gap-1.5 shrink-0'>
              <span className='text-[9px] text-slate-500 uppercase tracking-wider'>
                ◻ R
              </span>
              <input
                type='range'
                min={0}
                max={80}
                step={1}
                value={sel.cornerRadius || 0}
                onChange={(e) =>
                  update(selectedId, { cornerRadius: parseInt(e.target.value) })
                }
                className='w-20 accent-indigo-500 cursor-pointer'
              />
              <span className='text-[10px] text-slate-400 w-5'>
                {sel.cornerRadius || 0}
              </span>
            </div>
          )}

          <Sep />
        </>
      )}

      {/* ── LINE / ARROW controls ── */}
      {isLine && (
        <>
          <ColorPicker
            value={sel.stroke || sel.fill}
            onChange={(c) => update(selectedId, { stroke: c, fill: c })}
            label='Color'
          />
          <div className='flex items-center gap-1.5 shrink-0'>
            <span className='text-[9px] text-slate-500 uppercase tracking-wider'>
              Width
            </span>
            <input
              type='range'
              min={0.5}
              max={20}
              step={0.5}
              value={sel.strokeWidth || 2}
              onChange={(e) =>
                update(selectedId, { strokeWidth: parseFloat(e.target.value) })
              }
              className='w-20 accent-indigo-500 cursor-pointer'
            />
            <span className='text-[10px] text-slate-400 w-5'>
              {sel.strokeWidth || 2}
            </span>
          </div>
          <Sep />
        </>
      )}

      {/* ── IMAGE controls ── */}
      {isImage && (
        <>
          <label className='h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500 transition-all shrink-0'>
            📁 Upload
            <input
              type='file'
              accept='image/*'
              className='hidden'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () =>
                  update(selectedId, { src: reader.result });
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
          </label>
          <button
            onClick={() => {
              const url = window.prompt('Image URL:');
              if (url) update(selectedId, { src: url });
            }}
            className='h-8 px-3 rounded-lg text-xs font-medium bg-white/[0.06] border border-white/10 text-slate-300 hover:bg-white/10 transition-all shrink-0'
          >
            🔗 URL
          </button>
          <Sep />
        </>
      )}

      {/* ── SHARED: Opacity ── */}
      <div className='flex items-center gap-1.5 shrink-0'>
        <span className='text-[9px] text-slate-500 uppercase tracking-wider'>
          Opacity
        </span>
        <input
          type='range'
          min={0}
          max={1}
          step={0.01}
          value={sel.opacity ?? 1}
          onChange={(e) =>
            update(selectedId, { opacity: parseFloat(e.target.value) })
          }
          className='w-20 accent-indigo-500 cursor-pointer'
        />
        <span className='text-[10px] text-slate-400 w-8 text-right'>
          {Math.round((sel.opacity ?? 1) * 100)}%
        </span>
      </div>

      {/* ── SHARED: Rotation ── */}
      <Sep />
      <div className='flex items-center gap-1.5 shrink-0'>
        <span className='text-[9px] text-slate-500 uppercase tracking-wider'>
          Rotate
        </span>
        <input
          type='number'
          min={-360}
          max={360}
          value={Math.round(sel.rotation || 0)}
          onChange={(e) =>
            update(selectedId, { rotation: parseInt(e.target.value) || 0 })
          }
          className='w-12 h-8 text-center bg-white/[0.07] border border-white/10 rounded-lg text-slate-200 text-xs outline-none focus:border-indigo-500'
        />
        <span className='text-[10px] text-slate-400'>°</span>
      </div>

      {/* ── SHARED: Delete ── */}
      <Sep />
      <button
        onClick={onDelete}
        className='h-8 px-3 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all shrink-0'
      >
        🗑 Delete
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BOTTOM ZOOM BAR
═══════════════════════════════════════════════════════════════ */
const BottomBar = ({ zoom, setZoom, onFit }) => {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const commit = (val) => {
    const n = parseFloat(val) / 100;
    if (!isNaN(n)) setZoom(clamp(n, ZOOM_MIN, ZOOM_MAX));
    setEditing(false);
  };

  return (
    <div className='h-11 shrink-0 flex items-center justify-between px-5 bg-[#161b27] border-t border-white/[0.06] z-30'>
      <div className='flex items-center gap-4 text-xs text-slate-500 select-none'>
        <span className='flex items-center gap-1.5 hover:text-slate-300 cursor-default transition-colors'>
          📝 Notes
        </span>
        <span className='flex items-center gap-1.5 hover:text-slate-300 cursor-default transition-colors'>
          ⏱ Timer
        </span>
      </div>

      <div className='flex items-center gap-2'>
        <button
          onClick={() =>
            setZoom((z) => clamp(z - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX))
          }
          className='w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.05] border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-base'
          title='Zoom out (Ctrl+-)'
        >
          −
        </button>

        <input
          type='range'
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className='w-28 accent-indigo-500 cursor-pointer'
        />

        <button
          onClick={() =>
            setZoom((z) => clamp(z + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX))
          }
          className='w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.05] border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-base'
          title='Zoom in (Ctrl++)'
        >
          +
        </button>

        {editing ? (
          <input
            autoFocus
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={() => commit(inputVal)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit(inputVal);
              if (e.key === 'Escape') setEditing(false);
            }}
            className='w-16 h-7 text-center text-xs bg-white/10 border border-indigo-500 rounded-lg text-white outline-none'
          />
        ) : (
          <button
            onClick={() => {
              setInputVal(String(Math.round(zoom * 100)));
              setEditing(true);
            }}
            className='w-16 h-7 rounded-lg text-xs font-medium bg-white/[0.05] border border-white/10 text-slate-300 hover:bg-white/10 transition-all'
            title='Click to type zoom %'
          >
            {pct(zoom)}
          </button>
        )}

        <select
          value=''
          onChange={(e) => {
            if (e.target.value) setZoom(parseFloat(e.target.value));
          }}
          className='h-7 bg-white/[0.05] border border-white/10 rounded-lg px-1.5 text-slate-400 text-xs outline-none cursor-pointer hover:bg-white/10'
        >
          <option value='' disabled>
            ⌄
          </option>
          {ZOOM_PRESETS.map((z) => (
            <option key={z} value={z}>
              {pct(z)}
            </option>
          ))}
        </select>

        <button
          onClick={onFit}
          className='h-7 px-2.5 rounded-lg text-[10px] font-medium bg-white/[0.05] border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all'
          title='Fit canvas to screen'
        >
          Fit
        </button>
      </div>

      <div className='flex items-center gap-3 text-xs text-slate-500 select-none'>
        <span>📄 Pages</span>
        <span className='bg-white/[0.06] border border-white/10 rounded px-2 py-0.5 text-slate-300'>
          1 / 1
        </span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function NewResume() {
  const [blocks, setBlocks] = useState([
    {
      ...makeBlock('text', 'heading'),
      id: 'h1',
      x: 50,
      y: 48,
      content: 'Alexandra Chen',
      color: '#0f172a',
      fontSize: 34,
      width: 500,
      height: 52,
    },
    {
      ...makeBlock('text', 'body'),
      id: 'sub',
      x: 50,
      y: 108,
      content: 'Senior Product Designer · San Francisco, CA · alex@mail.com',
      color: '#64748b',
      fontSize: 13,
      width: 500,
      height: 30,
    },
    {
      ...makeBlock('line'),
      id: 'div1',
      x: 50,
      y: 150,
      points: [0, 0, 500, 0],
      stroke: '#e2e8f0',
      strokeWidth: 1.5,
    },
    {
      ...makeBlock('rect'),
      id: 'acc',
      x: 50,
      y: 170,
      width: 140,
      height: 6,
      fill: '#6366f1',
      cornerRadius: 3,
      stroke: 'transparent',
    },
    {
      ...makeBlock('text', 'heading'),
      id: 'exp-h',
      x: 50,
      y: 198,
      content: 'Experience',
      color: '#0f172a',
      fontSize: 15,
      fontStyle: 'bold',
      width: 200,
      height: 28,
    },
    {
      ...makeBlock('text', 'body'),
      id: 'exp1',
      x: 50,
      y: 238,
      content:
        'Lead Product Designer — Acme Corp\n2021–Present\nDrove end-to-end design of flagship SaaS product serving 200k+ users.',
      color: '#374151',
      fontSize: 13,
      width: 500,
      height: 80,
    },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [zoom, setZoom] = useState(0.75);

  const transformerRef = useRef();
  const stageRef = useRef();
  const canvasAreaRef = useRef();

  const update = useCallback(
    (id, attrs) =>
      setBlocks((p) => p.map((b) => (b.id === id ? { ...b, ...attrs } : b))),
    [],
  );

  const add = (type, variant) => {
    const b = makeBlock(type, variant);
    setBlocks((p) => [...p, b]);
    setSelectedId(b.id);
  };

  const remove = (id) => {
    setBlocks((p) => p.filter((b) => b.id !== id));
    setSelectedId(null);
    setEditingId(null);
  };

  const moveZ = (id, dir) =>
    setBlocks((p) => {
      const i = p.findIndex((b) => b.id === id);
      if (i < 0) return p;
      const a = [...p];
      const t =
        dir === 'up' ? Math.min(i + 1, p.length - 1) : Math.max(i - 1, 0);
      [a[i], a[t]] = [a[t], a[i]];
      return a;
    });

  /* fit to screen */
  const handleFit = useCallback(() => {
    const el = canvasAreaRef.current;
    if (!el) return;
    const zx = (el.clientWidth - 96) / CW;
    const zy = (el.clientHeight - 96) / CH;
    setZoom(clamp(Math.min(zx, zy), ZOOM_MIN, ZOOM_MAX));
  }, []);

  /* ctrl+scroll zoom */
  useEffect(() => {
    const el = canvasAreaRef.current;
    if (!el) return;
    const h = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom((z) =>
        clamp(z + (e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP), ZOOM_MIN, ZOOM_MAX),
      );
    };
    el.addEventListener('wheel', h, { passive: false });
    return () => el.removeEventListener('wheel', h);
  }, []);

  /* keyboard shortcuts */
  useEffect(() => {
    const h = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          setZoom((z) => clamp(z + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX));
        }
        if (e.key === '-') {
          e.preventDefault();
          setZoom((z) => clamp(z - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX));
        }
        if (e.key === '0') {
          e.preventDefault();
          setZoom(1);
        }
      }
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedId &&
        !editingId
      ) {
        e.preventDefault();
        remove(selectedId);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [selectedId, editingId]);

  /* sync transformer */
  useEffect(() => {
    if (!transformerRef.current) return;
    if (!selectedId || editingId) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }
    const node = stageRef.current?.findOne(`#${selectedId}`);
    transformerRef.current.nodes(node ? [node] : []);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId, editingId]);

  const onDragEnd = (id, e) => update(id, { x: e.target.x(), y: e.target.y() });

  const onTransformEnd = (e) => {
    const node = e.target;
    const id = node.id();
    const b = blocks.find((b) => b.id === id);
    if (!b) return;
    const sx = node.scaleX(),
      sy = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    const a = { x: node.x(), y: node.y(), rotation: node.rotation() };
    if (b.type === 'circle') a.radius = Math.max(10, (b.radius || 50) * sx);
    else if (b.type === 'ellipse') {
      a.radiusX = Math.max(10, (b.radiusX || 80) * sx);
      a.radiusY = Math.max(10, (b.radiusY || 40) * sy);
    } else if (['triangle', 'pentagon', 'hexagon'].includes(b.type))
      a.radius = Math.max(10, (b.radius || 55) * sx);
    else if (b.type === 'star') {
      a.innerRadius = Math.max(5, (b.innerRadius || 25) * sx);
      a.outerRadius = Math.max(10, (b.outerRadius || 55) * sx);
    } else if (['line', 'arrow'].includes(b.type)) {
      const p = b.points;
      a.points = [p[0], p[1], p[2] * sx, p[3] * sy];
    } else {
      a.width = Math.max(20, node.width() * sx);
      a.height = Math.max(20, node.height() * sy);
    }
    update(id, a);
  };

  const sel = blocks.find((b) => b.id === selectedId);

  /* render each Konva block */
  const renderBlock = (b) => {
    const common = {
      key: b.id,
      id: b.id,
      x: b.x,
      y: b.y,
      rotation: b.rotation || 0,
      opacity: b.opacity ?? 1,
      draggable: !editingId,
      onClick: () => {
        setSelectedId(b.id);
        setEditingId(null);
      },
      onDblClick: () => {
        if (b.type === 'text') {
          setSelectedId(b.id);
          setEditingId(b.id);
        }
      },
      onDragEnd: (e) => onDragEnd(b.id, e),
      onTransformEnd,
    };

    if (b.isDivider)
      return (
        <Line
          key={b.id}
          id={b.id}
          x={b.x}
          y={b.y}
          points={[0, 0, b.width || 500, 0]}
          stroke={b.color || '#e2e8f0'}
          strokeWidth={b.strokeWidth || 1}
          draggable={!editingId}
          onClick={() => setSelectedId(b.id)}
          onDragEnd={(e) => onDragEnd(b.id, e)}
          onTransformEnd={onTransformEnd}
        />
      );

    switch (b.type) {
      case 'text':
        return (
          <Text
            {...common}
            width={b.width}
            height={b.height}
            text={stripHtml(b.content) || ''}
            fontSize={b.fontSize}
            fontFamily={b.fontFamily || 'Georgia'}
            fontStyle={b.fontStyle || 'normal'}
            fill={b.color || '#0f172a'}
            align={b.align || 'left'}
            lineHeight={1.5}
            wrap='word'
          />
        );
      case 'image':
        return (
          <React.Fragment key={b.id}>
            {!b.src && (
              <Rect
                {...common}
                width={b.width}
                height={b.height}
                fill='#f1f5f9'
                stroke='#6366f1'
                strokeWidth={1}
                dash={[6, 3]}
              />
            )}
            {b.src && (
              <KonvaImageBlock
                block={b}
                {...common}
                width={b.width}
                height={b.height}
              />
            )}
          </React.Fragment>
        );
      case 'rect':
      case 'rect-round':
        return (
          <Rect
            {...common}
            width={b.width}
            height={b.height}
            fill={b.fill}
            stroke={b.stroke}
            strokeWidth={b.strokeWidth}
            cornerRadius={b.cornerRadius || 0}
          />
        );
      case 'circle':
        return (
          <Circle
            {...common}
            radius={b.radius || 50}
            fill={b.fill}
            stroke={b.stroke}
            strokeWidth={b.strokeWidth}
          />
        );
      case 'ellipse':
        return (
          <Ellipse
            {...common}
            radiusX={b.radiusX || 80}
            radiusY={b.radiusY || 40}
            fill={b.fill}
            stroke={b.stroke}
            strokeWidth={b.strokeWidth}
          />
        );
      case 'triangle':
      case 'pentagon':
      case 'hexagon':
        return (
          <RegularPolygon
            {...common}
            sides={b.sides}
            radius={b.radius || 55}
            fill={b.fill}
            stroke={b.stroke}
            strokeWidth={b.strokeWidth}
          />
        );
      case 'star':
        return (
          <Star
            {...common}
            numPoints={b.numPoints || 5}
            innerRadius={b.innerRadius || 25}
            outerRadius={b.outerRadius || 55}
            fill={b.fill}
            stroke={b.stroke}
            strokeWidth={b.strokeWidth}
          />
        );
      case 'line':
        return (
          <Line
            {...common}
            points={b.points || [0, 0, 160, 0]}
            stroke={b.stroke || b.fill || '#0f172a'}
            strokeWidth={b.strokeWidth || 2}
          />
        );
      case 'arrow':
        return (
          <Arrow
            {...common}
            points={b.points || [0, 0, 160, 0]}
            stroke={b.stroke || '#0f172a'}
            strokeWidth={b.strokeWidth || 2}
            fill={b.fill || '#0f172a'}
            pointerLength={b.pointerLength || 10}
            pointerWidth={b.pointerWidth || 8}
          />
        );
      default:
        return null;
    }
  };

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <section className='flex flex-col w-full h-screen overflow-hidden bg-[#0d1117] font-sans relative'>
      {/* ── TOP CONTEXTUAL BAR ── */}
      <TopBar
        sel={sel}
        update={update}
        selectedId={selectedId}
        onDelete={() => selectedId && remove(selectedId)}
      />

      {/* ── MIDDLE ROW: left panel + canvas ── */}
      <div className='flex flex-1 min-h-0 overflow-hidden relative'>
        {/* Panel toggle button */}
        <button
          onClick={() => setPanelOpen((p) => !p)}
          className='absolute top-4 z-40 w-9 h-9 rounded-full flex items-center justify-center bg-[#1e2638] border border-white/10 text-slate-400 text-sm shadow-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300'
          style={{ left: panelOpen ? 228 : 14 }}
          title={panelOpen ? 'Collapse panel' : 'Expand panel'}
        >
          {panelOpen ? '◀' : '▶'}
        </button>

        {/* ── LEFT PANEL (floating overlay) ── */}
        <aside
          className={`absolute inset-y-0 left-0 z-30 w-[220px] flex flex-col bg-[#161b27] border-r border-white/[0.06] shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out ${panelOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className='flex items-center px-4 py-4 border-b border-white/[0.06]'>
            <span className='text-sm font-semibold text-slate-100 tracking-tight'>
              Elements
            </span>
          </div>

          <div className='flex-1 overflow-y-auto'>
            {CATALOGUE.map((group) => (
              <div key={group.group}>
                <p className='text-[9px] font-semibold tracking-[0.12em] uppercase text-slate-500 px-3.5 pt-3.5 pb-1.5'>
                  {group.group}
                </p>
                <div className='grid grid-cols-2 gap-1.5 px-2.5'>
                  {group.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => add(item.type, item.variant)}
                      className='flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] text-slate-400 border border-white/[0.06] bg-white/[0.03] hover:bg-indigo-500/20 hover:border-indigo-500 hover:text-indigo-200 hover:-translate-y-0.5 transition-all duration-150'
                    >
                      <span className='text-lg leading-none'>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className='mx-2.5 mt-4 mb-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400 leading-relaxed'>
              💡 Ctrl+Scroll to zoom · Double-click text to edit · Delete key
              removes selection
            </div>

            <p className='text-[9px] font-semibold tracking-[0.12em] uppercase text-slate-500 px-3.5 pt-3.5 pb-1.5'>
              Layers
            </p>
            {[...blocks].reverse().map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className={`flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer border-b border-white/[0.04] transition-colors duration-100 ${selectedId === b.id ? 'bg-indigo-500/10 text-indigo-300' : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'}`}
              >
                <span className='truncate max-w-[110px]'>
                  {b.type === 'text'
                    ? stripHtml(b.content)?.slice(0, 18) || 'Text'
                    : b.type}
                </span>
                <div className='flex gap-1 shrink-0'>
                  {[
                    ['up', '↑'],
                    ['down', '↓'],
                  ].map(([dir, arr]) => (
                    <button
                      key={dir}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveZ(b.id, dir);
                      }}
                      className='w-5 h-5 rounded flex items-center justify-center text-[10px] bg-white/[0.06] text-slate-500 hover:bg-indigo-600 hover:text-white transition-colors'
                    >
                      {arr}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ══ CANVAS AREA ══
            overflow-auto gives scrollbars when zoomed in.
            The inner sizing div tells the browser how large the content is,
            so scrollbars are computed correctly.                          */}
        <main
          ref={canvasAreaRef}
          className='flex-1 overflow-auto'
          style={{
            background:
              'radial-gradient(ellipse at 25% 20%, rgba(99,102,241,0.07) 0%, transparent 55%),' +
              'radial-gradient(ellipse at 75% 80%, rgba(139,92,246,0.05) 0%, transparent 55%),' +
              '#0d1117',
          }}
        >
          {/*
            Sizing shell: its pixel dimensions = scaled canvas + padding.
            `min-*: 100%` ensures it still fills the viewport when zoom is small.
            `flex + items-start + justify-center` centres the canvas.
          */}
          <div
            className='flex items-start justify-center'
            style={{
              minWidth: '100%',
              minHeight: '100%',
              width: CW * zoom + 96,
              height: CH * zoom + 96,
              padding: 48,
              boxSizing: 'border-box',
            }}
          >
            {/*
              CSS-scaled canvas wrapper.
              Layout size stays CW × CH; CSS scale changes only the visual.
              We correct the "missing" visual space with the shell above.
            */}
            <div
              style={{
                width: CW,
                height: CH,
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              {/* Paper shadow */}
              <div
                className='absolute inset-0 rounded-sm pointer-events-none'
                style={{
                  boxShadow: `0 ${Math.round(24 / zoom)}px ${Math.round(60 / zoom)}px rgba(0,0,0,0.65), 0 0 0 ${Math.max(1, Math.round(1 / zoom))}px rgba(255,255,255,0.06)`,
                }}
              />

              {/* Konva Stage */}
              <Stage
                ref={stageRef}
                width={CW}
                height={CH}
                style={{
                  background: '#ffffff',
                  display: 'block',
                  borderRadius: 2,
                }}
                onMouseDown={(e) => {
                  if (e.target === e.target.getStage()) {
                    setSelectedId(null);
                    setEditingId(null);
                  }
                }}
              >
                <Layer>
                  {blocks.map(renderBlock)}
                  <Transformer
                    ref={transformerRef}
                    rotateEnabled
                    enabledAnchors={[
                      'top-left',
                      'top-right',
                      'bottom-left',
                      'bottom-right',
                      'middle-left',
                      'middle-right',
                    ]}
                    boundBoxFunc={(o, n) =>
                      n.width < 20 || n.height < 20 ? o : n
                    }
                    borderStroke='#6366f1'
                    borderStrokeWidth={1.5}
                    anchorFill='#fff'
                    anchorStroke='#6366f1'
                    anchorSize={8}
                    anchorCornerRadius={2}
                  />
                </Layer>
              </Stage>
              {editingId &&
                (() => {
                  const b = blocks.find((bl) => bl.id === editingId);
                  if (!b || b.type !== 'text') return null;
                  return (
                    <textarea
                      autoFocus
                      defaultValue={b.content}
                      onChange={(e) =>
                        update(editingId, { content: e.target.value })
                      }
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className='absolute resize-none outline-none'
                      style={{
                        left: b.x,
                        top: b.y,
                        width: Math.max(b.width, 200),
                        minHeight: Math.max(b.height, 40),
                        fontSize: b.fontSize,
                        fontFamily: b.fontFamily || 'Georgia',
                        fontWeight: b.fontStyle === 'bold' ? 'bold' : 'normal',
                        fontStyle:
                          b.fontStyle === 'italic' ? 'italic' : 'normal',
                        color: b.color || '#111',
                        textAlign: b.align || 'left',
                        lineHeight: 1.5,
                        transform: `rotate(${b.rotation || 0}deg)`,
                        transformOrigin: '0 0',
                        padding: '4px 8px',
                        boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.96)',
                        border: '2px solid #6366f1',
                        borderRadius: 4,
                        zIndex: 200,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                      }}
                    />
                  );
                })()}
            </div>
          </div>
        </main>
      </div>

      {/* ── BOTTOM ZOOM BAR ── */}
      <BottomBar
        className='sticky bottom-0'
        zoom={zoom}
        setZoom={setZoom}
        onFit={handleFit}
      />
    </section>
  );
}
