import {useEffect, useRef, useState, useContext} from 'react';
import axios from 'axios';
import OrderModal from '../../components/OrderModal';
import DeleteModal from '../../components/DeleteModal';
import Pagination from '../../components/Pagination';
import { Modal } from 'bootstrap';
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../redux/messageStore';

const VITE_PATH = import.meta.env.VITE_API_PATH;

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({});

    //type: 決定modal 展開的用途
    //const [type, setType] = useState('create'); //edit
    //暫存方法
    const [tempOrder, setTempOrder] = useState({})

    const [, dispatch] = useContext(MessageContext);

    const orderModal = useRef(null);
    const deleteModal = useRef(null);

    useEffect(() => {
      orderModal.current = new Modal('#orderModal', {
        backdrop: 'static',
        keyboard: false,
      });
      deleteModal.current = new Modal('#deleteModal', {
        backdrop: 'static',
        keyboard: false,
      });
        getOrders();
    }, []);
      
    const getOrders = async(page=1) => {
      const productRes = await axios.get(
        `/v2/api/${VITE_PATH}/admin/orders?page=${page}`
      );
      setOrders(productRes.data.orders);
      setPagination(productRes.data.pagination);
    }

    const openOrderModal = (order) => {
      setTempOrder(order);
      orderModal.current.show();
    }

    const closeOrderModal = () => {
      setTempOrder({})
      orderModal.current.hide();
    }

    const openDeleteModal = (product) => {
      setTempOrder(product);
      deleteModal.current.show();
    }

    const closeDeleteModal = () => {
      deleteModal.current.hide();
    }

    const deleteOrder = async(id) => {
      try{
        const res = await axios.delete(`/v2/api/${VITE_PATH}/admin/order/${id}`)
        if (res.data.success) {
          getOrders();
          closeDeleteModal();
        }
        handleSuccessMessage(dispatch, res);
      }catch(error){
        handleErrorMessage(dispatch, error);
      }
    }

  return (
    <div className='p-3'>
      <OrderModal closeOrderModal={closeOrderModal} getOrders={getOrders} tempOrder={tempOrder}/>
      <DeleteModal close={closeDeleteModal} text={tempOrder.title} handleDelete={deleteOrder} id={tempOrder.id}/>
      <h3>訂單列表</h3>
      <hr />
      <table className='table'>
        <thead>
          <tr className='text-start'>
            <th scope='col'>訂單ID</th>
            <th scope='col'>購買客戶</th>
            <th scope='col'>信箱</th>
            <th scope='col'>訂單金額</th>
            <th scope='col'>付款狀態</th>
            <th scope='col'>付款日期</th>
            <th scope='col'>外送狀態</th>
            <th scope='col'>編輯</th>
          </tr>
        </thead>
        <tbody>
            {orders.map((order) => {
                return(
                    <tr key={order.id}>
                      <td>{order.id}</td>
                        <td>{order.user?.name}</td>
                        <td>{order.user?.email}</td>
                        <td>${order.total.toLocaleString()}</td>
                        <td>{order.is_paid ? (<span className='text-success fw-bold'>付款完成</span>):('未付款')}</td>
                        <td>{order.is_paid ? new Date(order.create_at*1000).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\//g, '-')  : '未付款'}</td>
                        <td>{order.status}</td>
                        <td>
                        <button type='button' className='btn btn-primary btn-sm' onClick={() => openOrderModal(order)}>
                            查看
                        </button>
                        <button
                            type='button'
                            className='btn btn-outline-danger btn-sm ms-2'
                            onClick={() => openDeleteModal(order)}
                        >
                            刪除
                        </button>
                        </td>
                    </tr>
                )
            })}
          
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getOrders}/>
      
    </div>
  );
};

export default AdminOrder;
