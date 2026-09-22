import { createElement, useId, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, ImagePlus, Loader2 } from 'lucide-react';
import { ICONS, ICON_NAMES, TONES, iconFor } from '../data/icons';
import { uploadImage } from './images';

// Renders an edit form from a schema (see ./schemas.js). Every field is
// controlled: `value` in, `onChange(next)` out.

const blankFor = (fields) =>
  Object.fromEntries(
    fields.map((f) => {
      if (f.type === 'strings' || f.type === 'items') return [f.name, []];
      if (f.type === 'toggle') return [f.name, false];
      if (f.type === 'group') return [f.name, blankFor(f.fields)];
      if (f.type === 'number') return [f.name, 0];
      if (f.type === 'image' && f.inline) return [];
      if (f.type === 'image') return [f.name, null];
      return [f.name, ''];
    }).filter((e) => e.length),
  );

const Label = ({ htmlFor, field }) => (
  <label className="adm-label" htmlFor={htmlFor}>
    {field.label}
    {field.help && <span className="adm-help">{field.help}</span>}
  </label>
);

const TextInput = ({ field, value, onChange }) => {
  const id = useId();
  const Tag = field.type === 'textarea' ? 'textarea' : 'input';
  return (
    <div className="adm-field">
      <Label htmlFor={id} field={field} />
      <Tag
        id={id}
        className="adm-input"
        type={field.type === 'number' ? 'number' : 'text'}
        rows={field.type === 'textarea' ? 3 : undefined}
        placeholder={field.placeholder}
        value={value ?? ''}
        onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );
};

const Toggle = ({ field, value, onChange }) => {
  const id = useId();
  return (
    <div className="adm-field adm-field--toggle">
      <input id={id} type="checkbox" className="adm-switch" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
      <Label htmlFor={id} field={field} />
    </div>
  );
};

