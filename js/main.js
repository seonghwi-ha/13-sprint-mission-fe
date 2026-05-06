import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./ArticleService.js";

import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./ProductService.js";

// Article 테스트
createArticle({
  title: "테스트 제목",
  content: "테스트 내용",
  // image: "",
}).then((created) => {
  console.log("게시글 생성:", created);

  return getArticle(created.id)
    .then((data) => {
      console.log("게시글 조회:", data);
      return created.id;
    })
    .then((id) => patchArticle(id, { title: "수정된 제목" }))
    .then((data) => {
      console.log("게시글 수정:", data);
      return created.id;
    })
    .then((id) => deleteArticle(id))
    .then((data) => {
      console.log("게시글 삭제:", data);
    });
});

// Product 테스트
(async () => {
  const created = await createProduct({
    name: "테스트 상품",
    description: "설명",
    price: 10000,
    tags: ["테스트"],
    images: ["https://picsum.photos/200"],
  });

  console.log("상품 생성:", created);

  const id = created.id;

  const product = await getProduct(id);
  console.log("상품 조회:", product);

  const updated = await patchProduct(id, { price: 20000 });
  console.log("상품 수정:", updated);

  const list = await getProductList({ page: 1, pageSize: 5 });
  console.log("상품 목록:", list);

  const deleted = await deleteProduct(id);
  console.log("상품 삭제:", deleted);
})();
