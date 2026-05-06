import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <h3 className="display-heading text-2xl text-foreground mb-4">Thank you.</h3>
        <p className="text-muted-foreground">We'll review your information and get back to you within 48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        placeholder="Full name"
        required
        maxLength={100}
        className="underline-input w-full"
      />
      <input
        type="email"
        placeholder="Email"
        required
        maxLength={255}
        className="underline-input w-full"
      />
      <input
        type="tel"
        placeholder="Phone (optional)"
        maxLength={20}
        className="underline-input w-full"
      />
      <input
        type="text"
        placeholder="Property address"
        required
        maxLength={200}
        className="underline-input w-full"
      />
      <input
        type="text"
        placeholder="Town"
        required
        maxLength={100}
        className="underline-input w-full"
      />
      <textarea
        placeholder="Anything we should know? (optional)"
        maxLength={1000}
        rows={3}
        className="underline-input w-full resize-none"
      />
      <button
        type="submit"
        className="w-full mono-label bg-primary text-primary-foreground py-4 hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        Submit
      </button>
      <p className="mono-label text-muted-foreground/50 text-center">
        REVIEWED PERSONALLY · NO AUTOMATED RESPONSES
      </p>
    </form>
  );
}
