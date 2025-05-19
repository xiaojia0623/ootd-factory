import { useEffect, useState} from 'react'
import { Outlet, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import axios from 'axios';


const VITE_PATH = import.meta.env.VITE_API_PATH;

const FrontLayout = () => {
    const [cartData, setCartData] = useState({});

    const getCart = async() => {
        try{
            const res = await axios.get(`/v2/api/${VITE_PATH}/cart`);
            setCartData(res.data.data)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        getCart();
    },[])
  return (
    <>
        <Navbar cartData={cartData}/>
        <Outlet context={{getCart, cartData}}></Outlet>
        <div className='bg-dark p-3' style={{ marginTop:'-1%'}}>
            <div className='container'>
                <div className='d-flex flex-column-reverse flex-lg-row align-items-center justify-content-md-between text-white '>
                    <p className=' p-0 m-0'>© 2025 OOTD Factory All Rights Reserved By Michelle(僅學習使用請勿商用)</p>
                    <ul className='d-flex list-unstyled mb-0 h4  align-items-center'>
                        <li>
                            <Link>
                                <i className="bi bi-facebook"></i>
                            </Link>
                        </li>
                        <li className='mx-3'>
                            <Link>
                                <i className="bi bi-instagram"></i>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <i className="bi bi-line"></i>
                            </Link>
                        </li>
                        <li>
                            <Link to='/login' className='text-decoration-none fs-6 ms-3 align-items-center text-center justify-content-center'>
                                後台管理(測試)
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </>
  )
}

export default FrontLayout
