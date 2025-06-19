import { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import { Link, useOutletContext } from 'react-router-dom';
import { flyToCart } from '../../components/flyToCart';
import TopButton from '../../components/TopButton';
import { toast } from 'react-hot-toast';
import ToastAlert from '../../components/ToastAlert';
import {
  MessageContext,
  handleErrorMessage,
} from '../../redux/messageStore';

const VITE_PATH = import.meta.env.VITE_API_PATH;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectCategory, setSelectCategory] = useState('全部');
  const [allCategories, setAllCategories] = useState(['全部']);
  const [isLoading, setIsLoading] = useState(false);
  const { getCart } = useOutletContext();
  const imgRefs = useRef({});
  const { dispatch} = useContext(MessageContext);

  const getProducts = async (page = 1) => {
    setIsLoading(true);
    const res = await axios.get(`/v2/api/${VITE_PATH}/products?page=${page}`);
    setProducts(res.data.products);
    setPagination(res.data.pagination);
    setIsLoading(false);
  };

  const getAllProducts = async () => {
    const res = await axios.get(`/v2/api/${VITE_PATH}/products/all`);
    const products = res.data.products || []; // 防止 undefined
    setAllProducts(products);
    const categories = [
      '全部',
      ...new Set(products.map(p => p.category || '未分類')), // 防止 category 為 undefined
    ];
    setAllCategories(categories);
  };

  useEffect(() => {
    getProducts(1);
    getAllProducts();
  }, []);

  // 當前顯示的產品
  const currentDisplayProducts =
    selectCategory === '全部'
      ? products
      : allProducts.filter(p => p.category === selectCategory);

  const addCart = async product => {
    const data = {
      data: {
        product_id: product.id,
        qty: 1,
      },
    };
    setIsLoading(true);
    try {
      await toast.promise(axios.post(`/v2/api/${VITE_PATH}/cart`, data), {
        loading: '加入中...',
        success: '加入購物車成功',
        error: '加入失敗',
      });

      getCart();
    } catch (error) {
      handleErrorMessage(dispatch, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = product => {
    const imgEl = imgRefs.current[product.id];
    if (imgEl) {
      flyToCart(imgEl);
    }
    addCart(product);
  };

  return (
    <>
      <div className='container mt-md-5 mt-3 mb-7 d-flex full-height position-relative top-0'>
        <Loading isLoading={isLoading} />

        <div className='row w-100 m-0 category-products'>
          <div className='col-12 col-md-3 item-category'>
            <div className='row'>
              <div className='col  col-md-12 col-lg-8'>
                <ul className='list-unstyled'>
                  {allCategories.map(category => (
                    <li key={category} className='mb-3'>
                      <button
                        type='button'
                        className={`category-button w-100 ${
                          selectCategory === category ? 'active' : ''
                        }`}
                        onClick={() => setSelectCategory(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-9 item-list product-cards mb-5'>
            <div className='row mb-3'>
              {currentDisplayProducts.map(product => {
                return (
                  <div className='col-6  col-md-6 col-lg-4' key={product.id}>
                    <div className='card border-0 mb-4 position-relative position-relative shadow'>
                      <img
                        src={product.imageUrl}
                        ref={el => (imgRefs.current[product.id] = el)}
                        className='card-img-top rounded-0 object-cover'
                        alt={product.title}
                        height={300}
                      />
                      <div className='card-body p-0'>
                        <h4 className='mb-0 mt-3 '>
                          <Link
                            to={`/product/${product.id}`}
                            className='text-decoration-none px-2'
                          >
                            {product.title}
                          </Link>
                        </h4>
                        <h5 className='text-muted mt-3 px-2 fw-bold'>
                          NT$ {product.price.toLocaleString()}
                        </h5>
                      </div>
                      <div className='card-btns d-flex justify-content-between align-items-center text-center'>
                        <Link
                          to={`/product/${product.id}`}
                          type='button'
                          className='text-decoration-none px-md-3 py-md-2  text-hover '
                        >
                          查看產品
                        </Link>
                        <button
                          type='button'
                          className='btn btn-primary'
                          onClick={() => handleAddToCart(product)}
                          disabled={isLoading}
                        >
                          加入購物車
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <ToastAlert />
            {selectCategory === '全部' && (
              <nav className='d-flex justify-content-center m-0'>
                <Pagination pagination={pagination} changePage={getProducts} />
              </nav>
            )}
          </div>
        </div>
      </div>
      <TopButton />
    </>
  );
};

export default Products;
