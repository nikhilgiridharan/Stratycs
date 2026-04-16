import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Stratycs",
  description: "How Stratycs handles your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-primary hover:underline"
        >
          ← Back home
        </Link>
        <h1 className="mb-6 font-display text-3xl text-foreground">
          Privacy Policy
        </h1>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Stratycs LLC (“Stratycs,” “we,” “us”) respects your privacy. This
            policy describes how we collect, use, and protect information when
            you use our website and services.
          </p>
          <h2 className="pt-4 text-foreground">Information we collect</h2>
          <p>
            Account details you provide (such as name, email, and business
            information), quote and customer data you enter, usage logs, and
            communications you send to us.
          </p>
          <h2 className="pt-4 text-foreground">How we use information</h2>
          <p>
            To operate the service, provide quotes and PDFs, send messages
            through your chosen channels (SMS/email), process subscriptions,
            improve reliability and security, and comply with law.
          </p>
          <h2 className="pt-4 text-foreground">Sharing</h2>
          <p>
            We use service providers (for example hosting, database, auth,
            messaging, payments) under agreements that require appropriate
            safeguards. We do not sell your personal information.
          </p>
          <h2 className="pt-4 text-foreground">Security</h2>
          <p>
            We use industry-standard measures to protect data. No method of
            transmission or storage is guaranteed to be 100% secure.
          </p>
          <h2 className="pt-4 text-foreground">Contact</h2>
          <p>
            Questions about this policy? Contact us at the email listed on
            your Stratycs account or billing correspondence.
          </p>
        </div>
      </div>
    </div>
  );
}
