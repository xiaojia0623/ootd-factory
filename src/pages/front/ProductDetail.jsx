import {useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { flyToCart } from '../../components/flyToCart';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css';
import { toast } from 'react-hot-toast';
import {
  MessageContext,
  handleErrorMessage,
} from '../../redux/messageStore';

const VITE_PATH = import.meta.env.VITE_API_PATH;

const ProductDetail = () => {
    const [product, setProduct] = useState({});
    //購物車數量
    const [cartQuantity, setCartQuantity] = useState(1);
    const {id} = useParams();
    const [selectedImg, setSelectedImg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [topProducts, setTopProducts] = useState([]);
    const { getCart } = useOutletContext();
    const imgRef = useRef(null);

    const { dispatch} = useContext(MessageContext);

    const getProduct = async(id) => {
        const productRes = await axios.get(
          `/v2/api/${VITE_PATH}/product/${id}`
        );
        setProduct(productRes.data.product);
        setSelectedImg(productRes.data.product.imageUrl); // 預設大圖是主圖
    }

    useEffect(() => {
            getProduct(id);
    },[id])

    const addCart = async() => {
        const data = {
            data: {
                product_id: product.id,
                qty: cartQuantity
            }
        }
        setIsLoading(true);
        try{
            await toast.promise(axios.post(`/v2/api/${VITE_PATH}/cart`, data), {
                loading: '加入中...',
                success: '加入購物車成功',
                error: '加入失敗',
            });
            getCart();
        }catch(error){
            handleErrorMessage(dispatch, error);
        }finally{
            setIsLoading(false)
        }
    }

    const handleAddToCcart = () => {
        flyToCart(imgRef.current);
        addCart(product);
    };

    useEffect(() => {
        const getAllProducts = async () => {
        try {
            const res = await axios.get(`/v2/api/${VITE_PATH}/products/all`);
            const allProducts = Object.values(res.data.products);

            // 依價格排序（高到低），並取前10
            const sorted = allProducts
            .sort((a, b) => b.price - a.price)
            .slice(0, 10);

            setTopProducts(sorted);
        } catch (error) {
            console.error('取得所有產品失敗', error);
        }
        };

        getAllProducts();
    }, []);


  return (
    <div className='container full-height product-detail-container'>
        <nav aria-label="breadcrumb" className='my-5'>
            <ol className="breadcrumb fw-bold m-0">
                <li className="breadcrumb-item"><Link to="/" className='fs-5 text-decoration-none'>首頁</Link></li>
                <li className="breadcrumb-item"><Link to="/products" className='fs-5 text-decoration-none'>產品列表</Link></li>
                <li className="breadcrumb-item active fs-5" aria-current="page">產品資訊 - {product.title}</li>
            </ol>
        </nav>

        <div className="row">
            {/* 左邊小圖 */}
            <div className="col-md-2 d-flex flex-column gap-2 product-detail-picSmall">
                {[product.imageUrl, ...(product.imagesUrl || [])].map((img, idx) => (
                    <div
                    key={idx}
                    style={{
                        height: '100px',
                        overflow: 'hidden',
                        border: selectedImg === img ? '2px solid #FF6B00' : '1px solid #ccc',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                    }}
                    onClick={() => setSelectedImg(img)}
                    >
                    <img
                        src={img}
                        alt={`thumb-${idx}`}
                        style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        }}
                    />
                    </div>
                ))}
            </div>

            {/* 右邊大圖 */}
            <div className="col-md-5 product-detail-picBig">
                {selectedImg && (
                    <div
                    style={{
                        width: '100%',
                        height: '425px',
                        overflow: 'hidden',
                        borderRadius: '0.5rem',
                    }}
                    >
                    <img
                        ref={imgRef}
                        src={selectedImg}
                        alt="selected"
                        style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        }}
                    />
                    </div>
                )}
            </div>

            {/* 商品資訊 */}
            <div className="col-md-5">
                <h2>{product.title}</h2>
                <h4 className="text-danger mb-3">NT$ {product.price?.toLocaleString()} <span className='fs-5 text-muted text-decoration-line-through'>NT$ {product.origin_price?.toLocaleString()}</span></h4>
                <p className="text-muted">{product.content}</p>
                <p className="text-muted">{product.description}</p>

                <label htmlFor="quantity" className="form-label">數量</label>
                <select
                    id="quantity"
                    className="form-select mb-3"
                    value={cartQuantity}
                    onChange={(e) => setCartQuantity(Number(e.target.value))}
                >
                    {[...Array(10).keys()].map(i => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>

                <button
                    className="btn btnLink btn-primary text-white"
                    onClick={handleAddToCcart}
                    disabled={isLoading}
                >
                    {isLoading ? '加入中...' : '加入購物車'}
                </button>
                </div>
        </div>
        <div className='py-5'>
            <h3 className="mb-3">🔥 熱門推薦商品</h3>
            <Swiper
                spaceBetween={20}
                slidesPerView={2}
                navigation={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                className="detailSwiper"
                modules={[Autoplay, Navigation]}
                breakpoints={{
                    576: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    992: { slidesPerView: 4 },
                    1200: { slidesPerView: 5 },
                }}
                >
                {topProducts.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div className="card h-100 shadow-sm">
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="card-img-top"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body border-bottom">
                                <h6 className="card-title"><Link to={`/product/${item.id}`} className='swiper-title text-dark text-decoration-none fs-5'>{item.title}</Link></h6>
                                <p className="card-text text-danger fw-bold">$ {item.price?.toLocaleString()}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    </div>
  )
}

export default ProductDetail

