'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'error'>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    website: '',
  });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE;
      if (!base) throw new Error('NEXT_PUBLIC_API_BASE is not set');

      const res = await fetch(`${base}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text);

      setStatus('ok');
      setForm({ name: '', email: '', phone: '', message: '', website: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4 rounded-2xl border p-5 shadow-sm">
      <input
        value={form.website}
        onChange={(e) => setForm((s) => ({ ...s, website: e.target.value }))}
        className="hidden"
        autoComplete="off"
        tabIndex={-1}
      />

      <input required placeholder="نام و نام خانوادگی"
        value={form.name}
        onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
        className="w-full rounded-xl border px-3 py-2"
      />

      <input required type="email" placeholder="ایمیل"
        value={form.email}
        onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
        className="w-full rounded-xl border px-3 py-2"
      />

      <input placeholder="شماره تماس (اختیاری)"
        value={form.phone}
        onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
        className="w-full rounded-xl border px-3 py-2"
      />

      <textarea required placeholder="توضیح پروژه..."
        value={form.message}
        onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
        className="h-32 w-full rounded-xl border px-3 py-2"
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {status === 'sending' ? 'در حال ارسال...' : 'ارسال درخواست'}
      </button>

      {status === 'ok' && <p className="text-sm text-green-700">درخواست شما ثبت شد.</p>}
      {status === 'error' && <p className="text-sm text-red-700">ارسال ناموفق بود. دوباره تلاش کنید.</p>}
    </form>
  );
}