import { Navigate, useParams } from "react-router-dom";

import { legalPages } from "../data/legal.js";
import styles from "./LegalPage.module.css";

export default function LegalPage() {
  const { slug } = useParams();
  const page = legalPages[slug];

  if (!page) return <Navigate to="/" replace />;

  return (
    <main className={styles.page}>
      <article className={styles.wrap}>
        <header className={styles.hero}>
          <p className={`eyebrow ${styles.eyebrow}`}>
            <span className="eyebrow__mark" />
            {page.eyebrow}
          </p>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.lead}>{page.description}</p>
          <p className={styles.updated}>Last updated: {page.updated}</p>
        </header>

        <div className={styles.sections}>
          {page.sections.map((section) => (
            <section className={styles.section} key={section.title}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <p className={styles.body}>{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
