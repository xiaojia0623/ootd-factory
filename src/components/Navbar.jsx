import { NavLink } from 'react-router-dom';
import * as bootstrap from 'bootstrap';

const Navbar = ({ cartData }) => {
    const handleNavLinkClick = () => {
        // const navbar = document.getElementById('navbarNav');
        // if (navbar.classList.contains('show')) {
        //     navbar.classList.remove('show');
        // }
        const navbar = document.getElementById('navbarNav');
        const collapseInstance =
            bootstrap.Collapse.getInstance(navbar) || new bootstrap.Collapse(navbar, { toggle: false });

        collapseInstance.hide(); // 收起 navbar
    };

    return (
        <>
            <div className='activity_message sticky-top bg-white'>
                <div className='d-flex p-2'>
                    <p className='mb-0'>🎉 優惠資訊 ~ ~ 即日起到 5/25，複製優惠碼到『購物車』輸入即可享折扣</p>
                    <p className='mb-0'>🎉 優惠資訊 ~ ~ 即日起到 5/25，複製優惠碼到『購物車』輸入即可享折扣</p>
                    <p className='mb-0'>🎉 優惠資訊 ~ ~ 即日起到 5/25，複製優惠碼到『購物車』輸入即可享折扣</p>
                </div>
            </div>

            <div className='bg-primary sticky-top shadow-sm'>
                <div className='container p-0 '>
                    <nav className='navbar px-0 navbar-expand-lg bg-primary web-navbar '>
                        <NavLink className='navbar-brand position-absolute fw-bold ' to='/'>
                            OOTD工廠
                        </NavLink>
                        <div className='d-flex ms-auto align-items-center'>
                            <div className='collapse navbar-collapse bg-white custom-header-md-open'>
                                <ul className='navbar-nav gap-2 bg-primary'>
                                    <li className='nav-item active  text-center' style={{ width: '100px' }}>
                                        <NavLink className='nav-link fw-bold navbar-button border ' to='/products'>
                                            所有商品
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </NavLink>
                                    </li>
                                    <li className='nav-item active  text-center' style={{ width: '100px' }}>
                                        <NavLink className='nav-link fw-bold navbar-button border ' to='/#news'>
                                            最新消息
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </NavLink>
                                    </li>
                                    <li className='nav-item active  text-center' style={{ width: '100px' }}>
                                        <NavLink className='nav-link fw-bold navbar-button border ' to='/about'>
                                            關於我們
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                            <div className='d-flex ms-3'>
                                <NavLink to='/cart' className='nav-link position-relative'>
                                    <i className='bi bi-bag-fill' id='cart-icon'></i>
                                    <span className='position-absolute top-0  translate-middle badge rounded-pill  bg-danger '>
                                        {cartData.carts?.length === 0 ? null : cartData.carts?.length}
                                    </span>
                                </NavLink>
                            </div>
                        </div>
                    </nav>

                    {/* mobile */}
                    <nav className='navbar navbar-expand-sm navbar-container h-auto d-block d-lg-none px-2'>
                        <div className='container d-flex '>
                            <NavLink
                                className='navbar-brand position-absolute fw-bold m-0'
                                to='/'
                                onClick={handleNavLinkClick}
                                style={{
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    top: '50%',
                                }}
                            >
                                OOTD工廠
                            </NavLink>
                            <button
                                className='btn btn-primary fs-5 border'
                                type='button'
                                data-bs-toggle='offcanvas'
                                data-bs-target='#offcanvasWithBothOptions'
                                aria-controls='offcanvasWithBothOptions'
                            >
                                <i className='bi bi-list'></i>
                            </button>
                            {/* <div className='collapse navbar-collapse bg-white' id='navbarNav'>
                                <ul className='navbar-nav d-flex flex-column'>
                                    <li className='nav-item text-center'>
                                        <NavLink
                                            className='nav-link fw-bold navbar-button border rounded-0'
                                            to='/products'
                                            onClick={handleNavLinkClick}
                                        >
                                            產品列表
                                        </NavLink>
                                    </li>
                                    <li className='nav-item active  text-center'>
                                        <NavLink
                                            className='nav-link fw-bold navbar-button border '
                                            to='/home#news'
                                            onClick={handleNavLinkClick}
                                        >
                                            最新消息
                                        </NavLink>
                                    </li>
                                    <li className='nav-item active text-center'>
                                        <NavLink
                                            className='nav-link fw-bold navbar-button border '
                                            to='/about'
                                            onClick={handleNavLinkClick}
                                        >
                                            關於我們
                                        </NavLink>
                                    </li>
                                    <li className='nav-item d-flex'>
                                        <NavLink
                                            to='/cart'
                                            className='nav-link position-relative border px-3 py-1 fw-bold rounded-0'
                                            onClick={handleNavLinkClick}
                                        >
                                            <i className='bi bi-bag-fill' id='cart-icon'></i>購物車
                                            <span className='position-absolute top-0  translate-middle badge rounded-pill  bg-danger '>
                                                {cartData.carts?.length}
                                            </span>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div> */}
                        </div>
                    </nav>

                    {/* <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions"><i className="bi bi-list"></i></button> */}

                    <div
                        className='offcanvas offcanvas-start'
                        data-bs-scroll='true'
                        tabIndex='-1'
                        id='offcanvasWithBothOptions'
                        aria-labelledby='offcanvasWithBothOptionsLabel'
                    >
                        <div className='offcanvas-header'>
                            <h5 className='offcanvas-title fw-bold' id='offcanvasWithBothOptionsLabel'>
                                OOTD工廠
                            </h5>
                            <button
                                type='button'
                                className='btn-close'
                                data-bs-dismiss='offcanvas'
                                aria-label='Close'
                            ></button>
                        </div>
                        <div className='offcanvas-body'>
                            <ul className='navbar-nav d-flex flex-column'>
                                <li className='nav-item text-center mb-3'>
                                    <NavLink
                                        className='nav-link fw-bold navbar-button border rounded-0'
                                        to='/products'
                                        onClick={handleNavLinkClick}
                                    >
                                        產品列表
                                    </NavLink>
                                </li>
                                <li className='nav-item active  text-center mb-3'>
                                    <NavLink
                                        className='nav-link fw-bold navbar-button border '
                                        to='/#news'
                                        onClick={handleNavLinkClick}
                                    >
                                        最新消息
                                    </NavLink>
                                </li>
                                <li className='nav-item active text-center mb-3'>
                                    <NavLink
                                        className='nav-link fw-bold navbar-button border '
                                        to='/about'
                                        onClick={handleNavLinkClick}
                                    >
                                        關於我們
                                    </NavLink>
                                </li>
                                <li className='nav-item d-flex'>
                                    <NavLink
                                        to='/cart'
                                        className='nav-link position-relative border px-3 py-1 fw-bold rounded-0 w-100 text-center'
                                        onClick={handleNavLinkClick}
                                    >
                                        <i className='bi bi-bag-fill' id='cart-icon'></i>購物車
                                        <span className='position-absolute top-0  translate-middle badge rounded-pill  bg-danger '>
                                            {cartData.carts?.length}
                                        </span>
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
