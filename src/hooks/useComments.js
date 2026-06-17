import { useState, useEffect, useCallback } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../api/articleApi";

export function useComments(articleId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadComments = useCallback(async () => {
    if (!articleId) return;

    try {
      setLoading(true);
      const data = await getComments(articleId, { limit: 50 });
      setComments(data?.data || []);
    } catch (err) {
      console.error("댓글 로드 실패:", err.message);
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const addComment = useCallback(
    async (content) => {
      try {
        await createComment(articleId, content);
        await loadComments();
      } catch (err) {
        alert("댓글 등록 실패: " + err.message);
      }
    },
    [articleId, loadComments]
  );

  const editComment = useCallback(
    async (commentId, content) => {
      try {
        await updateComment(commentId, content);
        await loadComments();
      } catch (err) {
        alert("댓글 수정 실패: " + err.message);
      }
    },
    [loadComments]
  );

  const removeComment = useCallback(
    async (commentId) => {
      try {
        await deleteComment(commentId);
        await loadComments();
      } catch (err) {
        alert("댓글 삭제 실패: " + err.message);
      }
    },
    [loadComments]
  );

  return { comments, loading, addComment, editComment, removeComment };
}
