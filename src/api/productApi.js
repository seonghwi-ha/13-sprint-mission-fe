const BASE_URL = 'https://panda-market-api.vercel.app';

/**
 * 상품 목록 조회
 * @param {Object} params - { page, pageSize, orderBy, keyword }
 */
export function getProducts({ page = 1, pageSize = 10, orderBy = 'recent', keyword = '' } = {}) {
  const params = new URLSearchParams({ page, pageSize, orderBy });
  if (keyword) params.append('keyword', keyword);

  return fetch(`${BASE_URL}/products?${params}`)
    .then((res) => {
      if (!res.ok) throw new Error(`상품 목록 조회 실패: ${res.status}`);
      return res.json();
    })
    .catch((err) => {
      console.error('getProducts 오류:', err);
      throw err;
    });
}
