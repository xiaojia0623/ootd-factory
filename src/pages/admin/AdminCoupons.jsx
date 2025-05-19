import { useEffect, useRef, useState , useContext} from 'react';
import axios from 'axios';
import CouponModal from '../../components/CouponModal';
import DeleteModal from '../../components/DeleteModal';
import Pagination from '../../components/Pagination';
import { Modal } from 'bootstrap';
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../redux/messageStore';

const VITE_PATH = import.meta.env.VITE_API_PATH;

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState({});

  //type: 決定modal 展開的用途
  const [type, setType] = useState('create'); //edit
  //暫存方法
  const [tempCoupon, setTempCoupon] = useState({});

  const [, dispatch] = useContext(MessageContext);
  
  const couponModal = useRef(null);
  const deleteModal = useRef(null);

  useEffect(() => {
    couponModal.current = new Modal('#productModal', {
      backdrop: 'static',
      keyboard: false,
    });
    deleteModal.current = new Modal('#deleteModal', {
      backdrop: 'static',
      keyboard: false,
    });
    getCoupons();
  }, []);

  const getCoupons = async (page = 1) => {
    const res = await axios.get(
      `/v2/api/${VITE_PATH}/admin/coupons?page=${page}`
    );
    setCoupons(res.data.coupons);
    setPagination(res.data.pagination);
  };

  const openCouponModal = (type, item) => {
    setType(type);
    setTempCoupon(item);
    couponModal.current.show();
  };

  const closeModal = () => {
    couponModal.current.hide();
  };

  const openDeleteModal = product => {
    setTempCoupon(product);
    deleteModal.current.show();
  };

  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };

  const deleteCoupon = async id => {
    try {
      const res = await axios.delete(`/v2/api/${VITE_PATH}/admin/coupon/${id}`);
      if (res.data.success) {
        getCoupons();
        closeDeleteModal();
      }
      handleSuccessMessage(dispatch, res);
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div className='p-3'>
      <CouponModal
        closeModal={closeModal}
        getCoupons={getCoupons}
        tempCoupon={tempCoupon}
        type={type}
      />
      <DeleteModal
        close={closeDeleteModal}
        text={tempCoupon.title}
        handleDelete={deleteCoupon}
        id={tempCoupon.id}
      />
      <h3>優惠券列表</h3>
      <hr />
      <div className='text-end'>
        <button
          type='button'
          className='btn btn-primary btn-sm'
          onClick={() => openCouponModal('create', {})}
        >
          建立新優惠券
        </button>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>#</th>
            <th scope='col'>產品id</th>
            <th scope='col'>優惠券名稱</th>
            <th scope='col'>折扣</th>
            <th scope='col'>到期日</th>
            <th scope='col'>優惠碼</th>
            <th scope='col'>啟用狀態</th>
            <th scope='col'>編輯</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(product => {
            return (
              <tr key={product.id}>
                <td>{product.num}</td>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{Number(product.percent)}%</td>
                <td>{new Date(product.due_date).toDateString()}</td>
                <td>{product.code}</td>
                <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                <td>
                  <button
                    type='button'
                    className='btn btn-primary btn-sm'
                    onClick={() => openCouponModal('edit', product)}
                  >
                    編輯
                  </button>
                  <button
                    type='button'
                    className='btn btn-outline-danger btn-sm ms-2'
                    onClick={() => openDeleteModal(product)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getCoupons} />
    </div>
  );
};

export default AdminCoupons;
