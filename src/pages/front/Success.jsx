import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import * as bootstrap from 'bootstrap';

const VITE_PATH = import.meta.env.VITE_API_PATH;

const Success = () => {
    const {orderId} = useParams();
    const [orderData, setOrderData] = useState({});

    const [rawSubtotal, setRawSubtotal] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);

  

    const getCart = async (orderId) => {
        const res = await axios.get(
          `/v2/api/${VITE_PATH}/order/${orderId}`,
        );
        setOrderData(res.data.order);
    };

    useEffect(() => {
        getCart(orderId);
    }, [orderId]);

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, []);

    useEffect(() => {
        if (!orderData?.products) return;

        const productsArray = Object.values(orderData.products);

        // 小計
        const subtotal = productsArray.reduce((acc, item) => {
            return acc + item.product.price * item.qty;
        }, 0);
        setRawSubtotal(subtotal);

        // 折扣：從第一個有 coupon 的商品抓出來
        const couponItem = productsArray.find(item => item?.coupon);
        const coupon = couponItem?.coupon || {};
        const percent = coupon?.percent || 0;
        setDiscountPercent(percent);

        const discount = Math.round(subtotal * (percent / 100));
        setDiscountAmount(discount);

        // 運費
        const shipping = subtotal >= 5000 ? 0 : 60;
        setShippingFee(shipping);
    }, [orderData]);


  return (
    <div className='container full-height'>
        <div className='my-5'>
            <div className='row flex-md-column flex-lg-row align-items-center'>
                <div className='col-md-6 success-arti'>
                    <h2 className='fw-bold'>感謝您的訂購！</h2>
                    <p >
                    親愛的顧客，感謝您選擇我們的產品。<br/>您的訂單已成功送出，我們會盡快為您處理並安排出貨。<br/>
                    期待您的商品能帶給您滿滿的喜悅與滿足！
                    </p>
                    <p>
                    若有任何問題，歡迎隨時與我們聯繫。<br/>祝您有美好的一天！
                    </p>
                    <Link to='/' className='btn btnLink btn-outline-primary rounded-0 mb-4 '>
                    回到首頁
                    </Link>
                </div>
                <div className='col-md-6 success-detail'>
                    <div className='card rounded-0 py-4'>
                        <div className='card-header border-bottom-0 bg-white p-2 '>
                            <h2 className='fw-bold'> 選購商品細節</h2>
                        </div>
                        <div className='card-body px-4 py-0'>
                            <ul className='list-group list-group-flush'>
                                {Object.values(orderData?.products || {}).map((item) => {
                                    return(
                                        <React.Fragment key={item.id}>
                                            <li className='list-group-item px-0'>
                                                <div className='d-flex mt-2'>
                                                    <img
                                                        src={item.product.imageUrl}
                                                        alt={item.product.title}
                                                        className='me-2'
                                                    />
                                                    <div className='w-100 d-flex flex-column'>
                                                        <div className='d-flex justify-content-between fw-bold'>
                                                            <h5 className='fw-bold'>{item.product.title}</h5>
                                                            <p className='mb-0'>x{item.qty}</p>
                                                        </div>
                                                        <div className='d-flex justify-content-between mt-auto'>
                                                            <p className='text-muted mb-0 fw-bold'>
                                                                <small>NT$ {item.product.price.toLocaleString()}</small>
                                                            </p>
                                                            <p className='mb-0'>NT$ {item.product.price.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </React.Fragment>
                                    )
                                })}
                                
                            </ul>
                            <hr/>
                            <div className='d-flex justify-content-start mt-4'>
                                <p className='mb-0 h6 fw-bold me-3'>小計 : </p>
                                <p className='mb-0 h6 fw-bold'>NT$ {rawSubtotal.toLocaleString()}</p>
                            </div>
                            <div className='d-flex justify-content-start mt-2 text-danger'>
                                <p className='h6 fw-bold mt-2'>
                                折扣: {discountPercent > 0 ? `- ${discountPercent}%` : '0%'} 
                                    {discountAmount > 0 && ` (- NT$${discountAmount.toLocaleString()})`}
                                </p>
                            </div>
                            <div className='d-flex justify-content-start mt-2'>
                                {discountPercent > 0 && (
                                    <p className="text-muted small">使用優惠碼：{orderData?.products && Object.values(orderData.products).find(item => item?.coupon)?.coupon?.code}</p>
                                )}
                            </div>
                            <div className='d-flex justify-content-start mt-3  position-relative top-0 tooltips'>
                                <p className='mb-0 h6 fw-bold'>運費 <span><i className="bi bi-info-circle"  type="button"  data-bs-toggle="tooltip" data-bs-placement="right"  title="滿5000元可享有免運費，5000元以下需要加60元運費"></i></span> :  {rawSubtotal >= 5000 ? `免運費` : `NT$ ${shippingFee}`}</p>
                            </div>
                            <div className='d-flex justify-content-between mt-2'>
                                <p className='mb-0 h4 fw-bold'>總金額</p>
                                <p className='mb-0 h4 fw-bold'>NT${(rawSubtotal - discountAmount + shippingFee).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Success
