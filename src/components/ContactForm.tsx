import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-16">
        <h3 className="display-heading text-2xl mb-4" style={{ color: "hsl(var(--dark-fg))" }}>Thank you.</h3>
        <p style={{ color: "hsl(var(--dark-muted))" }}>We'll review your information and get back to you within 48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="text" placeholder="Full name" required maxLength={100} className="underline-input w-full" />
      <input type="email" placeholder="Email" required maxLength={255} className="underline-input w-full" />
      <input type="tel" placeholder="Phone (optional)" maxLength={20} className="underline-input w-full" />
      <input type="text" placeholder="Property address" required maxLength={200} className="underline-input w-full" />
      <input type="text" placeholder="Town" required maxLength={100} className="underline-input w-full" />
      <textarea placeholder="Anything we should know? (optional)" maxLength={1000} rows={3} className="underline-input w-full resize-none" />
      <button
        type="submit"
        className="w-full py-4 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          background: "hsl(var(--dark-fg))",
          color: "hsl(var(--dark-bg))",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 500,
          fontSize: "16px",
        }}
      >
        Send →
      </button>
      <p className="small-label text-center" style={{ color: "hsl(var(--dark-muted))" }}>
        REVIEWED PERSONALLY · NO AUTOMATED RESPONSES
      </p>
    </form>
  );
}
