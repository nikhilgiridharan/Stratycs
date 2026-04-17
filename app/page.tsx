import Image from "next/image";
import Link from "next/link";

import { HeroPhoneMockup } from "@/components/marketing/HeroPhoneMockup";
import { HowItWorksHalftone } from "@/components/marketing/HowItWorksHalftone";
import { PricingSection } from "@/components/marketing/PricingSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b-2 border-[#e8873a] bg-navbar pt-3 pb-5 pl-1 pr-6 sm:pt-4 sm:pb-6 sm:pl-2 sm:pr-12">
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
        <section className="pt-[120px] pb-[100px]">
          <div className="mx-auto max-w-6xl">
            <div className="flex w-full flex-col items-stretch gap-12 px-12 py-16 md:flex-row md:items-center md:justify-between">
              <div className="w-full min-w-0 max-w-full basis-full md:max-w-[52%] md:flex-[0_0_52%]">
                <div className="border-l-2 border-[#00D4B4] bg-background pl-8 pr-4 pt-2 pb-4 text-left sm:pl-12 sm:pr-8 lg:pl-20 lg:pr-12">
                  <h1 className="mb-6 max-w-4xl text-foreground">
                    Quote Fast. Win More.
                  </h1>
                  <p className="max-w-[560px] font-light text-foreground">
                    Stratycs builds simple software tools for tradespeople. Our
                    quoting tool lets contractors generate a professional, branded
                    estimate in 60 seconds — straight from their phone.
                  </p>
                </div>
              </div>
              <div className="flex w-full min-w-0 max-w-full basis-full items-center justify-center md:max-w-[44%] md:flex-[0_0_44%]">
                <HeroPhoneMockup />
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="relative border-t border-[#e8873a] bg-[#7a4a2a] px-6 py-[100px] sm:px-12"
        >
          <div className="relative mx-auto max-w-6xl">
            <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-10 lg:gap-14">
              <div className="relative w-full shrink-0 md:w-[40%] md:max-w-[min(100%,28rem)]">
                <div className="pointer-events-none relative -mx-2 overflow-visible sm:mx-0 md:-ml-2 lg:-ml-6">
                  <HowItWorksHalftone />
                </div>
              </div>
              <div className="min-w-0 flex-1 md:w-[60%]">
                <h2 className="mb-10 font-playfair text-[clamp(2rem,4.5vw,3rem)] font-normal leading-[1.1] text-[#e8e4dc] md:mb-12">
                  How it works
                </h2>
                <div className="flex flex-col gap-5">
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
                      className="rounded-[4px] border border-[#6a4224] border-l-[3px] border-l-[#4ce8b8] bg-[#865336] p-6 shadow-none transition-[transform,box-shadow,background-color] duration-200 [transition-timing-function:ease] hover:-translate-y-[4px] hover:scale-[1.02] hover:bg-[#8f5a3e] hover:shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
                    >
                      <p className="mb-3 font-sans text-[32px] font-bold tabular-nums leading-none text-[#4ce8b8]">
                        {step.n}
                      </p>
                      <h3 className="mb-2 font-sans text-xl font-medium leading-snug text-[#e8e4dc]">
                        {step.title}
                      </h3>
                      <p className="font-sans text-base font-light leading-relaxed text-[#c9b8a4]">
                        {step.body}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <PricingSection />
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
