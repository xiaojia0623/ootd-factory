import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import TopButton from '../../components/TopButton';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const VITE_PATH = import.meta.env.VITE_API_PATH;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const coupons = ['OOTD200']; // 手動設定
  const [copiedCode, setCopiedCode] = useState('');

  const getProducts = async () => {
    try {
      const productRes = await axios.get(`/v2/api/${VITE_PATH}/products`);
      const allProducts = Object.values(productRes.data.products);

      // 價格排序 + 取前4個
      const topProducts = allProducts
        .sort((a, b) => b.price - a.price)
        .slice(0, 4);

      setProducts(topProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleSubscribe = e => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <>
      <div className='container '>
        <div className='row flex-md-row-reverse flex-column-reverse align-items-center py-5 home-top-intro  shadow mb-5'>
          {/* 產品圖片區 */}
          <div className='col-md-6'>
            <div className='card border-0 shadow-sm p-4 bg-light'>
              <h3 className='fw-bold text-orange mb-3'>🎉 優惠券活動，即日起到 5/25 !!!</h3>
              <p className='mb-3'>複製以下優惠碼，到 <strong>購物車</strong> 輸入即可享折扣：</p>
              <ul className='list-unstyled'>
                {coupons.map((coupon, index) => (
                  <li key={coupon.code || index} className='mb-0'>
                    <div className='d-flex align-items-center mb-1'>
                      <code
                        className='bg-white border rounded px-3 py-2 me-2 text-primary fw-bold'
                        style={{ userSelect: 'text', fontSize: '1.1rem' }}
                      >
                        {coupons}
                      </code>
                      <CopyToClipboard text={coupon.code} onCopy={() => setCopiedCode(coupon.code)}>
                        <button className='btn btn-sm btn-outline-orange'>
                          {copiedCode === coupon.code ? '已複製' : '複製'}
                        </button>
                      </CopyToClipboard>
                    </div>
                    <div className='text-muted ms-1'>
                      {coupon.title}
                      {coupon.due_date && (
                        <span className='ms-2'>
                          （有效期限：{new Date(coupon.due_date * 1000).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 文字區 */}
          <div className='col-md-6 home-banner d-flex flex-column justify-content-center mt-md-0 mt-4 text-center text-md-left'>
            <h2 className='fw-bold '>找到你的完美穿搭</h2>
            <h3 className='font-weight-normal mt-3  fw-bold' style={{textShadow: '-1px -1px white, 1px 1px #333'}}>
              探索為各種場合精心挑選的時尚穿搭，
              <br />
              專屬為你打造。尋找本季最佳造型！
            </h3>

            {/* 搜尋框 */}
            <div className='input-group mb-4 mt-4'>
              <input
                type='text'
                className='form-control rounded-0'
                placeholder='Search for outfits...'
              />
              <div className='input-group-append'>
                <button className='btn rounded-0' type='button'>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='home-product-list'>
          <h3 className='mb-3 fw-bold'>推薦商品</h3>
          <div className='more-button'>
            <Link
              to='/products'
              className=' text-decoration-none btn btnLink'
            >
              看更多 <span className='arrow'> ➔</span>
            </Link>
          </div>
          <div className='row home-middle-card'>
            {/* 單個卡片區域 */}
            {products.map(product => (
              <div className='col-md-6 mt-md-4 ' key={product.id}>
                <div className='card border-0 mb-4 position-relative'>
                  <img
                    src={
                      product.imageUrl || 'https://via.placeholder.com/400x300'
                    }
                    className='card-img-top rounded-0'
                    alt={product.title}
                    style={{ height: '478px', objectFit: 'cover' }}
                  />
                  <div
                    className='card-body p-3 rounded-bottom'
                    style={{ background: '#dfdcd9' }}
                  >
                    <h4 className='mb-0 mt-3'>
                      <Link
                        className='text-decoration-none fw-bold fs-4'
                        to={`/product/${product.id}`}
                      >
                        {product.title}
                      </Link>
                    </h4>
                    <div className='d-flex justify-content-between mt-3'>
                      <p className='card-text fw-bold mb-0 fs-5'>
                        NT${product.price.toLocaleString()}
                      </p>
                      <Link
                        className='btn rounded-0 text-nowrap '
                        to={`/product/${product.id}`}
                      >
                        查看商品
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className='my-3 fw-bold text-center text-primary'>買過的人都說讚！</h3>
      <p className='text-center text-muted'>來看看大家的穿搭分享與真實心得</p>
      <div className='bg-light mt-7 pb-5'>
        <div className='container'>
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            modules={[Pagination]}
            className='homeSwiper'
            pagination={{
              clickable: true,
            }}
          >
            {/* 第一則評價 */}
            <SwiperSlide>
              <div className='row justify-content-center py-7' style={{padding: '30px 0'}}>
                <div className='col-md-8 d-flex'>
                  <img
                    src='https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D'
                    alt=''
                    className='rounded-circle me-5'
                    style={{
                      width: '160px',
                      height: '160px',
                      objectFit: 'cover',
                    }}
                  />
                  <div className='d-flex flex-column'>
                    <p className='h5'>
                      "我真的很喜歡這個產品！品質非常好，使用起來也很方便，完全超過了我的預期。我一定會再次購買，也會推薦給我的朋友們！"
                    </p>
                    <p className='mt-auto text-muted'>"非常滿意，強烈推薦！"</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* 第二則評價 */}
            <SwiperSlide>
              <div className='row justify-content-center py-7' style={{padding: '30px 0'}}>
                <div className='col-md-8 d-flex'>
                  <img
                    src='https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D'
                    alt=''
                    className='rounded-circle me-5'
                    style={{
                      width: '160px',
                      height: '160px',
                      objectFit: 'cover',
                    }}
                  />
                  <div className='d-flex flex-column'>
                    <p className='h5'>
                      "這款產品非常棒！包裝精美，開箱的時候給我帶來了很大的驚喜。它的設計很時尚，而且使用起來非常順手。價格也很實惠，絕對物超所值！"
                    </p>
                    <p className='mt-auto text-muted'>"設計精美，性價比高！"</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* 第三則評價 */}
            <SwiperSlide>
              <div className='row justify-content-center py-7' style={{padding: '30px 0'}}>
                <div className='col-md-8 d-flex'>
                  <img
                    src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D'
                    alt=''
                    className='rounded-circle me-5'
                    style={{
                      width: '160px',
                      height: '160px',
                      objectFit: 'cover',
                    }}
                  />
                  <div className='d-flex flex-column'>
                    <p className='h5'>
                      "非常滿意！這是我最近買過的最好的商品之一。質量上乘，細節處理得很到位，完全符合我的需求。這次購物體驗超級愉快，已經迫不及待想要再買更多！"
                    </p>
                    <p className='mt-auto text-muted'>"質量一流，超值購買！"</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

    <div style={{ backgroundColor: '#1E1E1E' }}>
        <div
            className='container py-5'
        >
            <div className='row text-center text-white'>
            <div className='col-md-4'>
                <i
                className='bi bi-stars display-4 mb-3'
                style={{ color: '#FF6B00' }}
                ></i>
                <h4 className='mt-3'>每日穿搭靈感</h4>
                <p className='text-light'>
                我們每日精選時下流行單品與搭配建議，幫助你輕鬆打造專屬風格，不再煩惱該穿什麼。
                </p>
            </div>
            <div className='col-md-4'>
                <i
                className='bi bi-person-heart display-4 mb-3'
                style={{ color: '#FF6B00' }}
                ></i>
                <h4 className='mt-3'>風格設計師群</h4>
                <p className='text-light'>
                由專業造型師與設計師組成團隊，每一件商品都經過精心挑選，呈現最佳穿搭提案。
                </p>
            </div>
            <div className='col-md-4'>
                <i
                className='bi bi-truck display-4 mb-3'
                style={{ color: '#FF6B00' }}
                ></i>
                <h4 className='mt-3'>快速出貨保證</h4>
                <p className='text-light'>
                所有商品皆於 24
                小時內出貨，並提供追蹤服務，確保你能在最短時間收到心儀的商品。
                </p>
            </div>
            </div>
        </div>
    </div>

      <section className='home-subscrib bg-dark text-white py-5'>
        <div className='container text-center'>
          <div className='mb-4'>
            <h2 className='h3 mb-3'>穿搭靈感，每週直送信箱</h2>
            <p className='mb-2'>
              加入 OOTD 工廠電子報，掌握最新穿搭趨勢、獨家優惠與戶外靈感。
            </p>
            {!submitted && (<>
              <p className='text-warning m-0'>
                訂閱即享首次購物 <strong>95折優惠碼</strong>
              </p>
              <form
                onSubmit={handleSubscribe}
                className='d-flex justify-content-center align-items-center mx-auto'
              >
                <input
                  type='email'
                  className='form-control p-3 rounded-0'
                  placeholder='輸入你的 Email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', border: 'none' }}
                />
                <button
                  type='submit'
                  className='btn p-3 rounded-0'
                  style={{
                    backgroundColor: '#FF6B00',
                    color: '#fff',
                    width: '30%',
                    border: 'none',
                  }}
                >
                  {submitted ? '已訂閱' : '訂閱'}
                </button>
              </form>
            </>

            )}
          </div>

        </div>
      </section>
      <TopButton />
    </>
  );
};

export default Home;
