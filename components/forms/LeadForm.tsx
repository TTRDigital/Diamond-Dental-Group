"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ATTRIBUTION_STORAGE_KEY, attributionKeys } from "@/lib/lead-options";

type Field = "full_name" | "email" | "phone" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field | "consent", string>>;

/* Client checks; public/api/lead.php checks the same on the server: keep them in sync. */
const validators: Record<Field, (v: string) => string | undefined> = {
  full_name: (v) => (v.trim().length < 2 ? "Please enter your full name." : undefined),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? undefined : "Please enter a valid email address."),
  phone: (v) =>
    !/^[0-9()#&+*\-=. ]+$/.test(v.trim()) ? "Please use numbers and phone characters only." : v.replace(/\D/g, "").length < 10 ? "Please enter a phone number with area code." : undefined,
  message: (v) => (v.length > 3000 ? "Please keep your message under 3,000 characters." : undefined),
};

const LABELS: Record<Field, string> = { full_name: "Full Name", email: "Email Address", phone: "Phone Number", message: "Message" };
const empty: Values = { full_name: "", email: "", phone: "", message: "" };
const required: Field[] = ["full_name", "email", "phone"];

/**
 * Contact form (Full Name, Email Address, Phone Number, Message + consent),
 * posted to /api/lead.php, which forwards it to GoHighLevel. Spam is filtered
 * with a hidden field and a timing check. On success: /thank-you/.
 */
export function LeadForm({ buttonLabel, businessName, phone, phoneHref }: { buttonLabel: string; businessName: string; phone: string; phoneHref: string }) {
  const router = useRouter();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);
  const [values, setValues] = useState<Values>(empty);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const setField = (f: Field, v: string) => {
    setValues((s) => ({ ...s, [f]: v }));
    if (touched[f]) setErrors((e) => ({ ...e, [f]: validators[f](v) }));
  };
  const blur = (f: Field) => {
    setTouched((t) => ({ ...t, [f]: true }));
    setErrors((e) => ({ ...e, [f]: validators[f](values[f]) }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const next: Errors = {};
    for (const f of Object.keys(validators) as Field[]) {
      const msg = validators[f](values[f]);
      if (msg) next[f] = msg;
    }
    if (!consent) next.consent = "Please agree so we can contact you.";
    setErrors(next);
    setTouched({ full_name: true, email: true, phone: true, message: true });
    const bad = (Object.keys(next) as (Field | "consent")[]).filter((k) => next[k]);
    if (bad.length) {
      setSummary(`Please fix ${bad.length === 1 ? "1 field" : `${bad.length} fields`} below.`);
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${uid}-${bad[0]}`)}`)?.focus();
      return;
    }
    setSummary("");
    setStatus("sending");

    let attribution: Record<string, string> = {};
    try {
      attribution = JSON.parse(sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? "{}");
    } catch {
      /* storage unavailable */
    }
    const honeypot = (formRef.current?.elements.namedItem("website_url") as HTMLInputElement | null)?.value ?? "";

    try {
      const res = await fetch("/api/lead.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          consent: true,
          website_url: honeypot,
          elapsed_ms: Date.now() - startedAt.current,
          page_url: window.location.href,
          landing_page: attribution.landing_page ?? "",
          referrer: attribution.referrer ?? document.referrer,
          ...Object.fromEntries(attributionKeys.map((k) => [k, attribution[k] ?? ""])),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const w = window as unknown as { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
      w.gtag?.("event", "generate_lead", { form: "contact" });
      w.dataLayer?.push({ event: "generate_lead", form: "contact" });
      router.push("/thank-you/");
    } catch {
      setStatus("error");
    }
  };

  const inputCls = (f: Field) =>
    `block w-full rounded-xl border bg-white px-4 text-base text-black outline-none transition-[border-color,box-shadow] focus:border-secondary focus:shadow-[0_0_0_3px_rgba(229,184,51,0.35)] ${
      errors[f] ? "border-red-500" : "border-gray-200"
    } ${f === "message" ? "min-h-[140px] py-3" : "h-12 py-2"}`;

  const err = (f: Field | "consent") =>
    errors[f] ? (
      <p id={`${uid}-${f}-err`} className="mt-1.5 text-sm text-red-600">
        {errors[f]}
      </p>
    ) : null;

  const aria = (f: Field) => ({
    id: `${uid}-${f}`,
    name: f,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `${uid}-${f}-err` : undefined,
    "aria-required": required.includes(f) || undefined,
    onBlur: () => blur(f),
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Send us a message" className="relative">
      <p role="alert" aria-live="assertive" className={summary ? "mb-4 text-sm font-semibold text-red-600" : "sr-only"}>
        {summary}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(["full_name", "email", "phone"] as const).map((f) => (
          <div key={f} className={f === "full_name" ? "sm:col-span-2" : undefined}>
            <label htmlFor={`${uid}-${f}`} className="mb-2 block text-sm font-bold text-black">
              {LABELS[f]} <span aria-hidden="true" className="text-secondary">*</span>
              <span className="sr-only"> (required)</span>
            </label>
            <input
              {...aria(f)}
              type={f === "email" ? "email" : f === "phone" ? "tel" : "text"}
              autoComplete={f === "full_name" ? "name" : f === "email" ? "email" : "tel"}
              inputMode={f === "phone" ? "tel" : f === "email" ? "email" : undefined}
              value={values[f]}
              onChange={(e) => setField(f, e.target.value)}
              className={inputCls(f)}
            />
            {err(f)}
          </div>
        ))}
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-message`} className="mb-2 block text-sm font-bold text-black">
            {LABELS.message}
          </label>
          <textarea {...aria("message")} rows={4} value={values.message} onChange={(e) => setField("message", e.target.value)} className={inputCls("message")} />
          {err("message")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-consent`} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-gray-600">
            <input
              id={`${uid}-consent`}
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (e.target.checked) setErrors((er) => ({ ...er, consent: undefined }));
              }}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#e6b933]"
            />
            <span>
              I agree to be contacted by {businessName} by phone, text or email about my request. Message and data rates may apply. Reply STOP to opt out. See our{" "}
              <a href="/privacy-policy/" className="text-secondary underline underline-offset-2">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {err("consent")}
        </div>
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website_url`}>Leave this field empty</label>
        <input id={`${uid}-website_url`} name="website_url" type="text" tabIndex={-1} autoComplete="off" data-1p-ignore data-lpignore="true" />
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-4 text-sm text-red-600">
          Something went wrong sending your message. Please try again, or call us at{" "}
          <a href={phoneHref} className="font-semibold underline">
            {phone}
          </a>
          .
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-secondary hover:bg-gold-hover text-black font-bold px-10 h-14 text-lg shadow-[0_4px_14px_rgba(229,184,51,0.4)] transition-colors disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : buttonLabel}
      </button>
    </form>
  );
}

