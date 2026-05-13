// App.jsx - React Router v6 기준 라우터 설정 예시
// npm install react-router-dom

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";       // index.html 마이그레이션
import ItemsPage from "./pages/ItemsPage";           // items.html 마이그레이션
import RegistrationPage from "./pages/RegistrationPage"; // 상품 등록
import ItemDetailPage from "./pages/ItemDetailPage"; // 빈 페이지

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 랜딩 */}
        <Route path="/" element={<LandingPage />} />

        {/* 중고마켓 - url path "/items" */}
        <Route path="/items" element={<ItemsPage />} />

        {/* 상품 등록 - url path "/registration" */}
        <Route path="/registration" element={<RegistrationPage />} />

        {/* 상품 상세 (등록 성공 시 이동, 현재 빈 페이지) */}
        <Route path="/items/:id" element={<ItemDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

/*
──────────────────────────────────────────────────────────────
폴더 구조 권장
──────────────────────────────────────────────────────────────
src/
 ┣ hooks/
 │   └── useRegistrationForm.js   ← Custom Hook (유효성 검사)
 ┣ pages/
 │   ├── LandingPage.jsx
 │   ├── ItemsPage.jsx
 │   ├── RegistrationPage.jsx     ← 상품 등록 페이지
 │   └── ItemDetailPage.jsx       ← 빈 페이지
 ┣ components/
 │   └── GNB.jsx                  ← 공통 네비게이션 바
 ┗ App.jsx

──────────────────────────────────────────────────────────────
.env 설정 (Vite 기준)
──────────────────────────────────────────────────────────────
VITE_API_BASE_URL=https://your-render-app.onrender.com

──────────────────────────────────────────────────────────────
ItemsPage에서 상품 등록하기 버튼 → navigate 연결
──────────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
<button onClick={() => navigate("/registration")}>상품 등록하기</button>

──────────────────────────────────────────────────────────────
중고마켓 네비게이션 active 색상 (#3692FF)
──────────────────────────────────────────────────────────────
import { NavLink } from "react-router-dom";

<NavLink
  to="/items"
  style={({ isActive }) => ({
    color: isActive ? "#3692FF" : "#6b7280",
    fontWeight: isActive ? 700 : 500,
  })}
>
  중고마켓
</NavLink>
*/
