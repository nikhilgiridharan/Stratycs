import styles from "./HeroPhoneMockup.module.css";

function PaperPlaneIcon() {
  return (
    <svg
      className={styles.planeIcon}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M22 2L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroPhoneMockup() {
  return (
    <div className={styles.phone} aria-hidden>
      <div className={styles.notch} />
      <div className={styles.screen}>
        <div className={styles.screenInner}>
          <div className={styles.screenContent}>
            <div className={styles.item1}>
              <div className={styles.topBar}>
                <PaperPlaneIcon />
                <span className={styles.brandLabel}>Stratycs</span>
              </div>
            </div>
            <div className={styles.item2}>
              <div className={styles.newQuote}>NEW QUOTE</div>
            </div>
            <div className={styles.item3}>
              <div className={styles.divider} />
            </div>
            <div className={styles.item4}>
              <div className={styles.lineRow}>
                <span className={styles.lineLabel}>AC Unit Install</span>
                <span className={styles.lineDots} />
                <span className={styles.linePrice}>$1,200</span>
              </div>
            </div>
            <div className={styles.item5}>
              <div className={styles.lineRow}>
                <span className={styles.lineLabel}>Labor (4hrs)</span>
                <span className={styles.lineDots} />
                <span className={styles.linePrice}>$320</span>
              </div>
            </div>
            <div className={styles.item6}>
              <div className={styles.lineRow}>
                <span className={styles.lineLabel}>Refrigerant R-410A</span>
                <span className={styles.lineDots} />
                <span className={styles.linePrice}>$85</span>
              </div>
            </div>
            <div className={styles.item7}>
              <div className={styles.lineRow}>
                <span className={styles.lineLabel}>Permit fee</span>
                <span className={styles.lineDots} />
                <span className={styles.linePrice}>$75</span>
              </div>
            </div>
            <div className={styles.item8}>
              <div className={styles.divider} />
            </div>
            <div className={styles.item9}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>TOTAL</span>
                <span className={styles.totalPrice}>$1,680</span>
              </div>
            </div>
            <div className={styles.item10}>
              <div className={styles.sendBtn} role="presentation">
                Send Quote ✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
