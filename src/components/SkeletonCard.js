import React from 'react';
import styles from './SkeletonCard.module.css';

function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`${styles.skeleton} ${styles.image}`} />
      <div className={styles.body}>
        <div className={`${styles.skeleton} ${styles.line}`} />
        <div className={`${styles.skeleton} ${styles.lineShort}`} />
        <div className={`${styles.skeleton} ${styles.linePrice}`} />
      </div>
    </div>
  );
}

export default SkeletonCard;
