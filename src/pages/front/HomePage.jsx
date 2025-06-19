import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link, useLocation } from 'react-router-dom';
import TopButton from '../../components/TopButton';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const VITE_PATH = import.meta.env.VITE_API_PATH;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const coupons = ['OOTD200']; // 手動設定
    const [copiedCode, setCopiedCode] = useState('');
    const location = useLocation();

    useEffect(() => {
      // 等待渲染完成後滾動
      if (location.hash) {
        const target = document.querySelector(location.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, [location]);


    const getProducts = async () => {
        try {
            const productRes = await axios.get(`/v2/api/${VITE_PATH}/products`);
            const allProducts = Object.values(productRes.data.products);

            // 價格排序 + 取前4個
            const topProducts = allProducts.sort((a, b) => b.price - a.price).slice(0, 4);

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
            <div className='header_top_banner text-center mb-5'>
                <Swiper
                    className="headerBannerSwiper mb-5"
                    modules={[ Autoplay, Navigation, Pagination]}
                    effect={"fade"}
                    navigation={{ clickable: true }}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    >
                    <SwiperSlide>
                        <img src={new URL('@/assets/home-banner.png', import.meta.url).href} alt="banner1" />
                        <div className="banner_text bannner_text1">
                          <h3>NEW SEASON · NEW STYLE</h3>
                          <h4>換季新裝登場，展現專屬穿搭風格</h4>
                          <p>→ 適合搭配模特兒穿著本季最新時裝，背景用明亮色或城市街景。</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={new URL('@/assets/banner-2.jpg', import.meta.url).href} alt="banner2" />
                        <div className="banner_text bannner_text2">
                          <h3>SUMMER SALE 30% OFF</h3>
                          <h4>限時優惠，清爽穿搭全面出清</h4>
                          <p>→ 適合放在夏季促銷活動中，主打清涼感與大面折扣。</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="https://img.freepik.com/free-photo/close-up-young-man-blue-denim-shirt_23-2148130363.jpg?ga=GA1.1.1456518991.1750124134&semt=ais_hybrid&w=740" alt="banner3" />
                        <div className="banner_text bannner_text3">
                          <h3>TRENDING NOW · 時尚焦點</h3>
                          <h4>人氣單品 x 精選穿搭，讓你一眼吸睛</h4>
                          <p>→ 可搭配多位模特兒穿搭組合，展現潮流穿搭靈感。</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="https://img.freepik.com/premium-photo/refined-technique-beige-linen-shirt-inspired-by-balcomb-greene-andrew-hem_899449-418297.jpg?ga=GA1.1.1456518991.1750124134&semt=ais_hybrid&w=740" alt="banner4" />
                        <div className="banner_text bannner_text4">
                          <h3>MINIMAL LOOK · 簡約美學</h3>
                          <h4>極簡質感穿搭，讓風格回歸純粹</h4>
                          <p>→ 適合走極簡或中性風格，搭配淺色背景與簡約服飾。</p>
                        </div>
                    </SwiperSlide>
                </Swiper>

                <div className='home-banner-content mb-5'>
                    <h2 className='fw-bold'>找到你的完美穿搭</h2>
                    <h3 className='font-weight-normal mt-3 fw-bold'>
                        探索為各種場合精心挑選的時尚穿搭，
                        <br />
                        專屬為你打造。尋找本季最佳造型！
                    </h3>
                </div>
                <div className='home-banner-display-active d-flex flex-column justify-content-center align-items-center'>
                    <h2 className='fw-bold mb-3'>🎉 優惠券活動，即日起到 5/25 !!!</h2>
                    <p className='mb-3'>
                        複製以下優惠碼，到 <strong>購物車</strong> 輸入即可享折扣：
                    </p>
                    <ul className='list-unstyled '>
                        {coupons.map((coupon, index) => (
                            <li key={coupon.code || index} className='mb-0'>
                                <div className='d-flex align-items-center mb-1'>
                                    <code className='bg-white border rounded px-3 py-2 me-2 text-primary fw-bold fs-6'>
                                        {coupons}
                                    </code>
                                    <CopyToClipboard text={coupon.code} onCopy={() => setCopiedCode(coupon.code)}>
                                        <button className='btn btn-sm btn-outline-primary fs-5'>
                                            {copiedCode === coupon.code ? '已複製' : 'Copy'}
                                        </button>
                                    </CopyToClipboard>
                                </div>
                                <div className='text-muted ms-1'>
                                    {coupon.title}
                                    {coupon.due_date && (
                                        <span className='ms-2'>
                                            有效期限：{new Date(coupon.due_date * 1000).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            
            {/* 最新消息 */}
            <section  id='news'>
              <div className="home_news">
                <div className="container px-3">
                  <h3 className='mb-3 fw-bold text-primary'>最新消息</h3>
                  <ul>
                    <li>
                      <Link>2025.06.05 【夏季新品上市】全新涼感機能系列登場，穿出清爽時尚！立即前往新品區逛逛! </Link>
                    </li>
                    <li>
                      <Link>2025.06.01 【618限定活動】全館滿額現折，最高折 $500，最後三天！點我搶優惠</Link>
                    </li>
                    <li>
                      <Link>2025.05.15 【免運通知】即日起單筆消費滿 $1,200 即享免運優惠，全台適用！</Link>
                    </li>
                    <li>
                      <Link>2025.05.15 【熱銷排行更新】本週 TOP 5 必買單品出爐，快來看看大家都在買什麼！</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 新品上市 */}
            <div className='home-hot-newarrivel mb-5'>
                <div className='container'>
                    <h3 className='mb-3 fw-bold text-primary'>新品上市</h3>
                    <div className='row home-middle-card'>
                        {/* 新品卡片區域 */}
                        {products.map(product => (
                            <div className='col mt-md-4' key={product.id}>
                                <div className='card border-0 mb-4 position-relative'>
                                    <img
                                        src={product.imageUrl || 'https://via.placeholder.com/400x300'}
                                        className='card-img-top rounded-0'
                                        alt={product.title}
                                    />
                                    <div className='card-body p-3 rounded-bottom'>
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
                                                NT$ {product.price.toLocaleString()}
                                            </p>
                                            <Link className='btn rounded-0 text-nowrap' to={`/product/${product.id}`}>
                                                查看商品
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='more-button d-flex justify-content-center my-4'>
                        <Link to='/products' className=' text-decoration-none btn btnLink'>
                            看更多 <span className='arrow'> ➔</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* middle banner */}
            <div className='home_middle_banner'>
                <div className='middle_banner_image'>
                  <img src="https://img.freepik.com/free-photo/front-view-boy-with-anxiety-symptom_23-2148567345.jpg?ga=GA1.1.1456518991.1750124134&semt=ais_hybrid&w=740" alt="middle_banner" />
                  <div className='container text-center more-button middle_banner_content'>
                      <h2 className='fw-bold'>穿搭靈感，隨時隨地</h2>
                      <p className='mt-3'>
                          探索我們的穿搭指南，從日常休閒到正式場合，總有一款適合你。
                      </p>
                      <Link to='/products' className='btn btn-primary mt-4 btnLink mx-auto justify-content-center'>
                          立即探索<span className='arrow'> ➔</span>
                      </Link>
                  </div>
                </div>
            </div>

            <div className='home-features py-5'>
                <div className='container'>
                    <div className='row text-center text-white'>
                        <div className='col-md-4'>
                            <i className='bi bi-stars display-4 mb-3'></i>
                            <h4 className='mt-3'>每日穿搭靈感</h4>
                            <p className='text-light'>
                                我們每日精選時下流行單品與搭配建議，幫助你輕鬆打造專屬風格，不再煩惱該穿什麼。
                            </p>
                        </div>
                        <div className='col-md-4'>
                            <i className='bi bi-person-heart display-4 mb-3'></i>
                            <h4 className='mt-3'>風格設計師群</h4>
                            <p className='text-light'>
                                由專業造型師與設計師組成團隊，每一件商品都經過精心挑選，呈現最佳穿搭提案。
                            </p>
                        </div>
                        <div className='col-md-4'>
                            <i className='bi bi-truck display-4 mb-3'></i>
                            <h4 className='mt-3'>快速出貨保證</h4>
                            <p className='text-light'>
                                所有商品皆於 24 小時內出貨，並提供追蹤服務，確保你能在最短時間收到心儀的商品。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='customer_reviews py-2'>
              <h3 className='mt-5 fw-bold text-primary text-center'>買過的人都說讚！</h3>
              <p className='text-center text-dark fw-bold'>來看看大家的穿搭分享與真實心得</p>
              <div className='mt-7 pb-5'>
                  <div className='container'>
                      <Swiper
                          spaceBetween={30}
                          slidesPerView={1}
                          loop={true}
                          modules={[Pagination, Navigation]}
                          className='homeSwiper'
                          pagination={{
                              clickable: true,
                          }}
                          navigation={{
                              clickable: true,
                          }}
                      >
                          {/* 第一則評價 */}
                          <SwiperSlide>
                              <div className='row justify-content-center py-7'>
                                  <div className='col-md-8 d-flex'>
                                      <img
                                          src='https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D'
                                          alt='第一則評價顧客'
                                          className='rounded-circle'
                                      />
                                      <div className='d-flex flex-column'>
                                          <p className='h5'>
                                              "我真的很喜歡這個產品！品質非常好，使用起來也很方便，完全超過了我的預期。我一定會再次購買，也會推薦給我的朋友們！"
                                          </p>
                                          <p className='mt-auto text-muted fw-bold'>"非常滿意，強烈推薦！"</p>
                                      </div>
                                  </div>
                              </div>
                          </SwiperSlide>

                          {/* 第二則評價 */}
                          <SwiperSlide>
                              <div className='row justify-content-center py-7'>
                                  <div className='col-md-8 d-flex'>
                                      <img
                                          src='https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D'
                                          alt='第二則評價顧客'
                                          className='rounded-circle'
                                      />
                                      <div className='d-flex flex-column'>
                                          <p className='h5'>
                                              "這款產品非常棒！包裝精美，開箱的時候給我帶來了很大的驚喜。它的設計很時尚，而且使用起來非常順手。價格也很實惠，絕對物超所值！"
                                          </p>
                                          <p className='mt-auto text-muted fw-bold'>"設計精美，性價比高！"</p>
                                      </div>
                                  </div>
                              </div>
                          </SwiperSlide>

                          {/* 第三則評價 */}
                          <SwiperSlide>
                              <div className='row justify-content-center py-7'>
                                  <div className='col-md-8 d-flex'>
                                      <img
                                          src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D'
                                          alt='第三則評價顧客'
                                          className='rounded-circle'
                                      />
                                      <div className='d-flex flex-column'>
                                          <p className='h5'>
                                              "非常滿意！這是我最近買過的最好的商品之一。質量上乘，細節處理得很到位，完全符合我的需求。這次購物體驗超級愉快，已經迫不及待想要再買更多！"
                                          </p>
                                          <p className='mt-auto text-muted fw-bold'>"質量一流，超值購買！"</p>
                                      </div>
                                  </div>
                              </div>
                          </SwiperSlide>
                      </Swiper>
                  </div>
              </div>
            </div>

            

            <section className='home-subscrib bg-dark text-white py-5'>
                <div className='container text-center'>
                    <div className='mb-4'>
                        <h2 className='h3 mb-3'>穿搭靈感，每週直送信箱</h2>
                        <p className='mb-2'>加入 OOTD 工廠電子報，掌握最新穿搭趨勢、獨家優惠與戶外靈感。</p>
                        {!submitted && (
                            <>
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
                                    />
                                    <button type='submit' className='btn p-3 rounded-0'>
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

export default HomePage;
