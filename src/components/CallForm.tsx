import { useEffect, useState } from 'react';
import { api, extractError } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import Spinner from './ui/Spinner';
import { CALL_TYPES, CALL_TYPE_LABELS, PREREQUISITES } from '../lib/constants';
import type { Call, Category } from '../types';

interface CallFormProps {
  initial?: Call | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Create / edit form for an opportunity. Sends multipart so the image uploads.
export default function CallForm({ initial, onSuccess, onCancel }: CallFormProps) {
  const { t, lang } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCats, setSelectedCats] = useState<number[]>(initial?.categories?.map((c) => c.id) ?? []);
  const [prereqs, setPrereqs] = useState<string[]>(initial?.prerequisites ?? ['none']);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.image ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toInputDate = (v: string | null | undefined) => (v ? v.slice(0, 16) : '');

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    subtitle: initial?.subtitle ?? '',
    description: initial?.description ?? '',
    type: initial?.type ?? 'seminar',
    application_deadline: toInputDate(initial?.application_deadline),
    start_date: toInputDate(initial?.start_date),
    end_date: toInputDate(initial?.end_date),
    location: initial?.location ?? '',
    is_online: initial?.is_online ?? false,
    max_participants: initial?.max_participants ? String(initial.max_participants) : '',
    price: initial?.price ? String(initial.price) : '0',
    status: initial?.status ?? 'active',
  });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => {});
  }, []);

  const set = (key: string, value: unknown) => setForm((p) => ({ ...p, [key]: value }));

  const toggleCat = (id: number) =>
    setSelectedCats((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const togglePrereq = (value: string) =>
    setPrereqs((p) => (p.includes(value) ? p.filter((x) => x !== value) : [...p, value]));

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('subtitle', form.subtitle ?? '');
    fd.append('description', form.description);
    fd.append('type', form.type);
    fd.append('application_deadline', form.application_deadline);
    if (form.start_date) fd.append('start_date', form.start_date);
    if (form.end_date) fd.append('end_date', form.end_date);
    fd.append('location', form.is_online ? 'Online' : form.location ?? '');
    fd.append('is_online', form.is_online ? '1' : '0');
    if (form.max_participants) fd.append('max_participants', form.max_participants);
    fd.append('price', form.price || '0');
    fd.append('status', form.status);
    selectedCats.forEach((id) => fd.append('categories[]', String(id)));
    prereqs.forEach((p) => fd.append('prerequisites[]', p));
    if (imageFile) fd.append('image', imageFile);

    try {
      // POST is used for both create and update (Laravel route accepts multipart POST).
      const url = initial ? `/calls/${initial.id}` : '/calls';
      await api.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onSuccess();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <div>
        <label className="label">Title *</label>
        <input className="input" maxLength={100} required value={form.title} onChange={(e) => set('title', e.target.value)} />
      </div>
      <div>
        <label className="label">Subtitle</label>
        <input className="input" maxLength={150} value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
      </div>
      <div>
        <label className="label">Description *</label>
        <textarea className="input" rows={5} required value={form.description} onChange={(e) => set('description', e.target.value)} />
        <p className="mt-1 text-xs text-gray-400">Basic HTML is supported.</p>
      </div>

      {/* Image drag & drop */}
      <div>
        <label className="label">Image (max 5MB)</label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 transition hover:border-brand-400 dark:border-gray-600">
          {preview ? (
            <img src={preview} alt="preview" className="mb-2 h-32 rounded-lg object-cover" />
          ) : (
            <span>Drag & drop or click to upload</span>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">{t('browse.type')} *</label>
          <select className="input" value={form.type} onChange={(e) => set('type', e.target.value)}>
            {CALL_TYPES.map((ct) => (
              <option key={ct} value={ct}>
                {CALL_TYPE_LABELS[ct][lang]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option value="active">active</option>
            <option value="finished">finished</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
        <div>
          <label className="label">{t('common.deadline')} *</label>
          <input type="datetime-local" className="input" required value={form.application_deadline} onChange={(e) => set('application_deadline', e.target.value)} />
        </div>
        <div>
          <label className="label">Price (€)</label>
          <input type="number" min="0" step="0.01" className="input" value={form.price} onChange={(e) => set('price', e.target.value)} />
        </div>
        <div>
          <label className="label">Start date</label>
          <input type="datetime-local" className="input" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} />
        </div>
        <div>
          <label className="label">End date</label>
          <input type="datetime-local" className="input" value={form.end_date} onChange={(e) => set('end_date', e.target.value)} />
        </div>
        <div>
          <label className="label">Max participants</label>
          <input type="number" min="1" className="input" value={form.max_participants} onChange={(e) => set('max_participants', e.target.value)} />
        </div>
        <div className="flex items-end gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_online} onChange={(e) => set('is_online', e.target.checked)} />
            {t('common.online')}
          </label>
        </div>
      </div>

      {!form.is_online && (
        <div>
          <label className="label">{t('browse.location')}</label>
          <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} />
        </div>
      )}

      <div>
        <label className="label">{t('browse.category')} *</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = selectedCats.includes(c.id);
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => toggleCat(c.id)}
                className={`chip border transition ${
                  active ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="label">{t('detail.prerequisites')}</label>
        <div className="flex flex-wrap gap-3">
          {PREREQUISITES.map((p) => (
            <label key={p.value} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={prereqs.includes(p.value)} onChange={() => togglePrereq(p.value)} />
              {p[lang]}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t('common.cancel')}
        </button>
        <button type="submit" className="btn-primary" disabled={saving || selectedCats.length === 0}>
          {saving ? <Spinner className="h-4 w-4 text-white" /> : t('common.submit')}
        </button>
      </div>
    </form>
  );
}
