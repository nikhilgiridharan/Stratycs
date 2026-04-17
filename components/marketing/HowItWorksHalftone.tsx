/** Teal halftone blob decoration for the "How it works" section only. */

export function HowItWorksHalftone() {
  return (
    <svg
      className="h-full min-h-[260px] w-full max-w-full md:min-h-[420px]"
      viewBox="0 0 480 640"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern
          id="strat-halftone-grid"
          width={10}
          height={10}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={5} cy={5} r={1.5} fill="#4ce8b8" />
        </pattern>
        <mask
          id="strat-halftone-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="480"
          height="640"
        >
          <rect width="480" height="640" fill="black" />
          <ellipse cx="210" cy="220" rx="200" ry="210" fill="white" opacity="0.92" />
          <ellipse cx="120" cy="480" rx="160" ry="180" fill="white" opacity="0.78" />
          <ellipse cx="380" cy="420" rx="140" ry="160" fill="white" opacity="0.65" />
          <ellipse cx="280" cy="120" rx="110" ry="100" fill="white" opacity="0.55" />
        </mask>
      </defs>
      <rect
        width="480"
        height="640"
        fill="url(#strat-halftone-grid)"
        mask="url(#strat-halftone-mask)"
        opacity={0.75}
      />
    </svg>
  );
}
