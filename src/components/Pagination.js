import React from 'react';
import styles from './Pagination.module.css';

/**
 * 페이지네이션 컴포넌트
 * @param {{ current: number, total: number, onPage: (n: number) => void }} props
 */
function Pagination({ current, total, onPage }) {
  const RANGE = 5;
  let start = Math.max(1, current - 2);
  let end = Math.min(total, start + RANGE - 1);
  if (end - start < RANGE - 1) start = Math.max(1, end - RANGE + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className={styles.pagination}>
      <button
        className={styles.btn}
        onClick={() => onPage(current - 1)}
        disabled={current === 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`${styles.btn} ${p === current ? styles.active : ''}`}
          onClick={() => onPage(p)}
          aria-current={p === current ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        className={styles.btn}
        onClick={() => onPage(current + 1)}
        disabled={current === total}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </div>
  );
}

export default Pagination;
