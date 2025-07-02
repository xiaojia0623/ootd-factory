import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminOrder from './pages/admin/AdminOrder';
import FrontLayout from './pages/front/FrontLayout';
import HomePage from './pages/front/HomePage';
import Products from './pages/front/Products';
import ProductDetail from './pages/front/ProductDetail';
import Checkout from './pages/front/Checkout';
import Success from './pages/front/Success';
import AboutUs from './pages/front/AboutUs';
import CartPage from './pages/front/CartPage';
import PrivacyPolicy from './pages/front/PrivacyPolicy';


function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<FrontLayout />}>
          <Route index element={<HomePage />}></Route>
          <Route path='about' element={<AboutUs />}></Route>
          <Route path='products' element={<Products />}></Route>
          <Route path='product/:id' element={<ProductDetail />}></Route>
          <Route path='cart' element={<CartPage />}></Route>
          <Route path='checkout' element={<Checkout />}></Route>
          <Route path='success/:orderId' element={<Success />}></Route>
          <Route path='privacy' element={<PrivacyPolicy />}></Route>
        </Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/admin' element={<Dashboard />}>
          <Route path='products' element={<AdminProducts />}></Route>
          <Route path='coupons' element={<AdminCoupons />}></Route>
          <Route path='orders' element={<AdminOrder />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
