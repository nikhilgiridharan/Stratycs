import Link from "next/link";

import { PricingQuoteSentAnimation } from "@/components/marketing/PricingQuoteSentAnimation";

const CORE_FEATURES = [
  "Two week free trial",
  "Unlimited quotes",
  "PDF delivery via text + email",
  "Quote history",
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="border-t border-[#e8873a] bg-[#f5f2eb] px-6 py-[100px] sm:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto w-full max-w-[1100px]">
          <p className="mb-6 text-center font-dmSans text-base font-light leading-relaxed text-[#3d342c]">
            No bloated software. No 30-feature dashboard. Just quotes — in under
            60 seconds.
          </p>
          <h2 className="pl-3 text-left font-playfair text-[clamp(2.75rem,6vw,4.25rem)] font-normal leading-[1.05] text-[#2a1a0e] sm:pl-4">
            Pricing
          </h2>
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-[1100px] flex-col items-center justify-center gap-16 md:flex-row">
          <div className="w-full shrink-0 md:max-w-[48%] md:flex-[0_0_48%]">
            <div className="w-full rounded-xl border border-black/[0.08] bg-[#faf8f4] p-8 shadow-sm sm:p-10">
              <p className="font-dmSans text-3xl font-bold tracking-tight text-[#2a1a0e] sm:text-4xl">
                $10/month
              </p>
              <ul className="mt-8 space-y-3 border-t border-black/[0.06] pt-8">
                {CORE_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex gap-3 font-dmSans text-base font-light leading-relaxed text-[#3d342c]"
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#2a1a0e]"
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="mt-10 inline-flex min-h-[52px] w-full items-center justify-center rounded-lg bg-[#4ce8b8] px-8 text-[15px] font-bold text-[#1a1208] shadow-none transition-colors hover:bg-[#3dd4a8]"
              >
                Start free trial
              </Link>
            </div>
          </div>
          <div className="flex w-full shrink-0 items-center justify-center md:max-w-[42%] md:flex-[0_0_42%]">
            <PricingQuoteSentAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
