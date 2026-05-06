import React from "react";
import styles from "./ProductCard.module.css";

function formatPrice(price) {
  return (price ?? 0).toLocaleString("ko-KR") + "원";
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="#FF6B6B">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

/**
 * 상품 카드 컴포넌트
 * @param {{ product: Object, isBest?: boolean }} props
 *
 * 이미지 교체 방법:
 *   product.images[0] 에 실제 이미지 URL이 들어옵니다.
 *   API에서 이미지가 없을 경우 아래 fallback 이미지가 표시됩니다.
 *   fallback 이미지를 변경하려면 FALLBACK_IMAGE 상수를 수정하세요.
 */
const FALLBACK_IMAGE = "https://placehold.co/300x300/f0f0f0/999?text=No+Image";

function ProductCard({ product, isBest = false }) {
  const imgSrc = product.images?.[0] || FALLBACK_IMAGE;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={imgSrc}
          alt={product.name}
          className={styles.image}
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />
      </div>
      <div className={styles.body}>
        {isBest && <span className={styles.badge}>BEST</span>}
        <p className={styles.name}>{product.name}</p>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <div className={styles.meta}>
          <HeartIcon />
          <span>{product.favoriteCount ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
