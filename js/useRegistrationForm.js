// hooks/useRegistrationForm.js
import { useState, useCallback } from "react";

// ── 유효성 검사 규칙 ──────────────────────────────────────────────
const RULES = {
  name: {
    validate: (v) => v.length >= 1 && v.length <= 10,
    message: "상품명은 1자 이상 10자 이내로 입력해주세요.",
  },
  description: {
    validate: (v) => v.length >= 10 && v.length <= 100,
    message: "상품 소개는 10자 이상 100자 이내로 입력해주세요.",
  },
  price: {
    validate: (v) => v.length >= 1 && /^\d+$/.test(v),
    message: "판매 가격은 숫자로 1자 이상 입력해주세요.",
  },
  tagInput: {
    validate: (v) => v.length === 0 || v.length <= 5,
    message: "태그는 5글자 이내로 입력해주세요.",
  },
};

export function useRegistrationForm() {
  // ── 폼 값 상태 ────────────────────────────────────────────────
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    tagInput: "",
  });

  // ── 태그 목록 상태 ────────────────────────────────────────────
  const [tags, setTags] = useState([]);

  // ── 에러 상태 ─────────────────────────────────────────────────
  // touched: 해당 필드를 한 번이라도 blur한 경우에만 에러 표시
  const [touched, setTouched] = useState({
    name: false,
    description: false,
    price: false,
    tagInput: false,
  });

  // ── 값 변경 핸들러 ────────────────────────────────────────────
  const handleChange = useCallback((field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  // ── blur 핸들러 ───────────────────────────────────────────────
  const handleBlur = useCallback((field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // ── 에러 메시지 계산 ──────────────────────────────────────────
  const getError = useCallback(
    (field) => {
      if (!touched[field]) return "";
      const rule = RULES[field];
      if (!rule) return "";
      return rule.validate(values[field]) ? "" : rule.message;
    },
    [values, touched]
  );

  // ── 태그 추가 (Enter 키) ──────────────────────────────────────
  const handleTagKeyDown = useCallback(
    (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();

      // blur 처리해서 에러 표시
      setTouched((prev) => ({ ...prev, tagInput: true }));

      const tag = values.tagInput.trim();
      if (!tag) return;
      if (tag.length > 5) return; // 유효성 통과 못하면 추가 안 함
      if (tags.includes(tag)) {
        setValues((prev) => ({ ...prev, tagInput: "" }));
        return;
      }

      setTags((prev) => [...prev, tag]);
      setValues((prev) => ({ ...prev, tagInput: "" }));
      setTouched((prev) => ({ ...prev, tagInput: false }));
    },
    [values.tagInput, tags]
  );

  // ── 태그 삭제 ─────────────────────────────────────────────────
  const removeTag = useCallback((index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ── 등록 버튼 활성화 여부 ─────────────────────────────────────
  // 모든 필수 input이 비어있지 않아야 활성화
  const isSubmitEnabled =
    RULES.name.validate(values.name) &&
    RULES.description.validate(values.description) &&
    RULES.price.validate(values.price);

  // ── 전체 폼 유효성 검사 (submit 시) ──────────────────────────
  const validateAll = useCallback(() => {
    setTouched({ name: true, description: true, price: true, tagInput: false });
    return (
      RULES.name.validate(values.name) &&
      RULES.description.validate(values.description) &&
      RULES.price.validate(values.price)
    );
  }, [values]);

  return {
    values,
    tags,
    touched,
    handleChange,
    handleBlur,
    handleTagKeyDown,
    removeTag,
    getError,
    isSubmitEnabled,
    validateAll,
  };
}
