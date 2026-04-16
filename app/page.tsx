function LogoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#e8873a"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 shrink-0"
      aria-hidden
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22 11 13 2 9 22 2z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div>
      <header className="sticky top-0 z-50 h-16 border-b-[1.5px] border-[#e8873a] bg-[#0f0f0f] px-12">
        <nav className="mx-auto flex h-full max-w-6xl items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2.5 text-[#e8e4dc]"
          >
            <LogoIcon />
            <span className="text-lg font-medium tracking-tight">
              Stratycs
            </span>
          </a>
          <div className="flex shrink-0 items-center gap-4 text-sm sm:gap-8">
            <a
              href="#how-it-works"
              className="text-[#888880] transition-colors hover:text-[#e8e4dc]"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-[#888880] transition-colors hover:text-[#e8e4dc]"
            >
              Pricing
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="px-6 py-14 sm:px-12 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div
              className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1a1a1a] p-8 shadow-[inset_4px_0_0_0_#e8873a,0_0_40px_-12px_rgba(232,135,58,0.25)] sm:p-12 lg:p-14"
            >
              <p className="mb-4 text-xs font-normal uppercase tracking-[0.2em] text-[#888880]">
                Built for the field
              </p>
              <h1
                className="mb-6 max-w-4xl font-display text-[2.5rem] font-normal leading-[1.1] tracking-tight text-[#e8e4dc] sm:text-5xl lg:text-[3.75rem]"
              >
                Send a quote before you leave the driveway.
              </h1>
              <p className="mb-10 max-w-[520px] text-lg font-light leading-relaxed text-[#888880]">
                You lose bids while you dig up prices. Stratycs builds the
                quote on your phone and sends a PDF by text or email in under
                two minutes.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <a
                  href="/signup"
                  className="inline-flex min-w-[min(100%,280px)] items-center justify-center rounded-lg bg-[#4ce8b8] px-8 py-3.5 text-center text-base font-bold text-[#0f0f0f] transition-opacity hover:opacity-90"
                >
                  Start free — $10/mo
                </a>
                <a
                  href="/login"
                  className="text-center text-base font-normal text-[#4ce8b8] underline-offset-4 hover:underline sm:text-left"
                >
                  Already have an account? Log in
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-[rgba(255,255,255,0.07)] bg-[#161616] px-6 py-16 sm:px-12 sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center font-display text-3xl font-normal text-[#e8e4dc] sm:text-4xl lg:text-[2.75rem]">
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
                  className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#1a1a1a] p-8"
                >
                  <p className="mb-4 font-display text-3xl text-[#e8873a]">
                    {step.n}
                  </p>
                  <h3 className="mb-3 text-lg font-normal text-[#e8e4dc]">
                    {step.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-[#888880]">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="px-6 py-16 sm:px-12 sm:py-20"
        >
          <div className="mx-auto max-w-lg">
            <h2 className="mb-10 text-center font-display text-3xl font-normal text-[#e8e4dc] sm:text-4xl lg:text-[2.75rem]">
              Pricing
            </h2>
            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1a1a1a] p-10 text-center">
              <p className="mb-1 font-display text-2xl text-[#e8e4dc]">
                Pro
              </p>
              <p className="mb-8 text-lg text-[#888880]">
                <span className="text-[#e8e4dc]">$10</span>
                /month
              </p>
              <ul className="mb-10 space-y-3 text-left text-sm font-light text-[#888880]">
                {[
                  "Unlimited quotes",
                  "PDF delivery via text + email",
                  "Pre-loaded line items for 3 trades",
                  "Quote history",
                  "Mobile-first",
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e8873a]"
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#4ce8b8] px-8 py-3.5 text-base font-bold text-[#0f0f0f] transition-opacity hover:opacity-90"
              >
                Start free
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(255,255,255,0.07)] bg-[#0f0f0f] px-6 py-10 sm:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm font-light text-[#888880] sm:flex-row">
          <p>© 2025 Stratycs LLC</p>
          <p>Built in Texas</p>
        </div>
      </footer>
    </div>
  );
}
