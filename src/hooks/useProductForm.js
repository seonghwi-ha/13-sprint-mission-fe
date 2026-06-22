import { useState, useCallback } from "react";

const VALIDATION_RULES = {
  name: {
    validate: (v) => v.length >= 1 && v.length <= 10,
    message: "상품명은 1자 이상 10자 이내로 입력해주세요.",
  },
  description: {
    validate: (v) => v.length >= 10 && v.length <= 100,
    message: "상품 소개는 10자 이상 100자 이내로 입력해주세요.",
  },
  price: {
    validate: (v) => v !== "" && !isNaN(Number(v)) && Number(v) > 0,
    message: "올바른 가격을 입력해주세요. (숫자만 가능)",
  },
  tag: {
    validate: (v) => v.length >= 1 && v.length <= 5,
    message: "태그는 5글자 이내로 입력해주세요.",
  },
};

export function useProductForm() {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [errors, setErrors] = useState({ name: "", description: "", price: "", tag: "" });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (value === "") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } else {
      const rule = VALIDATION_RULES[name];
      setErrors((prev) => ({
        ...prev,
        [name]: rule && !rule.validate(value) ? rule.message : "",
      }));
    }
  }, []);

  const handleTagInputChange = useCallback((e) => {
    const value = e.target.value;
    setTagInput(value);

    if (value === "") {
      setErrors((prev) => ({ ...prev, tag: "" }));
    } else {
      const rule = VALIDATION_RULES.tag;
      setErrors((prev) => ({
        ...prev,
        tag: !rule.validate(value) ? rule.message : "",
      }));
    }
  }, []);

  const handleTagKeyDown = useCallback(
    (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();

      const trimmed = tagInput.trim();
      if (!VALIDATION_RULES.tag.validate(trimmed)) return;

      if (tags.includes(trimmed)) {
        setErrors((prev) => ({ ...prev, tag: "이미 추가된 태그입니다." }));
        return;
      }

      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
      setErrors((prev) => ({ ...prev, tag: "" }));
    },
    [tagInput, tags]
  );

  const removeTag = useCallback((tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  }, []);

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      const value = form[name] ?? "";
      const rule = VALIDATION_RULES[name];
      if (!rule) return;
      setErrors((prev) => ({
        ...prev,
        [name]: !rule.validate(value) ? rule.message : "",
      }));
    },
    [form]
  );

  const isFormValid =
    form.name !== "" &&
    form.description !== "" &&
    form.price !== "" &&
    errors.name === "" &&
    errors.description === "" &&
    errors.price === "";

  return {
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
  };
}
