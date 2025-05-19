import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../redux/messageStore';

const VITE_PATH = import.meta.env.VITE_API_PATH;

const OrderModal = ({ closeOrderModal, getOrders, tempOrder }) => {
  const [tempData, setTempData] = useState({
    is_paid: '',
    status: 0,
    ...tempOrder,
  });

  const [, dispatch] = useContext(MessageContext);

  useEffect(() => {
    setTempData({
      ...tempOrder,
      is_paid: tempOrder.is_paid,
      status: tempOrder.status,
    });
  }, [tempOrder]);

  const handleChange = e => {
    const { name, value, checked } = e.target;

    if (['is_paid'].includes(name)) {
      setTempData(preState => ({ ...preState, [name]: checked }));
    } else {
      setTempData(preState => ({ ...preState, [name]: value }));
    }
  };

  const submit = async () => {
    try {
      let api = `/v2/api/${VITE_PATH}/admin/order/${tempOrder.id}`;

      const res = await axios.put(api, {
        data: {
          ...tempData,
        },
      });
      handleSuccessMessage(dispatch, res);
      closeOrderModal();
      getOrders();
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div
      className='modal fade'
      id='orderModal'
      tabIndex='-1'
      aria-labelledby='exampleModalLabel'
      //aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='exampleModalLabel'>
              {`編輯 ${tempData.title}`}
            </h1>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={closeOrderModal}
            ></button>
          </div>

          <div className='modal-body'>
            <div className='mb-3 row'>
              <span className='col-sm-2 col-form-label'>Email</span>
              <div className='col-sm-10'>
                <input
                  type='email'
                  id='staticEmail'
                  readOnly
                  name='title'
                  className='w-100 form-control-plaintext'
                  defaultValue={tempOrder?.user?.email}
                />
              </div>
            </div>
            <div className='mb-3 row'>
              <span className='col-sm-2 col-form-label'>訂購者</span>
              <div className='col-sm-10'>
                <input
                  type='text'
                  readOnly
                  name='title'
                  className='form-control-plaintext'
                  defaultValue={tempOrder?.user?.name}
                />
              </div>
            </div>
            <div className='mb-3 row'>
              <span className='col-sm-2 col-form-label'>外送地址</span>
              <div className='col-sm-10'>
                <input
                  type='text'
                  readOnly
                  className='form-control-plaintext'
                  defaultValue={tempOrder?.user?.address}
                />
              </div>
            </div>
            <div className='mb-3 row'>
              <span className='col-sm-2 col-form-label'>留言</span>
              <div className='col-sm-10'>
                <textarea
                  type='text'
                  name=''
                  id=''
                  cols={30}
                  readOnly
                  className='form-control-plaintext'
                  defaultValue={tempOrder.message}
                />
              </div>
            </div>

            {tempOrder.products && (
              <table className='table'>
                <thead>
                  <tr>
                    <th>品項名稱</th>
                    <th>數量</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(tempOrder.products).map(cart => (
                    <tr key={cart.id}>
                      <td>{cart.product.title}</td>
                      <td>{cart.qty}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>總金額</td>
                    <td>${tempOrder.total}</td>
                  </tr>
                </tfoot>
              </table>
            )}
            <div>
              <h5>修改訂單狀態</h5>
              <div className='form-check mb-4'>
                <label className='form-check-label' htmlFor='is_paid'>
                  <input
                    type='checkbox'
                    id='is_paid'
                    name='is_paid'
                    placeholder='請輸入產品描述'
                    className='form-check-input'
                    onChange={handleChange}
                    checked={!!tempData.is_paid}
                  />
                  付款狀態({tempData.is_paid ? '已付款' : '未付款'})
                </label>
              </div>
              <div className='mb-4'>
                <span className='col-sm-2 col-form-label d-block'>
                  外送進度
                </span>
                <select
                  name='status'
                  value={tempData.status}
                  onChange={handleChange}
                  className='form-select'
                >
                  <option value='未確認'>未確認</option>
                  <option value='已確認'>已確認</option>
                  <option value='外送當中'>外送當中</option>
                  <option value='已送達'>已送達</option>
                </select>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={closeOrderModal}
            >
              關閉
            </button>
            <button type='button' className='btn btn-primary' onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
