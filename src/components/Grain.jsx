import styles from "./Grain.module.css";

/** Fixed film-grain overlay for a touch of texture. */
export default function Grain() {
  return <div className={styles.grain} aria-hidden="true" />;
}
