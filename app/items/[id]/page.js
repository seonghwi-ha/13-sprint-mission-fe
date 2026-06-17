"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProduct, deleteProduct } from "../../../src/api/productApi";

const DEFAULT_IMAGE = "https://placehold.co/500x500/f0f0f0/999?text=No+Image";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await getProduct(productId);
        setProduct(data.product);
      } catch (err) {
        alert("상품을 불러올 수 없습니다: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  async function handleDelete() {
    if (!confirm("상품을 삭제하시겠습니까?")) return;
    try {
      await deleteProduct(productId);
      alert("삭제되었습니다.");
      router.push("/items");
    } catch (err) {
      alert("삭제 실패: " + err.message);
    }
  }

  if (loading) {
    return <main className="mx-auto max-w-[1200px] px-6 py-8"><p>불러오는 중...</p></main>;
  }

  if (!product) {
    return <main className="mx-auto max-w-[1200px] px-6 py-8"><p>상품을 찾을 수 없습니다.</p></main>;
  }

  const price = (product.price || 0).toLocaleString("ko-KR") + "원";

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-[420px_1fr]">
        <img
          className="w-full rounded-xl bg-gray-100"
          src={product.imageUrl || DEFAULT_IMAGE}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
        />

        <div>
          <div className="flex items-start justify-between">
            <h1 className="text-[28px] font-bold text-gray-800">{product.name}</h1>
            <button type="button" className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600" onClick={handleDelete}>
              삭제
            </button>
          </div>

          <strong className="my-6 block text-2xl text-gray-800">{price}</strong>
          <p className="mb-6 leading-relaxed text-gray-700">{product.description}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-2xl bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <Link href="/items" className="inline-block rounded-[40px] bg-panda-primary px-10 py-3 font-semibold text-white transition hover:bg-panda-hover active:bg-panda-active">
          목록으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
