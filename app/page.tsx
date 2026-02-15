"use client";

import { useMemo, useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string; // honeypot
};

export default function Home() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const jsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "طراحی لباس سینما و تئاتر",
      description:
        "خدمات طراحی لباس سینما و تئاتر: کانسپت، طراحی کاراکتر، انتخاب پارچه و متریال، دوخت و اجرا.",
      areaServed: "IR",
      inLanguage: "fa"
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const res = await fetch(`${base}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", message: "", website: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="sticky top-0 z-10 -mx-4 mb-10 border-b bg-white/10 px-4 py-4 backdrop-blur">
        <nav className="flex items-center justify-between gap-4">
          <a href="#top" className="font-bold">
            طراحی لباس سینما و تئاتر
          </a>
          <div className="flex gap-4 text-sm">
            <a className="hover:underline" href="#contact">تماس با من</a>
            <a className="hover:underline" href="#about">درباره من</a>
            <a className="hover:underline" href="#portfolio">نمونه‌کارها</a>
          </div>
        </nav>
      </header>

      <section id="top" className="mb-14">
        <h1 className="mb-4 text-3xl font-extrabold leading-snug">
          طراحی لباس سینما و تئاتر با تمرکز بر روایت، کاراکتر و هویت بصری
        </h1>
        <p className="max-w-3xl text-base leading-8 text-neutral-700">
          اگر برای فیلم، سریال یا نمایش به طراح لباس نیاز دارید، این صفحه برای معرفی خدمات
          طراحی لباس صحنه، روند کاری و نمونه‌کارها آماده شده است. هدف من ارائه طراحی دقیق،
          قابل اجرا و هماهنگ با جهان اثر است.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#contact" className="rounded-xl bg-black px-4 py-2 text-white">
            ثبت درخواست طراحی
          </a>
          <a href="#portfolio" className="rounded-xl border px-4 py-2">
            مشاهده نمونه‌کارها
          </a>
        </div>
      </section>

      <section id="about" className="mb-14 scroll-mt-24">
        <h2 className="mb-3 text-2xl font-bold">درباره من</h2>
        <p className="max-w-3xl leading-8 text-neutral-700">
          در طراحی لباس سینما و تئاتر، از پژوهش دوره‌ای و تحلیل فیلمنامه تا طراحی کانسپت و انتخاب
          متریال پیش می‌روم. خروجی نهایی باید هم از نظر زیبایی‌شناسی درست باشد و هم در اجرا، نور،
          حرکت بازیگر و نیازهای تولید پاسخگو باشد.
        </p>

        <ul className="mt-5 list-disc space-y-2 pr-5 text-neutral-700">
          <li>طراحی کانسپت کاراکتر و پالت رنگ</li>
          <li>هماهنگی با کارگردان، طراح صحنه و مدیر فیلمبرداری</li>
          <li>انتخاب پارچه/متریال و آماده‌سازی برای دوخت و اجرا</li>
        </ul>
      </section>

      <section id="portfolio" className="mb-14 scroll-mt-24">
        <h2 className="mb-3 text-2xl font-bold">نمونه‌کارها</h2>
        <p className="max-w-3xl leading-8 text-neutral-700">
          اینجا ۳ پروژه نمونه قرار می‌گیرد. بعداً می‌توانید تصویر، توضیحات و نقش شما در پروژه را اضافه کنید.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["پروژه ۱", "پروژه ۲", "پروژه ۳"].map((t) => (
            <article key={t} className="rounded-2xl border p-4 shadow-sm">
              <h3 className="mb-2 font-semibold">{t}</h3>
              <p className="text-sm leading-7 text-neutral-700">
                توضیح کوتاه درباره طراحی لباس، دوره زمانی، سبک بصری و چالش‌های اجرا.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="scroll-mt-24">
        <h2 className="mb-3 text-2xl font-bold">تماس با من</h2>
        <p className="mb-6 max-w-3xl leading-8 text-neutral-700">
          برای سفارش طراحی لباس سینما و تئاتر، اطلاعات پروژه را ارسال کنید. (ایمیل و شماره تماس اختیاری/ضروری مطابق نیاز شما قابل تغییر است.)
        </p>

        <form onSubmit={submit} className="max-w-xl space-y-4 rounded-2xl border p-5 shadow-sm">
          {/* honeypot */}
          <input
            value={form.website}
            onChange={(e) => setForm((s) => ({ ...s, website: e.target.value }))}
            className="hidden"
            autoComplete="off"
            tabIndex={-1}
          />

          <input
            required
            placeholder="نام و نام خانوادگی"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className="w-full rounded-xl border px-3 py-2"
          />
          <input
            required
            type="email"
            placeholder="ایمیل"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            className="w-full rounded-xl border px-3 py-2"
          />
          <input
            placeholder="شماره تماس (اختیاری)"
            value={form.phone}
            onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
            className="w-full rounded-xl border px-3 py-2"
          />
          <textarea
            required
            placeholder="توضیح پروژه (ژانر، زمان‌بندی، تعداد کاراکتر، سبک...)"
            value={form.message}
            onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
            className="h-32 w-full rounded-xl border px-3 py-2"
          />

          <button
            disabled={status === "sending"}
            className="w-full rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {status === "sending" ? "در حال ارسال..." : "ارسال درخواست"}
          </button>

          {status === "ok" && (
            <p className="text-sm text-green-700">درخواست شما ثبت شد.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-700">ارسال ناموفق بود. دوباره تلاش کنید.</p>
          )}
        </form>
      </section>

      <footer className="mt-14 border-t pt-6 text-sm text-neutral-600">
        <p>© {new Date().getFullYear()} — طراحی لباس سینما و تئاتر</p>
      </footer>
    </main>
  );
}
