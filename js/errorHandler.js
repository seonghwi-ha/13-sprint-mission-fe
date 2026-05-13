const { Prisma } = require("@prisma/client");

/**
 * 커스텀 에러 클래스
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

/**
 * 전역 에러 핸들러 미들웨어
 */
function errorHandler(err, req, res, next) {
  // Prisma 에러 처리
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "리소스를 찾을 수 없습니다.",
      });
    }
    if (err.code === "P2002") {
      return res.status(409).json({
        message: "이미 존재하는 데이터입니다.",
      });
    }
  }

  // 유효성 검사 에러
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // 예상치 못한 서버 에러
  console.error("Unexpected error:", err);
  return res.status(500).json({
    message: "서버 내부 오류가 발생했습니다.",
  });
}

module.exports = { errorHandler, AppError };
