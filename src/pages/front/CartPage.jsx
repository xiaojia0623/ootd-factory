import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../redux/messageStore';



const VITE_PATH = import.meta.env.VITE_API_PATH;

const CartPage = () => {
    const {cartData, getCart} = useOutletContext();
    const [loadingItems, setLoadingItems] = useState([]);

    const [couponCode, setCouponCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [discountPercent, setDiscountPercent] = useState(0);
    const { dispatch} = useContext(MessageContext);

    const removeCartItem = async(id) => {
        try{
            const res = await axios.delete(`/v2/api/${VITE_PATH}/cart/${id}`)
            handleSuccessMessage(dispatch, res);
            getCart();
            clearCoupon(); // 清除優惠券，避免折扣錯亂
        }catch(error){
            handleErrorMessage(dispatch, error);
        }
    }

    const updateCartItem = async(item, quantity) => {
        const data = {
            data: {
              product_id: item.product_id,
              qty: quantity
            }
          }
          setLoadingItems((prev) => [...prev, item.id]);
        try{
            const res = await axios.put(`/v2/api/${VITE_PATH}/cart/${item.id}`, data)
            handleSuccessMessage(dispatch, res);
            setLoadingItems((prev) => prev.filter((loadingId) => loadingId !== item.id));
            getCart();
            clearCoupon(); // 更新數量後清除優惠券，讓使用者重新套用
        }catch(error){
            handleErrorMessage(dispatch, error);
        }
    }

    const clearCoupon = () => {
        setCouponCode('');
        setDiscountAmount(0);
        setDiscountPercent(0);
        setCouponError('');
    };

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, []);

    useEffect(() => {
        const firstCart = cartData?.carts?.[0];
        const coupon = firstCart?.coupon;

        if (coupon) {
            setDiscountPercent(coupon.percent || 0);
            const discount = Math.round((cartData.total || 0) * ((coupon.percent || 0) / 100));
            setDiscountAmount(discount);
        } else {
            setDiscountPercent(0);
            setDiscountAmount(0);
        }
    }, [cartData]);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;

        setIsApplying(true);
        setCouponError('');
        try {
            const res = await axios.post(`/v2/api/${VITE_PATH}/coupon`, {
                data: {
                    code: couponCode
                },
            });
            if (res.data.success) {
                const percent = res.data.data.percent || 0;
                const discount = Math.round((cartData.total || 0) * (percent / 100));

                setDiscountPercent(percent);
                setDiscountAmount(discount);
                getCart();
            }else{
                setCouponError('此優惠碼無效或已過期');
            }
        } catch (error) {
            handleErrorMessage(dispatch, error);
            setCouponError('套用優惠券失敗，請稍後再試');
        }finally {
            setIsApplying(false);
        }
    };

    // 小計：使用原價計算
    const rawSubtotal = cartData.carts?.reduce((acc, cur) => {
    return acc + cur.product.price * cur.qty;
    }, 0) || 0;

    // 運費邏輯
    const shippingFee = rawSubtotal >= 5000 ? 0 : 60;

    return (
        <div className='container full-height bg-white py-5'>
            <div className='row justify-content-center'>
            
                {cartData?.carts?.length === 0 ? (
                    <>
                    <h3 className='text-center mt-4'>還沒有選擇商品喔</h3>
                    <Link to='/products' className='btn btn-primary text-white w-50 mt-4 rounded-0 fs-5 py-3'>來去選擇喜歡的商品</Link>
                    </>
                    ) : (
                        <>
                            <div className='col bg-white  full-height'>
                                <h2 className='mt-2 fw-bold'>您的購物車<span className='fs-6 ms-2 text-secondary fw-bold'>請確認商品以及數量</span></h2>
                                <div className='cart_content row d-flex justify-content-lg-between flex-column flex-lg-row gx-0 gx-md-5 my-4'>
                                    <section className='col-6 d-flex flex-column cart-list'>
                                        { cartData?.carts?.map((item) => {
                                            return (
                                                <div className='cart-card d-flex mt-4 bg-light' key={item.id}>
                                                    <img
                                                        src={item.product.imageUrl}
                                                        alt={item.product.title}
                                                        className='object-cover cart-img'
                                                    />
                                                    <div className='cart_card_content p-3'>
                                                        <button type='button' className='btn' onClick={() => removeCartItem(item.id)}>
                                                            <i className="bi bi-x-lg"></i>
                                                        </button>
                                                        <p className='mb-0 fw-bold fs-5'>{item.product.title}</p>
                                                        <p className='text-muted cart-content'>{item.product.content}</p>
                                                        <div className='d-flex justify-content-between align-items-center w-100'>
                                                            <div className='input-group w-50 align-items-center'>
                                                                <select name="" id="" className="form-select" value={item.qty} disabled={loadingItems.includes(item.id)} onChange={(e) => {
                                                                    updateCartItem(item, e.target.value * 1)
                                                                }}>
                                                                {[...(new Array(20))].map((i, num) => {
                                                                    return (
                                                                        <option value={num+1} key={num}>{num+1}</option>
                                                                    )
                                                                    })} 
                                                                </select>
                                                            </div>
                                                            <p className='mb-0 ms-auto fw-bold'>NT$ {(item.product.price * item.qty).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </section>
                                    
                                    <section className='col-6 cart_summary'>
                                        {/* 優惠券輸入框 */}
                                        <div className="d-flex align-items-center gap-3 mt-3">
                                            <input
                                            type="text"
                                            className="form-control w-50"
                                            placeholder="輸入優惠券代碼"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={isApplying}
                                            />
                                            <button className="btn btn-primary text-white" onClick={applyCoupon} disabled={isApplying}>
                                            {isApplying ? '套用中...' : '套用優惠券'}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-danger mt-2">{couponError}</p>}

                                        <div className='d-flex justify-content-start mt-4'>
                                            <p className='mb-0 h5 fw-bold me-3'>小計 : </p>
                                            <p className='mb-0 h5 fw-bold'>NT${rawSubtotal.toLocaleString()}</p>
                                        </div>
                                        {/* 折扣顯示 */}
                                        <div className='d-flex justify-content-start mt-2 text-danger'>
                                            <p className='h6 fw-bold mt-2'>
                                                折扣:  {discountPercent > 0 ? `- ${discountPercent}%` : '0%'} (- NT${discountAmount})
                                            </p>
                                        </div>
                                        <div className='d-flex justify-content-start mt-4  position-relative top-0 tooltips'>
                                            <p className='mb-0 h6 fw-bold'>運費 <span><i className="bi bi-info-circle" type="button"  data-bs-toggle="tooltip" data-bs-placement="top"  title="滿5000元可享有免運費，5000元以下需要加60元運費"></i></span> : </p>
                                            {/* <p className='mb-0 h6 fw-bold'> NT${shippingFee}</p> */}
                                            <p className='mb-0 h6 fw-bold ms-3'> {rawSubtotal >= 5000 ? `免運費` : `NT${shippingFee}`}</p>
                                            
                                        </div>
                                        <div className='d-flex justify-content-start mt-4'>
                                            <p className='mb-0 h4 fw-bold me-3'>總金額</p>
                                            <p className="mb-0 h4 fw-bold">NT$ {(rawSubtotal + shippingFee - discountAmount).toLocaleString()}</p>
                                        </div>
                                        <div className='d-flex justify-content-start align-items-center mt-4 cart-confirm'>
                                            <Link
                                                to='/checkout'
                                                className='comfirm-btn btn btn-primary text-white fw-bold fs-6  rounded-3 py-3'
                                            >
                                                確認產品正確
                                            </Link>
                                        </div>
                                    </section>
                                </div>
                            </div>    
                        </>
                )}     
            </div>
        </div>
)}
                
       
export default CartPage
            
