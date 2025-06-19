import { useForm } from 'react-hook-form';
import { useEffect, useState, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/FormElement';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { MessageContext, handleErrorMessage } from '../../redux/messageStore';

const VITE_PATH = import.meta.env.VITE_API_PATH;

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [pendingOrderId, setPendingOrderId] = useState(null);
    const [cartData, setCartData] = useState({});

    const [rawSubtotal, setRawSubtotal] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);

    const { dispatch } = useContext(MessageContext);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onTouched',
    });

    useEffect(() => {
        if (!cartData?.carts) return;

        // 小計：用原價 * 數量 計算
        const subtotal = cartData.carts.reduce((acc, item) => {
            return acc + item.product.price * item.qty;
        }, 0);

        setRawSubtotal(subtotal);

        // 折扣
        const coupon = cartData?.carts?.[0]?.coupon;
        const percent = coupon?.percent || 0;
        setDiscountPercent(percent);

        const discount = Math.round(subtotal * (percent / 100));
        setDiscountAmount(discount);

        // 運費
        setShippingFee(subtotal >= 5000 ? 0 : 60);
    }, [cartData]);

    const fetchCart = useCallback(async () => {
        const res = await axios.get(`/v2/api/${VITE_PATH}/cart`);
        setCartData(res.data.data);
    }, []);

    const onSubmit = async data => {
        const order = {
            user: {
                name: data.name,
                email: data.email,
                tel: data.tel,
                address: data.address,
            },
            message: data.message,
        };

        try {
            // 建立訂單
            const res = await axios.post(`/v2/api/${VITE_PATH}/order`, { data: order });
            if (!res.data.orderId) {
                throw new Error('建立訂單失敗：找不到訂單資訊');
            }

            const { orderId } = res.data;

            Swal.fire({
                title: '訂單建立成功',
                icon: 'success',
                draggable: true,
            });

            if (paymentMethod === 'credit') {
                // 信用卡直接付款
                await axios.post(`/v2/api/${VITE_PATH}/pay/${orderId}`);
                if (!data.cardNumber || !data.cvc) {
                    //防呆
                    Swal.fire({
                        title: '請輸入完整的信用卡資訊',
                        icon: 'warning',
                    });
                    return;
                }
                Swal.fire({
                    title: '付款成功',
                    icon: 'success',
                    draggable: true,
                });
                navigate(`/success/${orderId}`);
                window.location.reload();
            } else {
                // Apple Pay / Line Pay：顯示 QRCode
                setPendingOrderId(orderId);
                const qrModal = new bootstrap.Modal(document.getElementById('qrCodeModal'));
                qrModal.show();
            }
        } catch (error) {
            handleErrorMessage(dispatch, error);
            Swal.fire({
                title: '發生錯誤，請稍後再試',
                icon: 'error',
                draggable: true,
            });
        }
    };

    const handleQrScan = async () => {
        if (!pendingOrderId) return;
        await axios.post(`/v2/api/${VITE_PATH}/pay/${pendingOrderId}`);
        //清理 Modal 殘留樣式與 backdrop
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(el => el.remove());
        Swal.fire({
            title: '支付成功',
            icon: 'success',
            draggable: true,
        });
        navigate(`/success/${pendingOrderId}`, { replace: true });
        window.location.reload();
    };

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    return (
        <>
            <div className='modal fade' id='qrCodeModal' tabIndex='-1' aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered text-center'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>請使用手機掃描 QRCode</h5>
                            <button
                                type='button'
                                className='btn-close'
                                data-bs-dismiss='modal'
                                aria-label='Close'
                            ></button>
                        </div>
                        <div className='modal-body'>
                            <img
                                src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=FakeQRCode'
                                alt='QRCode'
                                width={200}
                                height={200}
                            />
                            <button type='button' className='btn btn-success mt-3' onClick={handleQrScan}>
                                模擬掃描完成付款
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-light pt-5 pb-7 full-height pb-5 checkout-page'>
                <div className='container'>
                    <div className='row checkout-content'>
                        <form className='col-md-5 checkout-form shadow p-4' onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <h4 className='fw-bold'>聯絡資料 <span className='fs-6 bg-danger p-2 text-white'>必填</span></h4>
                                <div className='mb-2'>
                                    <Input
                                        type='text'
                                        errors={errors}
                                        labelText='姓名'
                                        id='name'
                                        register={register}
                                        autoComplete='name'
                                        rules={{
                                            required: '使用者名稱必須填',
                                            maxLength: {
                                                value: 10,
                                                message: '使用者名稱長度不超過10',
                                            },
                                        }}
                                    ></Input>
                                </div>
                                <div className='mb-2'>
                                    <Input
                                        id='email'
                                        labelText='Email'
                                        type='email'
                                        autoComplete='email'
                                        errors={errors}
                                        register={register}
                                        rules={{
                                            required: 'Email 為必填',
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: 'Email 格式不正確',
                                            },
                                        }}
                                    ></Input>
                                </div>
                                <div className='mb-2'>
                                    <Input
                                        id='tel'
                                        labelText='電話'
                                        type='tel'
                                        errors={errors}
                                        register={register}
                                        autoComplete='tel'
                                        rules={{
                                            required: '電話為必填',
                                            minLength: {
                                                value: 6,
                                                message: '電話不少於 6 碼',
                                            },
                                            maxLength: {
                                                value: 12,
                                                message: '電話不超過 12 碼',
                                            },
                                        }}
                                    ></Input>
                                </div>
                                <div className='mb-2'>
                                    <Input
                                        id='address'
                                        labelText='地址'
                                        type='address'
                                        errors={errors}
                                        autoComplete='address'
                                        register={register}
                                        rules={{
                                            required: '地址為必填',
                                        }}
                                    ></Input>
                                </div>

                                <div className='mb-4'>
                                    <label className='form-label'>付款方式</label>
                                    <div className='form-check'>
                                        <input
                                            className='form-check-input'
                                            type='radio'
                                            id='credit'
                                            value='credit'
                                            {...register('payment')}
                                            checked={paymentMethod === 'credit'}
                                            onChange={() => setPaymentMethod('credit')}
                                        />
                                        <label className='form-check-label' htmlFor='credit'>
                                            信用卡付款
                                        </label>
                                    </div>
                                    {paymentMethod === 'credit' && (
                                        <div className='mb-2'>
                                            <Input
                                                id='cardNumber'
                                                labelText='信用卡號'
                                                type='text'
                                                autoComplete='cc-number'
                                                errors={errors}
                                                maxLength={16}
                                                register={register}
                                                rules={{
                                                    required: '信用卡號為必填',
                                                    pattern: {
                                                        value: /^\d{16}$/,
                                                        message: '請輸入 16 位數的信用卡號',
                                                    },
                                                }}
                                            />
                                            <Input
                                                id='cvc'
                                                className='mt-5'
                                                labelText='卡片後三碼'
                                                type='text'
                                                autoComplete='cc-csc'
                                                errors={errors}
                                                register={register}
                                                rules={{
                                                    required: '卡片後三碼為必填',
                                                    pattern: {
                                                        value: /^\d{3}$/,
                                                        message: '請輸入正確的 3 位數 CVC',
                                                    },
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div className='form-check'>
                                        <input
                                            className='form-check-input'
                                            type='radio'
                                            id='apple'
                                            value='apple'
                                            {...register('payment')}
                                            checked={paymentMethod === 'apple'}
                                            onChange={() => setPaymentMethod('apple')}
                                        />
                                        <label className='form-check-label' htmlFor='apple'>
                                            Apple Pay
                                        </label>
                                    </div>
                                    <div className='form-check'>
                                        <input
                                            className='form-check-input'
                                            type='radio'
                                            id='line'
                                            value='line'
                                            {...register('payment')}
                                            checked={paymentMethod === 'line'}
                                            onChange={() => setPaymentMethod('line')}
                                        />
                                        <label className='form-check-label' htmlFor='line'>
                                            Line Pay
                                        </label>
                                    </div>
                                    <div className="form-check mt-5">
                                        <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="checkDefault"
                                        {...register('agree', {
                                            required: '請先同意《隱私權政策》',
                                        })}
                                        />
                                        <label className="form-check-label" htmlFor="checkDefault">
                                        我已閱讀並同意 <Link to="/privacy">《隱私權政策》</Link>
                                        </label>
                                        {/* 顯示錯誤訊息 */}
                                        {errors.agree && (
                                        <div className="text-danger mt-1">{errors.agree.message}</div>
                                        )}
                                    </div>
                                </div>

                                
                            </div>
                            <div className='d-flex flex-row flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100'>
                                <Link className='btn btn-secondary rounded-2 text-white mt-md-0 mt-3 fw-bold' to='/cart'>
                                    <i className='bi bi-chevron-left me-2'></i> 回上一頁
                                </Link>
                                <button type='submit' className='btn btn-primary text-white py-2 px-4' disabled={isSubmitting}>
                                    送出表單
                                </button>
                            </div>
                        </form>
                        <div className='col-md-5 checkout-confirmdetail p-0'>
                            <div className='border p-4 mb-4'>
                                <h4 className='mb-4 fw-bold'>選購商品</h4>
                                {cartData?.carts?.map(item => {
                                    return (
                                        <div className='d-flex mb-3' key={item.id}>
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.title}
                                                className='me-2'
                                            />
                                            <div className='w-100'>
                                                <div className='d-flex justify-content-between fw-bold'>
                                                    <p className='mb-0'>{item.product.title}</p>
                                                    <p className='mb-0'>x{item.qty}</p>
                                                </div>
                                                <div className='d-flex justify-content-between'>
                                                    <p className='text-muted mb-0 fw-bold'>
                                                        <small>NT$ {item.product.price}</small>
                                                    </p>
                                                    <p className='mb-0'>
                                                        NT$ {(item.product.price * item.qty).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className='d-flex justify-content-start mt-4'>
                                    <p className='mb-0 h5 fw-bold me-3'>小計 : </p>
                                    <p className='mb-0 h5 fw-bold'>NT${rawSubtotal.toLocaleString()}</p>
                                </div>
                                <div className='d-flex justify-content-start mt-2 text-danger'>
                                    <p className='h6 fw-bold mt-2'>
                                        折扣: {discountPercent > 0 ? `- ${discountPercent}%` : '0%'} (- NT$
                                        {discountAmount.toLocaleString()})
                                    </p>
                                </div>
                                <div className='d-flex justify-content-start mt-4  position-relative top-0 tooltips'>
                                    <p className='mb-0 h6 fw-bold'>
                                        運費{' '}
                                        <span>
                                            <i
                                                className='bi bi-info-circle'
                                                type='button'
                                                data-bs-toggle='tooltip'
                                                data-bs-placement='right'
                                                title='滿5000元可享有免運費，5000元以下需要加60元運費'
                                            ></i>
                                        </span>{' '}
                                        :{' '}
                                    </p>
                                    {/* <p className='mb-0 h6 fw-bold'>+ NT${shippingFee}</p> */}
                                    <p className='mb-0 h6 fw-bold ms-3'> {rawSubtotal >= 5000 ? `免運費` : `NT$ ${shippingFee}`}</p>
                                </div>
                                <div className='d-flex justify-content-between mt-4'>
                                    <p className='mb-0 h4 fw-bold'>總金額</p>
                                    <p className='mb-0 h4 fw-bold'>
                                        NT$ {(rawSubtotal + shippingFee - discountAmount).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
