"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getArticles, getBestArticles } from "../../src/api/articleApi";
import ArticleCard from "../../src/components/ArticleCard";
import BestArticles from "../../src/components/BestArticles";

export default function CommunityPage() {
  const [articles, setArticles] = useState([]);
  const [bestArticles, setBestArticles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadBest() {
      try {
        const data = await getBestArticles();
        setBestArticles(data?.articles || []);
      } catch (err) {
        console.error("베스트 게시글 로드 실패:", err.message);
      }
    }
    loadBest();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchText);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        const data = await getArticles({ keyword, sort, limit: 10 });
        setArticles(data?.articles || []);
      } catch (err) {
        alert("게시글 로드 실패: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [keyword, sort]);

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <BestArticles articles={bestArticles} />

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">게시글</h2>
          <Link
            href="/community/write"
            className="rounded-lg bg-panda-primary px-6 py-3 font-semibold text-white transition hover:bg-panda-hover active:bg-panda-active"
          >
            글쓰기
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <div className="flex h-[42px] flex-1 items-center gap-2 rounded-xl bg-gray-100 px-4">
            <span>🔍</span>
            <input
              className="w-full bg-transparent text-[15px] outline-none"
              type="text"
              placeholder="검색할 게시글을 입력해주세요"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <select
            className="h-[42px] rounded-xl border border-gray-200 bg-white px-4 text-[15px]"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recent">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-400">게시글을 불러오는 중입니다...</div>
        ) : articles.length > 0 ? (
          <div className="flex flex-col">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-400">게시글이 없습니다.</div>
        )}
      </section>
    </main>
  );
}
