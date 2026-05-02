import { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useBestProducts, useSaleProducts } from '../hooks/useProducts';
import useDebounce from '../hooks/useDebounce';
import useWindowSize from '../hooks/useWindowSize';
import styles from './MarketPage.module.css';

function getPageSize(type, width) {
  if (type === 'best') {
    if (width <= 767) return 1;
    if (width <= 1199) return 2;
    return 4;
  }
  if (width <= 767) return 4;
  if (width <= 1199) return 6;
  return 10;
}

function MarketPage() {
  const width = useWindowSize();

  // ── 베스트 상품 ──
  const { products: bestProducts, loading: bestLoading } = useBestProducts();
  const bestPageSize = getPageSize('best', width);

  // ── 판매 상품 상태 ──
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState('recent');
  const [searchInput, setSearchInput] = useState('');
  const keyword = useDebounce(searchInput, 400);

  const salePageSize = getPageSize('sale', width);

  // pageSize / keyword / orderBy 변경 시 1페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [salePageSize, keyword, orderBy]);

  const {
    products: saleProducts,
    totalPages,
    loading: saleLoading,
  } = useSaleProducts({ page: currentPage, orderBy, keyword });

  // ── 그리드 열 수 ──
  const bestCols =
    bestPageSize === 4 ? 'repeat(4,1fr)' : bestPageSize === 2 ? 'repeat(2,1fr)' : '1fr';
  const saleCols =
    salePageSize === 10 ? 'repeat(5,1fr)' : salePageSize === 6 ? 'repeat(3,1fr)' : 'repeat(2,1fr)';

  return (
    <main className={styles.wrap}>
      {/* ── 베스트 상품 ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>베스트 상품</h2>
        <div className={styles.grid} style={{ gridTemplateColumns: bestCols }}>
          {bestLoading
            ? Array(bestPageSize)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : bestProducts.length > 0
            ? bestProducts.map((p) => <ProductCard key={p.id} product={p} isBest />)
            : <p className={styles.empty}>베스트 상품이 없습니다.</p>}
        </div>
      </section>

      {/* ── 판매 중인 상품 ── */}
      <section className={styles.section}>
        <div className={styles.saleHeader}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
            판매 중인 상품
          </h2>
          <div className={styles.saleControls}>
            {/* 검색 */}
            <div className={styles.searchBox}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#9ca3af">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="text"
                placeholder="검색할 상품을 입력해주세요"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* 상품 등록 버튼 */}
            <button className={styles.btnRegister}>상품 등록하기</button>

            {/* 정렬 드롭다운 */}
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="recent">최신 순</option>
              <option value="favorite">좋아요 순</option>
            </select>
          </div>
        </div>

        {/* 상품 그리드 */}
        <div className={styles.grid} style={{ gridTemplateColumns: saleCols }}>
          {saleLoading
            ? Array(salePageSize)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : saleProducts.length > 0
            ? saleProducts.map((p) => <ProductCard key={p.id} product={p} />)
            : (
              <div className={styles.empty} style={{ gridColumn: '1/-1' }}>
                🔍 검색 결과가 없습니다.
              </div>
            )}
        </div>

        {/* 페이지네이션 */}
        <Pagination
          current={currentPage}
          total={totalPages}
          onPage={setCurrentPage}
        />
      </section>
    </main>
  );
}

export default MarketPage;
