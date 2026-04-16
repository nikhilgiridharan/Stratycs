import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Stratycs",
  description: "Terms governing use of Stratycs.",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            By accessing or using Stratycs LLC’s (“Stratycs”) services, you
            agree to these Terms. If you do not agree, do not use the service.
          </p>
          <h2 className="pt-4 text-foreground">The service</h2>
          <p>
            Stratycs provides tools to build and send contractor quotes,
            including PDF generation and optional delivery channels. Features
            may change with notice where required.
          </p>
          <h2 className="pt-4 text-foreground">Your account</h2>
          <p>
            You are responsible for your account credentials,
            the accuracy of information you enter, and compliance with laws
            that apply to your business (including licensing and consumer
            communications).
          </p>
          <h2 className="pt-4 text-foreground">Fees & trial</h2>
          <p>
            Paid plans may be billed in advance. Subscription terms presented
            at checkout apply. If you use a free trial, billing may begin when
            the trial ends unless you cancel.
          </p>
          <h2 className="pt-4 text-foreground">Disclaimer</h2>
          <p>
            The service is provided “as is.” To the fullest extent permitted by
            law, Stratycs disclaims warranties and limits liability for
            indirect or consequential damages, subject to applicable law.
          </p>
          <h2 className="pt-4 text-foreground">Termination</h2>
          <p>
            You may stop using Stratycs at any time. We may suspend or terminate
            access for violations of these Terms or to protect the service.
          </p>
        </div>
      </div>
    </div>
  );
}