const Select = ({ field, value, onChange }) => {
  const id = useId();
  const options = field.options.includes(value) || !value ? field.options : [value, ...field.options];
  return (
    <div className="adm-field">
      <Label htmlFor={id} field={field} />
      <select id={id} className="adm-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
};

const IconPicker = ({ field, value, onChange }) => {
  return (
    <fieldset className="adm-field">
      <legend className="adm-label">{field.label}</legend>
      <div className="adm-icons">
        <span className="adm-icons__current" aria-hidden="true">{createElement(iconFor(value), { size: 22 })}</span>
        <select className="adm-input" aria-label={field.label} value={ICONS[value] ? value : ''} onChange={(e) => onChange(e.target.value)}>
          {!ICONS[value] && <option value="">Choose an icon</option>}
          {ICON_NAMES.map((n) => <option key={n} value={n}>{n.replace(/([a-z])([A-Z0-9])/g, '$1 $2')}</option>)}
        </select>
      </div>
    </fieldset>
  );
};

const TonePicker = ({ field, value, onChange }) => {
  const group = useId();
  return (
    <fieldset className="adm-field">
      <legend className="adm-label">{field.label}</legend>
      <div className="adm-tones">
        {TONES.map((t) => (
          <label key={t} className={`adm-tone tone-${t}${value === t ? ' is-on' : ''}`} title={t}>
            <input type="radio" name={group} value={t} checked={value === t} onChange={() => onChange(t)} />
            <span className="visually-hidden">{t}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

// Upload / replace a photo. `inline` fields write src/thumb/w/h straight onto
// the parent item (gallery photos); others hold an image object.
export const ImageField = ({ field, value, onChange }) => {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const src = value?.thumb || value?.src;

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const img = await uploadImage(file);
      onChange(field.inline ? img : { ...img, alt: value?.alt ?? '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-field">
      <span className="adm-label">
        {field.label}
        {field.help && <span className="adm-help">{field.help}</span>}
      </span>
      <div className="adm-image">
        {src ? <img src={src} alt="" /> : <span className="adm-image__empty">No photo yet</span>}
        <div className="adm-image__actions">
          <button type="button" className="adm-btn adm-btn--soft" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? <Loader2 size={16} className="adm-spin" aria-hidden="true" /> : <ImagePlus size={16} aria-hidden="true" />}
            {busy ? 'Uploading…' : src ? 'Replace photo' : 'Upload photo'}
          </button>
          {src && !field.inline && !field.required && (
            <button type="button" className="adm-btn adm-btn--ghost" onClick={() => onChange(null)} disabled={busy}>Remove</button>
          )}
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={pick} />
      </div>
      {error && <p className="adm-error">{error}</p>}
    </div>
  );
};

const move = (list, from, to) => {
  const next = [...list];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
};

const RowActions = ({ index, length, onMove, onRemove, label }) => (
  <span className="adm-row-actions">
    <button type="button" className="adm-icon-btn" aria-label={`Move ${label} up`} disabled={index === 0}
      onClick={(e) => { e.preventDefault(); onMove(index - 1); }}><ArrowUp size={16} /></button>
    <button type="button" className="adm-icon-btn" aria-label={`Move ${label} down`} disabled={index === length - 1}
      onClick={(e) => { e.preventDefault(); onMove(index + 1); }}><ArrowDown size={16} /></button>
    <button type="button" className="adm-icon-btn adm-icon-btn--danger" aria-label={`Remove ${label}`}
      onClick={(e) => { e.preventDefault(); if (window.confirm(`Remove “${label}”?`)) onRemove(); }}><Trash2 size={16} /></button>
  </span>
);

const StringList = ({ field, value = [], onChange }) => {
  const list = Array.isArray(value) ? value : [];
  const Tag = field.multiline ? 'textarea' : 'input';
  return (
    <fieldset className="adm-field">
      <legend className="adm-label">
        {field.label}
        {field.help && <span className="adm-help">{field.help}</span>}
      </legend>
      <ul className="adm-strings">
        {list.map((s, i) => (
          <li key={i}>
            <Tag
              className="adm-input"
              rows={field.multiline ? 4 : undefined}
              aria-label={`${field.label} ${i + 1}`}
              value={s}
              onChange={(e) => onChange(list.map((x, j) => (j === i ? e.target.value : x)))}
            />
            <RowActions index={i} length={list.length} label={s || `item ${i + 1}`}
              onMove={(to) => onChange(move(list, i, to))} onRemove={() => onChange(list.filter((_, j) => j !== i))} />
          </li>
        ))}
      </ul>
      <button type="button" className="adm-btn adm-btn--ghost" onClick={() => onChange([...list, ''])}>
        <Plus size={16} aria-hidden="true" /> Add
      </button>
    </fieldset>
  );
};

const ItemList = ({ field, value = [], onChange }) => {
  const list = Array.isArray(value) ? value : [];
  const [openIndex, setOpenIndex] = useState(null);
  const labelOf = (item, i) => (field.itemLabel && item?.[field.itemLabel]) || `${field.label} ${i + 1}`;

  return (
    <fieldset className="adm-field">
      <legend className="adm-label">
        {field.label} <span className="adm-count">{list.length}</span>
        {field.help && <span className="adm-help">{field.help}</span>}
      </legend>
      <div className="adm-items">
        {list.map((item, i) => (
          <details key={i} className="adm-item" open={openIndex === i} onToggle={(e) => e.currentTarget.open && setOpenIndex(i)}>
            <summary>
              {field.fields.some((f) => f.inline) && (item.thumb || item.src) && <img src={item.thumb || item.src} alt="" className="adm-item__thumb" />}
              <span className="adm-item__label">{labelOf(item, i)}</span>
              <RowActions index={i} length={list.length} label={labelOf(item, i)}
                onMove={(to) => { onChange(move(list, i, to)); setOpenIndex(to); }}
                onRemove={() => { onChange(list.filter((_, j) => j !== i)); setOpenIndex(null); }} />
            </summary>
            <div className="adm-item__body">
              <Fields
                fields={field.fields}
                value={item}
                onChange={(next) => onChange(list.map((x, j) => (j === i ? next : x)))}
              />
            </div>
          </details>
        ))}
      </div>
      <button
        type="button"
        className="adm-btn adm-btn--ghost"
        onClick={() => {
          onChange([...list, { ...blankFor(field.fields), ...(field.newItem ?? {}) }]);
          setOpenIndex(list.length);
        }}
      >
        <Plus size={16} aria-hidden="true" /> Add {field.label.toLowerCase().replace(/s$/, '')}
      </button>
    </fieldset>
  );
};

const Group = ({ field, value = {}, onChange }) => (
  <fieldset className="adm-field adm-group">
    <legend className="adm-label">{field.label}</legend>
    <Fields fields={field.fields} value={value ?? {}} onChange={onChange} />
  </fieldset>
);

const Field = ({ field, value, onChange, parent, onParentChange }) => {
  switch (field.type) {
    case 'toggle': return <Toggle field={field} value={value} onChange={onChange} />;
    case 'select': return <Select field={field} value={value} onChange={onChange} />;
    case 'icon': return <IconPicker field={field} value={value} onChange={onChange} />;
    case 'tone': return <TonePicker field={field} value={value} onChange={onChange} />;
    case 'image':
      return field.inline
        ? <ImageField field={field} value={parent} onChange={(img) => onParentChange({ ...parent, ...img })} />
        : <ImageField field={field} value={value} onChange={onChange} />;
    case 'strings': return <StringList field={field} value={value} onChange={onChange} />;
    case 'items': return <ItemList field={field} value={value} onChange={onChange} />;
    case 'group': return <Group field={field} value={value} onChange={onChange} />;
    default: return <TextInput field={field} value={value} onChange={onChange} />;
  }
};

export const Fields = ({ fields, value, onChange }) =>
  fields.map((f) => (
    <Field
      key={f.name}
      field={f}
      value={value?.[f.name]}
      onChange={(v) => onChange({ ...value, [f.name]: v })}
      parent={value}
      onParentChange={onChange}
    />
  ));
