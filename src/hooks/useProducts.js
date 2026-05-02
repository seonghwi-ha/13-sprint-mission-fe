import { useState, useEffect } from 'react';
import { getProducts } from '../api/productApi';
import useWindowSize from './useWindowSize';

function getPageSize(type, width) {
  if (type === 'best') {
    if (width <= 767) return 1;
    if (width <= 1199) return 2;
    return 4;
  }
  if (width <= 767) return 4;
  if (width <= 1199) return 6;
  return 10;
}

export function useBestProducts() {
  const width = useWindowSize();
  const pageSize = getPageSize('best', width);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts({ page: 1, pageSize, orderBy: 'favorite' })
      .then((data) => { setProducts(data.list || []); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [pageSize]);

  return { products, loading, error };
}

export function useSaleProducts({ page, orderBy, keyword }) {
  const width = useWindowSize();
  const pageSize = getPageSize('sale', width);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts({ page, pageSize, orderBy, keyword })
      .then((data) => { setProducts(data.list || []); setTotalCount(data.totalCount || 0); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [page, pageSize, orderBy, keyword]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  return { products, totalCount, totalPages, pageSize, loading, error };
}
