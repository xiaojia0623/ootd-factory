import { useEffect, useReducer } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import Message from '../../components/Message';
import { MessageContext, messageReducer, initState } from '/src/redux/messageStore';
import Swal from 'sweetalert2'

const Dashboard = () => {
    const navigate = useNavigate();
    const reducer = useReducer(messageReducer, initState);

    const logout = () => {
        document.cookie = 'feijia23456=;';
        Swal.fire({
            title: "登出成功!!",
            icon: "success",
            draggable: true
        });
        navigate('/login');
    }

    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('feijia23456='))
        ?.split('=')[1];

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        if (!token){
            return navigate('/login');
        }
        (async() => {
            try{
                await axios.post('/v2/api/user/check', null, {
                    headers: {
                        Authorization: token,
                    },
                });
            }catch(error){
                if (!error.response || !error.response.data?.success){
                    navigate('/login');
                }

            }
        })();
    },[navigate, token]);


  return (
    <MessageContext.Provider value={reducer}>
    <Message />
        <nav className='navbar navbar-expand-lg bg-primary'>
            <div className='container-fluid'>
                <p className='text-white mb-0 fw-bold'>OOTD工廠 後台管理系統</p>
                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navbarNav'
                    aria-controls='navbarNav'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon' />
                </button>
                <div
                    className='collapse navbar-collapse justify-content-end'
                    id='navbarNav'
                >
                    <ul className='navbar-nav'>
                    <li className='nav-item'>
                        <button type='button' className='btn btn-sm btn-secondary' onClick={logout}>
                        登出
                        </button>
                    </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div className='d-flex' style={{ minHeight: 'calc(100vh - 56px)' }}>
            <div className='bg-light' style={{ width: '200px' }}>
                <ul className='list-group list-group-flush'>
                    <Link className='list-group-item list-group-item-action py-3' to='/admin/products'>
                        <i className='bi bi-cup-fill me-2' />
                        產品列表
                    </Link>
                    <Link
                    className='list-group-item list-group-item-action py-3'
                    to='/admin/coupons'
                    >
                        <i className='bi bi-ticket-perforated-fill me-2' />
                        優惠卷列表
                    </Link>
                    <Link
                    className='list-group-item list-group-item-action py-3'
                    to='/admin/orders'
                    >
                        <i className='bi bi-receipt me-2' />
                        訂單列表
                    </Link>
                    <Link
                    className='list-group-item list-group-item-action py-3'
                    to='/admin/news'
                    >
                        <i className='bi bi-newspaper me-2' />
                        最新消息列表
                    </Link>
                </ul>
            </div>
            <div className='w-100'>
                <Outlet/>
            </div>
        </div>
     </MessageContext.Provider>
  )
}

export default Dashboard
