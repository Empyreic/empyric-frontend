import styles from "../pages/Studio.module.css";

/**
 * CloudBands — 3 seamless horizontal repeat-x scrolling cloud layers.
 * Sits at the very bottom of whatever page it's placed in.
 * The parent must have `position: relative` and `overflow: hidden` or `visible`.
 */
export default function CloudBands() {
  return (
    <div className={styles.cloudContainer} aria-hidden="true">
      <div className={styles.cloudBand1} />
      <div className={styles.cloudBand2} />
      <div className={styles.cloudBand3} />
      <div className={styles.floorBlur} />
    </div>
  );
}
