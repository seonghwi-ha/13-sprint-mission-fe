import { useState } from "react";

export function useArticleForm(initialValues = { title: "", content: "" }) {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);

  const isValid = title.trim() !== "" && content.trim() !== "";

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

  const getValues = () => ({
    title: title.trim(),
    content: content.trim(),
  });

  const reset = () => {
    setTitle("");
    setContent("");
  };

  return {
    title,
    content,
    isValid,
    handleTitleChange,
    handleContentChange,
    getValues,
    reset,
    setTitle,
    setContent,
  };
}
