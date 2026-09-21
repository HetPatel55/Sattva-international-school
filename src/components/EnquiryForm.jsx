import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { school } from '../data/site';

const STANDARDS = [
  'JrKG', 'SrKG', 'Balvatika',
  'Std 1', 'Std 2', 'Std 3', 'Std 4', 'Std 5', 'Std 6', 'Std 7', 'Std 8',
  'Std 9', 'Std 10',
  'Std 11 – Science', 'Std 11 – Commerce',
  'Std 12 – Science', 'Std 12 – Commerce',
];

const SUBJECTS = ['Admission enquiry', 'Campus visit', 'School transport', 'Fees', 'Other'];

const EMPTY = { name: '', phone: '', email: '', child: '', standard: '', medium: '', subject: '', message: '' };

const validators = {
  name: (v) => (!v.trim() ? 'Please enter your name.' : /^[A-Za-z][A-Za-z .'-]*$/.test(v.trim()) ? '' : 'Please use letters only.'),
  phone: (v) => (!v ? 'Please enter your mobile number.' : /^[6-9]\d{9}$/.test(v) ? '' : 'Enter a valid 10-digit mobile number.'),
  email: (v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.'),
  standard: (v) => (v ? '' : 'Please choose a standard.'),
  subject: (v) => (v ? '' : 'Please choose a topic.'),
  message: (v) => (v.trim() ? '' : 'Please write a short message.'),
};

/**
 * variant="admission" asks about the child; variant="general" is a plain contact form.
 */
const EnquiryForm = ({ variant = 'admission' }) => {
  const isAdmission = variant === 'admission';
  const required = isAdmission ? ['name', 'phone', 'standard'] : ['name', 'phone', 'subject', 'message'];
  const validated = [...required, 'email'];

  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed

  const check = (field, value) => {
    if (!validators[field]) return '';
    if (!required.includes(field) && !value) return '';
    return validators[field](value);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    const next = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setData((d) => ({ ...d, [name]: next }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: check(name, next) }));
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    setErrors((er) => ({ ...er, [name]: check(name, value) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = Object.fromEntries(validated.map((f) => [f, check(f, data[f])]));
    setErrors(found);
    const firstBad = validated.find((f) => found[f]);
    if (firstBad) {
      document.getElementById(`${variant}-${firstBad}`)?.focus();
      return;
    }

    setStatus('sending');
    const payload = isAdmission
      ? {
          _subject: `Admission enquiry – ${data.standard} – ${data.name}`,
          'Parent / guardian name': data.name,
          'Mobile number': data.phone,
          Email: data.email || '—',
          "Child's name": data.child || '—',
          'Standard applying for': data.standard,
          'Preferred medium': data.medium || '—',
          Message: data.message || '—',
        }
      : {
          _subject: `Website enquiry – ${data.subject} – ${data.name}`,
          Name: data.name,
          'Mobile number': data.phone,
          Email: data.email || '—',
          Topic: data.subject,
          Message: data.message,
        };

    try {
      const res = await fetch(school.enquiryEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, _template: 'table', _captcha: 'false' }),
      });
      const json = await res.json().catch(() => ({}));
      setStatus(res.ok && String(json.success) === 'true' ? 'sent' : 'failed');
    } catch {
      setStatus('failed');
    }
  };

  if (status === 'sent') {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={48} aria-hidden="true" />
        <h3>Thank you — we have received your enquiry.</h3>
        <p>Our team will call you on {data.phone} within one or two working days.</p>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => {
            setData(EMPTY);
            setErrors({});
            setStatus('idle');
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const field = (name, label, input, hint) => (
    <div className={`field${errors[name] ? ' field--error' : ''}`}>
      <label htmlFor={`${variant}-${name}`}>
        {label}
        {required.includes(name) ? <span aria-hidden="true"> *</span> : <span className="field__optional"> (optional)</span>}
      </label>
      {input}
      {hint && !errors[name] && <p className="field__hint">{hint}</p>}
      {errors[name] && (
        <p className="field__error" id={`${variant}-${name}-error`}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  const inputProps = (name) => ({
    id: `${variant}-${name}`,
    name,
    value: data[name],
    onChange,
    onBlur,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${variant}-${name}-error` : undefined,
  });

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        {field('name', isAdmission ? 'Parent / guardian name' : 'Your name',
          <input type="text" autoComplete="name" {...inputProps('name')} />)}
        {field('phone', 'Mobile number',
          <input type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} {...inputProps('phone')} />,
          '10-digit mobile number')}
      </div>

      {field('email', 'Email', <input type="email" autoComplete="email" {...inputProps('email')} />)}

      {isAdmission ? (
        <>
          {field('child', "Child's name", <input type="text" autoComplete="off" {...inputProps('child')} />)}
          <div className="form__row">
            {field('standard', 'Standard',
              <select {...inputProps('standard')}>
                <option value="">Select a standard</option>
                {STANDARDS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>)}
            {field('medium', 'Medium',
              <select {...inputProps('medium')}>
                <option value="">Select a medium</option>
                {school.mediums.map((m) => <option key={m} value={m}>{m} medium</option>)}
              </select>)}
          </div>
        </>
      ) : (
        field('subject', 'Topic',
          <select {...inputProps('subject')}>
            <option value="">Select a topic</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>)
      )}

      {field('message', isAdmission ? 'Anything you would like to ask?' : 'Message',
        <textarea rows={4} {...inputProps('message')} />)}

      {status === 'failed' && (
        <p className="form__alert" role="alert">
          Sorry, your enquiry could not be sent. Please try again, or call us on {school.phones[0].display}.
        </p>
      )}

      <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : <>Send enquiry <Send size={18} aria-hidden="true" /></>}
      </button>
      <p className="form__note">We use your details only to reply to this enquiry.</p>
    </form>
  );
};

export default EnquiryForm;
