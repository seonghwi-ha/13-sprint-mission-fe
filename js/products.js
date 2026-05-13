const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const prisma = require("../lib/prisma");
const { AppError } = require("../middleware/errorHandler");

const router = express.Router();

/**
 * 유효성 검사 결과 처리 헬퍼
 */
function validate(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    throw new AppError(messages.join(", "), 400);
  }
}

// ─────────────────────────────────────────────
// POST /products - 상품 등록
// ─────────────────────────────────────────────
router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("상품명을 입력해 주세요.")
      .isLength({ max: 100 })
      .withMessage("상품명은 100자 이내로 입력해 주세요."),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("상품 설명을 입력해 주세요."),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("가격은 0 이상의 숫자여야 합니다."),
    body("tags")
      .optional()
      .isArray()
      .withMessage("태그는 배열 형식이어야 합니다."),
    body("tags.*")
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage("태그는 빈 문자열일 수 없습니다."),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("재고는 0 이상의 정수여야 합니다."),
    body("imageUrl")
      .optional()
      .isURL()
      .withMessage("올바른 이미지 URL을 입력해 주세요."),
  ],
  async (req, res, next) => {
    try {
      validate(req);

      const { name, description, price, tags = [], stock, imageUrl } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          tags,
          ...(stock !== undefined && { stock }),
          ...(imageUrl && { imageUrl }),
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          stock: true,
          imageUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  },
);

// ─────────────────────────────────────────────
// GET /products - 상품 목록 조회 (페이지네이션, 검색, 정렬)
// ─────────────────────────────────────────────
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("page는 1 이상의 정수여야 합니다.")
      .toInt(),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("limit은 1~100 사이의 정수여야 합니다.")
      .toInt(),
    query("orderBy")
      .optional()
      .isIn(["recent"])
      .withMessage("정렬 기준은 'recent'만 지원합니다."),
    query("keyword")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage("검색어는 100자 이내여야 합니다."),
  ],
  async (req, res, next) => {
    try {
      validate(req);

      const page = req.query.page ?? 1;
      const limit = req.query.limit ?? 10;
      const orderBy = req.query.orderBy ?? "recent";
      const keyword = req.query.keyword ?? "";

      const skip = (page - 1) * limit;

      // 검색 조건 (name 또는 description에 keyword 포함)
      const where = {
        isActive: true,
        ...(keyword && {
          OR: [
            { name: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
          ],
        }),
      };

      // 정렬 조건
      const orderByClause =
        orderBy === "recent" ? { createdAt: "desc" } : { createdAt: "desc" };

      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy: orderByClause,
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            price: true,
            createdAt: true,
          },
        }),
        prisma.product.count({ where }),
      ]);

      return res.status(200).json({
        data: products,
        pagination: {
          list: products,
          totalCount: totalCount,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// ─────────────────────────────────────────────
// GET /products/:id - 상품 상세 조회
// ─────────────────────────────────────────────
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("상품 ID가 필요합니다.")],
  async (req, res, next) => {
    try {
      validate(req);

      const product = await prisma.product.findFirst({
        where: {
          id: req.params.id,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          stock: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!product) {
        throw new AppError("존재하지 않는 상품입니다.", 404);
      }

      return res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  },
);

// ─────────────────────────────────────────────
// PATCH /products/:id - 상품 수정
// ─────────────────────────────────────────────
router.patch(
  "/:id",
  [
    param("id").notEmpty().withMessage("상품 ID가 필요합니다."),
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("상품명을 입력해 주세요.")
      .isLength({ max: 100 })
      .withMessage("상품명은 100자 이내로 입력해 주세요."),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("상품 설명을 입력해 주세요."),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("가격은 0 이상의 숫자여야 합니다."),
    body("tags")
      .optional()
      .isArray()
      .withMessage("태그는 배열 형식이어야 합니다."),
    body("tags.*")
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage("태그는 빈 문자열일 수 없습니다."),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("재고는 0 이상의 정수여야 합니다."),
    body("imageUrl")
      .optional()
      .isURL()
      .withMessage("올바른 이미지 URL을 입력해 주세요."),
  ],
  async (req, res, next) => {
    try {
      validate(req);

      // 수정 가능한 필드만 추출
      const allowedFields = [
        "name",
        "description",
        "price",
        "tags",
        "stock",
        "imageUrl",
      ];
      const updateData = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        throw new AppError("수정할 데이터를 입력해 주세요.", 400);
      }

      // 존재 여부 확인
      const exists = await prisma.product.findFirst({
        where: { id: req.params.id, isActive: true },
        select: { id: true },
      });

      if (!exists) {
        throw new AppError("존재하지 않는 상품입니다.", 404);
      }

      const updated = await prisma.product.update({
        where: { id: req.params.id },
        data: updateData,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          stock: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },
);

// ─────────────────────────────────────────────
// DELETE /products/:id - 상품 삭제 (소프트 삭제)
// ─────────────────────────────────────────────
router.delete(
  "/:id",
  [param("id").notEmpty().withMessage("상품 ID가 필요합니다.")],
  async (req, res, next) => {
    try {
      validate(req);

      const exists = await prisma.product.findFirst({
        where: { id: req.params.id, isActive: true },
        select: { id: true },
      });

      if (!exists) {
        throw new AppError("존재하지 않는 상품입니다.", 404);
      }

      // 소프트 삭제: isActive = false
      await prisma.product.update({
        where: { id: req.params.id },
        data: { isActive: false },
      });

      return res.status(200).json({ message: "상품이 삭제되었습니다." });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
