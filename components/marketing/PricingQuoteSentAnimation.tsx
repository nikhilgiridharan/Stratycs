import styles from "./PricingQuoteSentAnimation.module.css";

export function PricingQuoteSentAnimation() {
  return (
    <div className={styles.scene} aria-hidden>
      <div className={styles.master}>
        <div className={styles.phoneWrap}>
          <div className={styles.phone}>
            <div className={styles.screen}>
              <p className={styles.quoteReady}>Quote Ready</p>
              <p className={styles.name}>Sarah M.</p>
              <p className={styles.amount}>$1,680</p>
              <div className={styles.btnGlow}>
                <div className={styles.btnSend}>Send via SMS ›</div>
                <div className={styles.btnSent}>✓ Sent</div>
              </div>
            </div>
          </div>
          <div className={styles.bubble}>
            📋 Your quote from Stratycs — $1,680. Tap to review.
          </div>
          <div className={styles.badge}>✓ Customer approved</div>
        </div>
      </div>
    </div>
  );
}
