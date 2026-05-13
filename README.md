# 중고마켓 백엔드 API

Express + Prisma로 구현한 중고마켓 REST API 서버입니다.

## 기술 스택

- **Runtime**: Node.js
- **Framework**: Express
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: express-validator

---

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일을 만들고, 값을 설정합니다.

```bash
cp .env.example .env
```

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/market_db"
CORS_ORIGIN=http://localhost:3000
```

### 3. DB 마이그레이션 & Prisma Client 생성

```bash
npm run db:migrate   # 마이그레이션 실행
npm run db:generate  # Prisma Client 생성
```

### 4. 서버 실행

```bash
npm start       # 프로덕션
npm run dev     # 개발 (nodemon 필요)
```

---

## API 명세

### Base URL

```
http://localhost:3000
```

---

### 상품 등록

```
POST /products
```

**Request Body**

| 필드        | 타입     | 필수 | 설명          |
|-------------|----------|------|---------------|
| name        | string   | ✅   | 상품명 (100자 이내) |
| description | string   | ✅   | 상품 설명     |
| price       | number   | ✅   | 가격 (0 이상) |
| tags        | string[] | ❌   | 태그 배열     |
| stock       | number   | ❌   | 재고 (기본 0) |
| imageUrl    | string   | ❌   | 이미지 URL    |

**Response** `201 Created`

```json
{
  "id": "clx...",
  "name": "아이폰 14",
  "description": "깨끗하게 사용했습니다.",
  "price": "800000.00",
  "tags": ["전자기기", "애플"],
  "stock": 1,
  "imageUrl": null,
  "isActive": true,
  "createdAt": "2026-05-08T00:00:00.000Z",
  "updatedAt": "2026-05-08T00:00:00.000Z"
}
```

---

### 상품 목록 조회

```
GET /products
```

**Query Parameters**

| 파라미터 | 타입   | 기본값 | 설명                          |
|----------|--------|--------|-------------------------------|
| page     | number | 1      | 페이지 번호                   |
| limit    | number | 10     | 페이지당 항목 수 (최대 100)   |
| orderBy  | string | recent | 정렬 기준 (`recent`)          |
| keyword  | string | -      | name/description 검색어       |

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "clx...",
      "name": "아이폰 14",
      "price": "800000.00",
      "createdAt": "2026-05-08T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

### 상품 상세 조회

```
GET /products/:id
```

**Response** `200 OK`

```json
{
  "id": "clx...",
  "name": "아이폰 14",
  "description": "깨끗하게 사용했습니다.",
  "price": "800000.00",
  "tags": ["전자기기"],
  "stock": 1,
  "imageUrl": null,
  "createdAt": "2026-05-08T00:00:00.000Z",
  "updatedAt": "2026-05-08T00:00:00.000Z"
}
```

---

### 상품 수정

```
PATCH /products/:id
```

변경할 필드만 선택적으로 전송합니다. (`name`, `description`, `price`, `tags`, `stock`, `imageUrl`)

**Response** `200 OK` — 수정된 상품 객체 반환

---

### 상품 삭제

```
DELETE /products/:id
```

> 소프트 삭제 방식 (`isActive = false`)으로 처리합니다.

**Response** `200 OK`

```json
{ "message": "상품이 삭제되었습니다." }
```

---

## 에러 응답 형식

```json
{ "message": "에러 메시지" }
```

| 상태 코드 | 설명                  |
|-----------|-----------------------|
| 400       | 잘못된 요청 (유효성 검사 실패) |
| 404       | 리소스 없음           |
| 409       | 중복 데이터           |
| 500       | 서버 내부 오류        |
