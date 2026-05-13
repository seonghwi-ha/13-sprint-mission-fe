// pages/RegistrationPage.jsx
// React Router v6 기준: <Route path="/registration" element={<RegistrationPage />} />
// 백엔드 POST /products API 연동 포함

import { useNavigate } from "react-router-dom";
import { useRegistrationForm } from "../hooks/useRegistrationForm";

// ── API 베이스 URL: .env에서 주입 ─────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// ──────────────────────────────────────────────────────────────────
// RegistrationPage
// ──────────────────────────────────────────────────────────────────
export default function RegistrationPage() {
  const navigate = useNavigate();

  const {
    values,
    tags,
    handleChange,
    handleBlur,
    handleTagKeyDown,
    removeTag,
    getError,
    isSubmitEnabled,
    validateAll,
  } = useRegistrationForm();

  // ── 등록 핸들러 ────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateAll()) return;

    const body = {
      name: values.name,
      description: values.description,
      price: Number(values.price),
      tags,
    };

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

      const data = await res.json();
      // 등록 성공 → 상품 상세 페이지(빈 페이지)로 이동
      navigate(`/items/${data.id}`);
    } catch (err) {
      alert(`상품 등록에 실패했습니다.\n${err.message}`);
    }
  };

  return (
    <>
      {/* ── 인라인 스타일 (별도 CSS 파일이 있으면 import로 대체) ── */}
      <style>{styles}</style>

      <div className="reg-page">
        {/* ── 상단 헤더 ──────────────────────────────────────────── */}
        <div className="reg-header">
          <h1 className="reg-title">상품 등록하기</h1>
          <button
            className={`reg-submit-btn ${isSubmitEnabled ? "active" : ""}`}
            disabled={!isSubmitEnabled}
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>

        {/* ── 폼 본문 ────────────────────────────────────────────── */}
        <div className="reg-form">

          {/* 상품명 */}
          <Field
            label="상품명"
            error={getError("name")}
            hint={`${values.name.length}/10`}
          >
            <input
              className={`reg-input ${getError("name") ? "error" : ""}`}
              type="text"
              placeholder="상품명을 입력해주세요 (1~10자)"
              value={values.name}
              maxLength={10}
              onChange={handleChange("name")}
              onBlur={handleBlur("name")}
            />
          </Field>

          {/* 상품 소개 */}
          <Field
            label="상품 소개"
            error={getError("description")}
            hint={`${values.description.length}/100`}
          >
            <textarea
              className={`reg-textarea ${getError("description") ? "error" : ""}`}
              placeholder="상품 소개를 입력해주세요 (10~100자)"
              rows={6}
              value={values.description}
              maxLength={100}
              onChange={handleChange("description")}
              onBlur={handleBlur("description")}
            />
          </Field>

          {/* 판매 가격 */}
          <Field label="판매 가격" error={getError("price")}>
            <input
              className={`reg-input ${getError("price") ? "error" : ""}`}
              type="text"
              inputMode="numeric"
              placeholder="판매 가격을 입력해주세요 (숫자)"
              value={values.price}
              onChange={(e) => {
                // 숫자만 허용
                const v = e.target.value.replace(/[^0-9]/g, "");
                handleChange("price")({ target: { value: v } });
              }}
              onBlur={handleBlur("price")}
            />
          </Field>

          {/* 태그 */}
          <Field
            label="태그"
            error={getError("tagInput")}
            description="태그를 입력하고 Enter 키를 누르세요 (5글자 이내)"
          >
            <input
              className={`reg-input ${getError("tagInput") ? "error" : ""}`}
              type="text"
              placeholder="#태그 입력 후 Enter"
              value={values.tagInput}
              maxLength={5}
              onChange={handleChange("tagInput")}
              onBlur={handleBlur("tagInput")}
              onKeyDown={handleTagKeyDown}
            />

            {/* 태그 칩 목록 */}
            {tags.length > 0 && (
              <div className="tag-list">
                {tags.map((tag, i) => (
                  <span key={i} className="tag-chip">
                    #{tag}
                    <button
                      className="tag-remove"
                      onClick={() => removeTag(i)}
                      aria-label={`${tag} 태그 삭제`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>
        </div>
      </div>
    </>
  );
}

// ── Field 래퍼 컴포넌트 ────────────────────────────────────────────
function Field({ label, error, hint, description, children }) {
  return (
    <div className="reg-field">
      <div className="reg-field-header">
        <label className="reg-label">{label}</label>
        {hint && <span className="reg-hint">{hint}</span>}
      </div>
      {description && <p className="reg-description">{description}</p>}
      {children}
      {error && <p className="reg-error">{error}</p>}
    </div>
  );
}

// ── CSS-in-JS (문자열) ────────────────────────────────────────────
// 별도 registration.css 파일로 분리해도 됩니다.
const styles = `
/* ── 페이지 레이아웃 ─────────────────────────────── */
.reg-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  box-sizing: border-box;
  font-family: "Pretendard", sans-serif;
}

/* ── 헤더 ────────────────────────────────────────── */
.reg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}
.reg-title {
  font-size: 20px;
  font-weight: 700;
  color: #1c1c1c;
  margin: 0;
}

/* ── 등록 버튼 ───────────────────────────────────── */
.reg-submit-btn {
  height: 42px;
  padding: 0 24px;
  border-radius: 8px;
  border: none;
  background: #9ca3af;   /* 비활성 */
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: not-allowed;
  transition: background 0.2s;
}
.reg-submit-btn.active {
  background: #3692ff;   /* 활성 */
  cursor: pointer;
}
.reg-submit-btn.active:hover {
  background: #1877f2;
}

/* ── 폼 ──────────────────────────────────────────── */
.reg-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── 필드 ────────────────────────────────────────── */
.reg-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.reg-field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.reg-label {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}
.reg-hint {
  font-size: 13px;
  color: #9ca3af;
}
.reg-description {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

/* ── Input / Textarea 공통 ───────────────────────── */
.reg-input,
.reg-textarea {
  width: 100%;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: #f3f4f6;
  font-size: 16px;
  color: #374151;
  font-family: "Pretendard", sans-serif;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  resize: vertical;
}
.reg-input::placeholder,
.reg-textarea::placeholder {
  color: #9ca3af;
}
.reg-input:focus,
.reg-textarea:focus {
  border-color: #3692ff;
  background: #fff;
}

/* ── 에러 상태 ───────────────────────────────────── */
.reg-input.error,
.reg-textarea.error {
  border-color: #ef4444 !important;
  background: #fff;
}
.reg-error {
  font-size: 14px;
  color: #ef4444;
  margin: 0;
}

/* ── 태그 칩 ─────────────────────────────────────── */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}
.tag-remove {
  background: none;
  border: none;
  color: #1d4ed8;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}
.tag-remove:hover {
  color: #1e3a8a;
}

/* ── 반응형: Tablet (768px) ──────────────────────── */
@media (max-width: 1199px) {
  .reg-page {
    max-width: 100%;
    padding: 24px 32px 80px;
  }
}

/* ── 반응형: Mobile (767px) ──────────────────────── */
@media (max-width: 767px) {
  .reg-page {
    padding: 20px 16px 80px;
  }
  .reg-title {
    font-size: 18px;
  }
  .reg-submit-btn {
    height: 38px;
    font-size: 14px;
    padding: 0 16px;
  }
  .reg-label {
    font-size: 16px;
  }
  .reg-input,
  .reg-textarea {
    font-size: 15px;
    padding: 14px 16px;
  }
}
`;
