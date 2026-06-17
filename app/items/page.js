"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "../../src/api/productApi";
import ProductCard from "../../src/components/ProductCard";
import Pagination from "../../src/components/Pagination";

export default function ItemsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchText);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts({ page, limit, keyword, sort: "recent" });
        setProducts(data.products || []);
        setTotalPages(Math.ceil((data.count ?? 0) / limit) || 1);
      } catch (err) {
        alert("상품 로드 실패: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [page, keyword]);

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-800">판매 중인 상품</h2>

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:flex-wrap">
            <div className="flex h-[42px] flex-1 items-center gap-2 rounded-xl bg-gray-100 px-4 md:min-w-[280px]">
              <span>🔍</span>
              <input
                className="w-full bg-transparent text-[15px] outline-none"
                type="text"
                placeholder="검색할 상품을 입력해주세요"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <button
              className="h-[42px] rounded-lg bg-panda-primary px-5 font-semibold text-white transition hover:bg-panda-hover active:bg-panda-active"
              type="button"
              onClick={() => router.push("/registration")}
            >
              상품 등록하기
            </button>

            <select className="h-[42px] rounded-xl border border-gray-200 bg-white px-4 text-[15px]" defaultValue="recent">
              <option value="recent">최신순</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-400">상품을 불러오는 중입니다...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-400">등록된 상품이 없습니다.</div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
      </section>
    </main>
  );
}
