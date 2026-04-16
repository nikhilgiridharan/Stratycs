import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-[hsl(14,24%,28%)] bg-navbar pt-3 pb-5 pl-1 pr-6 sm:pt-4 sm:pb-6 sm:pl-2 sm:pr-12">
        <nav className="flex w-full max-w-6xl items-center justify-between gap-4 text-[14px] tracking-[0.02em]">
          <Link
            href="/"
            className="min-w-0 bg-transparent text-foreground"
          >
            <Image
              src="/stratycs-logo.png"
              alt="Stratycs"
              width={300}
              height={99}
              className="h-20 w-auto sm:h-28 md:h-32"
              priority
              unoptimized
            />
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-[4px] bg-[#00D4B4] px-6 py-2.5 text-[15px] font-medium leading-none text-[#1C0E09] shadow-none transition-colors hover:bg-[#00B89C]"
          >
            Log in
          </Link>
        </nav>
      </header>

      <main>
        <section className="px-6 pt-[120px] pb-[100px] sm:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="border-l-2 border-[#00D4B4] bg-background pl-8 pr-4 pt-2 pb-4 text-left sm:pl-12 sm:pr-8 lg:pl-20 lg:pr-12">
              <h1 className="mb-6 max-w-4xl text-foreground">
                Quote Fast. Win More.
              </h1>
              <p className="mb-10 max-w-[520px] font-light text-[#A89880]">
                Stratycs builds simple software tools for tradespeople. Our
                quoting tool lets contractors generate a professional, branded
                estimate in 60 seconds — straight from their phone.
              </p>
              <div>
                <Link
                  href="/signup"
                  className="inline-flex min-h-[48px] min-w-[min(100%,280px)] items-center justify-center rounded-[4px] bg-[#00D4B4] px-8 py-3.5 text-center text-[15px] font-medium leading-none text-[#1C0E09] shadow-none transition-colors hover:bg-[#00B89C]"
                >
                  Start free — $10/mo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-[#3D2218] bg-background px-6 py-[100px] sm:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-foreground">
              How it works
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Choose your trade",
                  body: "Select from plumbing, electrical, HVAC.",
                },
                {
                  n: "02",
                  title: "Pick your line items",
                  body: "Pre-loaded parts and labor.",
                },
                {
                  n: "03",
                  title: "Send the quote",
                  body: "PDF via text or email instantly.",
                },
              ].map((step) => (
                <article
                  key={step.n}
                  className="rounded-md border border-[#3D2218] bg-background p-8 shadow-none"
                >
                  <p className="mb-4 font-display text-3xl font-normal text-primary">
                    {step.n}
                  </p>
                  <h3 className="mb-3 text-lg font-normal text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="border-t border-[#3D2218] px-6 py-[100px] sm:px-12"
        >
          <div className="mx-auto max-w-lg">
            <h2 className="mb-10 text-center text-foreground">
              Pricing
            </h2>
            <div className="rounded-md border border-[#3D2218] bg-background p-10 text-center shadow-none">
              <p className="mb-2 text-lg text-muted-foreground">
                <span className="text-foreground">$10</span>/month
              </p>
              <p className="mb-8 text-sm font-medium text-primary">
                14-day free trial · no card required
              </p>
              <ul className="mb-10 space-y-3 text-left text-sm font-light text-muted-foreground">
                {[
                  "Unlimited quotes",
                  "PDF delivery via text + email",
                  "Quote history",
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[4px] bg-[#00D4B4] px-8 py-3.5 text-[15px] font-medium leading-none text-[#1C0E09] shadow-none transition-colors hover:bg-[#00B89C]"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#3D2218] bg-background px-6 py-10 sm:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm font-light text-muted-foreground sm:flex-row">
          <p>© Stratycs LLC</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
