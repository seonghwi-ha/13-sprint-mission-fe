"use client";

import { useRouter } from "next/navigation";
import { useProductForm } from "../../src/hooks/useProductForm";
import { createProduct } from "../../src/api/productApi";

const inputBase = "w-full rounded-xl bg-gray-100 px-6 py-4 text-base outline-none";
const inputError = "border border-red-500 bg-red-50";

export default function RegistrationPage() {
  const router = useRouter();

  const {
    form,
    errors,
    tags,
    tagInput,
    isFormValid,
    handleChange,
    handleBlur,
    handleTagInputChange,
    handleTagKeyDown,
    removeTag,
  } = useProductForm();

  async function handleSubmit() {
    if (!isFormValid) return;

    try {
      const result = await createProduct({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        tags,
      });
      router.push(`/items/${result.product.id}`);
    } catch (err) {
      alert("등록 실패: " + err.message);
    }
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <div>
        <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-800 md:text-[28px]">상품 등록하기</h1>
          <button
            className="h-[42px] w-full rounded-lg bg-panda-primary px-7 font-semibold text-white transition hover:bg-panda-hover active:bg-panda-active disabled:cursor-not-allowed disabled:bg-gray-400 md:w-auto"
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            등록
          </button>
        </div>

        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-3">
            <label className="text-lg font-bold text-gray-800" htmlFor="name">
              상품명 <span className="ml-0.5 text-panda-primary">*</span>
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="상품명을 입력해주세요"
              className={`${inputBase} ${errors.name ? inputError : ""}`}
            />
            {errors.name && <p className="mt-0.5 text-[13px] text-red-500">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-lg font-bold text-gray-800" htmlFor="description">
              상품 소개 <span className="ml-0.5 text-panda-primary">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="상품 소개를 입력해주세요"
              className={`${inputBase} min-h-[200px] resize-y ${errors.description ? inputError : ""}`}
            />
            {errors.description && <p className="mt-0.5 text-[13px] text-red-500">{errors.description}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-lg font-bold text-gray-800" htmlFor="price">
              판매 가격 <span className="ml-0.5 text-panda-primary">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="text"
              inputMode="numeric"
              value={form.price}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="판매 가격을 입력해주세요"
              className={`${inputBase} ${errors.price ? inputError : ""}`}
            />
            {errors.price && <p className="mt-0.5 text-[13px] text-red-500">{errors.price}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-lg font-bold text-gray-800" htmlFor="tag">태그</label>
            <input
              id="tag"
              name="tag"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              placeholder="태그를 입력 후 엔터를 누르세요 (5글자 이내)"
              className={`${inputBase} ${errors.tag ? inputError : ""}`}
            />
            {errors.tag && <p className="mt-0.5 text-[13px] text-red-500">{errors.tag}</p>}

            {tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-panda-primary">
                    #{tag}
                    <button
                      type="button"
                      className="p-0 text-xs text-panda-primary opacity-70 hover:opacity-100"
                      onClick={() => removeTag(tag)}
                      aria-label={`${tag} 태그 삭제`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
