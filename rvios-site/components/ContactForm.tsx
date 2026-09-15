"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api/client";
import { SERVICES, type ServiceSlug } from "@/lib/services";

type ServiceType = ServiceSlug | "other";

interface FormState {
  name:        string;
  email:       string;
  phone:       string;
  serviceType: ServiceType | "";
  message:     string;
}

const SERVICE_OPTIONS: { value: ServiceType; ar: string; en: string }[] = [
  ...SERVICES.map((s) => ({ value: s.slug, ar: s.nameAr, en: s.nameEn })),
  { value: "other", ar: "أخرى", en: "Other" },
];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", serviceType: "", message: "",
  });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildWhatsAppMessage = () => {
    const svc = SERVICE_OPTIONS.find((o) => o.value === form.serviceType);
    return encodeURIComponent(
      `مرحباً RVIOS 👋\n\n` +
      `الاسم: ${form.name}\n` +
      `البريد: ${form.email}\n` +
      (form.phone ? `الهاتف: ${form.phone}\n` : "") +
      `الخدمة: ${svc ? svc.ar : ""}\n\n` +
      `التفاصيل:\n${form.message}`
    );
  };

  /**
   * يسجّل الطلب في قاعدة البيانات قبل تسليم المستخدم إلى واتساب أو البريد.
   *
   * النسخة السابقة كانت تُطلق الحفظ بـ `.catch(() => {})` بلا انتظار في مسار
   * واتساب، ولا تحفظ إطلاقاً في مسار البريد — فكل طلب يفشل حفظه يختفي بصمت،
   * ولا يظهر في صندوق الرسائل بلوحة التحكم.
   */
  const persist = async (): Promise<boolean> => {
    const svc = SERVICE_OPTIONS.find((o) => o.value === form.serviceType);
    try {
      await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: svc?.ar,
        message: form.message,
      });
      return true;
    } catch (e) {
      setError(
        e instanceof Error && e.message.includes("429")
          ? "أرسلت طلبات كثيرة. انتظر قليلاً ثم حاول."
          : "تعذّر حفظ الطلب. سنفتح لك القناة المباشرة الآن — أو حاول مجدداً.",
      );
      return false;
    }
  };

  const handleWhatsApp = async () => {
    if (!form.name || !form.message || busy) return;
    setBusy(true);
    setError(null);
    const saved = await persist();
    setBusy(false);

    /* نفتح القناة في الحالتين: فشل الحفظ لا يجوز أن يحجب العميل عنّا،
       لكنه يظهر له بدل أن يُبتلع. */
    window.open(`https://wa.me/967739008083?text=${buildWhatsAppMessage()}`, "_blank");
    if (saved) setSent(true);
  };

  const handleEmail = async () => {
    if (!form.name || !form.message || busy) return;
    setBusy(true);
    setError(null);
    const saved = await persist();
    setBusy(false);

    const svc = SERVICE_OPTIONS.find((o) => o.value === form.serviceType);
    const subject = encodeURIComponent(`طلب خدمة — ${svc?.ar ?? "استفسار"} | ${form.name}`);
    const body = encodeURIComponent(
      `الاسم: ${form.name}\nالبريد: ${form.email}\n${form.phone ? `الهاتف: ${form.phone}\n` : ""}الخدمة: ${svc?.ar ?? ""}\n\n${form.message}`
    );
    window.location.href = `mailto:info@rvios.com?subject=${subject}&body=${body}`;
    if (saved) setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl bg-white border border-black/7 shadow-card">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-subhead text-2xl text-ink mb-2">تم الإرسال بنجاح!</h3>
        <p className="font-body text-sm text-ink-muted mb-1">Message sent successfully</p>
        <p className="font-subhead text-sm text-ink-muted mt-3 max-w-xs">
          سيتواصل معك فريقنا في أقرب وقت ممكن. شكراً لاهتمامك بـ RVIOS!
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 font-subhead text-sm text-primary hover:underline"
        >
          إرسال رسالة أخرى — Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="rounded-2xl bg-white border border-black/7 shadow-card p-8 space-y-5"
      noValidate
    >
      {/* Name */}
      <div>
        <label htmlFor="name" className="block font-subhead text-xs uppercase text-ink-muted mb-1.5">
          الاسم الكامل — Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="اكتب اسمك..."
          className="form-input"
          required
        />
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block font-subhead text-xs uppercase text-ink-muted mb-1.5">
            البريد الإلكتروني — Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block font-subhead text-xs uppercase text-ink-muted mb-1.5">
            الهاتف — Phone (اختياري)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+966 5x xxx xxxx"
            className="form-input"
          />
        </div>
      </div>

      {/* Service Type */}
      <div>
        <label htmlFor="serviceType" className="block font-subhead text-xs uppercase text-ink-muted mb-1.5">
          نوع الخدمة — Service Type
        </label>
        <select
          id="serviceType"
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
          className="form-input appearance-none cursor-pointer"
        >
          <option value="">اختر الخدمة...</option>
          {SERVICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.ar} — {o.en}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block font-subhead text-xs uppercase text-ink-muted mb-1.5">
          تفاصيل المشروع — Project Details
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="اكتب تفاصيل مشروعك أو استفسارك..."
          className="form-input resize-none"
          required
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 font-subhead text-sm text-primary"
        >
          {error}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={!form.name || !form.message || busy}
          className="flex-1 flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full py-3.5 font-subhead text-sm font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {busy ? "جارٍ الحفظ..." : "تواصل عبر واتساب"}
        </button>

        <button
          type="button"
          onClick={handleEmail}
          disabled={!form.name || !form.message || busy}
          className="flex-1 flex items-center justify-center gap-2.5 btn-primary py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          {busy ? "جارٍ الحفظ..." : "إرسال بالبريد"}
        </button>
      </div>

      <p className="font-subhead text-xs text-ink-faint text-center">
        سيتم التواصل معك خلال 24 ساعة من تلقّي رسالتك.
        <br />
        <span className="tracking-wider">We respond within 24 hours.</span>
      </p>
    </form>
  );
}
