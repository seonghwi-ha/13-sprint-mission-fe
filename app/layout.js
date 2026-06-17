import Gnb from "../src/components/Gnb";
import Footer from "../src/components/Footer";
import "../src/styles/globals.css";

export const metadata = {
  title: "판다마켓",
  description: "일상의 모든 물건을 거래해 보세요",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white font-pretendard text-gray-700">
        <Gnb />
        {children}
        <Footer />
      </body>
    </html>
  );
}
