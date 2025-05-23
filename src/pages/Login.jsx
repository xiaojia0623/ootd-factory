import axios from 'axios';
import {  useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const Login = () => {

    const navigate = useNavigate();
    const [loginState, setLoginState] = useState({});

    const [data, setData] = useState({
        username:'',
        password:''
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setData({...data, [name]: value});
    }

    const submit = async() => {
        try{
            const res = await axios.post(`/v2/admin/signin`, data);
            const {token, expired} = res.data;
            document.cookie = `feijia23456=${token}; expires=${new Date(expired)}`;
            
            if (res.data.success) {
                navigate('/admin/products');
            }
            Swal.fire({
                title: `${res.data.message}`,
                icon: "success",
                draggable: true
            });

        }catch(error){
            setLoginState(error.response.data);
            Swal.fire({
                title: `Email或密碼有誤，請重新登入登入`,
                icon: "error",
                draggable: true
            });
        }
        
    }

    

  return (
    <div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h2>登入帳號</h2>
        
                <div className={`alert alert-danger ${loginState.message ? 'd-block' : 'd-none'}`} role="alert">
                {loginState.message}
                </div>
                <div className="mb-2">
                <label htmlFor="email" className="form-label w-100">
                    Email
                    <input id="email" className="form-control" name="username" type="email" placeholder="Email Address" onChange={handleChange} />
                </label>
                </div>
                <div className="mb-2">
                    <label htmlFor="password" className="form-label w-100">
                        密碼
                        <input type="password" className="form-control"  name="password" id="password" placeholder="name@example.com"  onChange={handleChange} />
                    </label>
                </div>
                <button type="button" className="btn btn-primary text-white" onClick={submit}>登入</button>
            </div>
        </div>
   </div>
  )
}

export default Login
