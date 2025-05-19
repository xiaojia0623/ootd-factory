import { NavLink } from 'react-router-dom';

const Navbar = ({ cartData }) => {

    const handleNavLinkClick = () => {
        const navbar = document.getElementById('navbarNav');
        if (navbar.classList.contains('show')) {
            navbar.classList.remove('show');
        }
    };

  return (
    <div className='bg-white sticky-top shadow'>
      <div className='container p-0'>
        <nav className='navbar px-0 navbar-expand-lg bg-white web-navbar'>
          <NavLink
            className='navbar-brand position-absolute fw-bold'
            to='/'
            style={{
              left: '50%',
              transform: 'translate(-50%, -50%)',
              top: '50%',
            }}
          >
            OOTD工廠
          </NavLink>
          <div
            className='collapse navbar-collapse bg-white custom-header-md-open'
            
          >
            <ul className='navbar-nav gap-2'>
                <li
                    className='nav-item active  text-center'
                    style={{ width: '100px' }}
                >
                    <NavLink
                    className='nav-link fw-bold navbar-button border '
                    to='/products'
                    >
                    產品列表
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    </NavLink>
                </li>
                <li
                    className='nav-item active  text-center'
                    style={{ width: '100px' }}
                >
                    <NavLink
                    className='nav-link fw-bold navbar-button border '
                    to='/'
                    >
                    首頁
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    </NavLink>
                </li>
            </ul>
          </div>
          <div className='d-flex'>
            <NavLink to='/cart' className='nav-link position-relative'>
              <i className='bi bi-bag-fill' id='cart-icon'></i>
              <span className='position-absolute top-0  translate-middle badge rounded-pill  bg-danger '>
                {cartData.carts?.length}
              </span>
            </NavLink>
          </div>
        </nav>

        <nav className='navbar navbar-expand-lg bg-white navbar-container'>
          <div className='container d-flex '>
            <NavLink
              className='navbar-brand position-absolute fw-bold m-0'
              to='/'
              style={{
                left: '50%',
                transform: 'translate(-50%, -50%)',
                top: '50%',
              }}
              
            >
              OOTD工廠
            </NavLink>
            <button
              className='navbar-toggler ms-3 ms-md-0'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#navbarNav'
              aria-controls='navbarNav'
              aria-expanded='false'
              aria-label='Toggle navigation'
            >
              <span className='navbar-toggler-icon'></span>
            </button>
            <div className='collapse navbar-collapse  bg-white ' id='navbarNav'>
              <ul className='navbar-nav'>
                <li
                  className='nav-item active text-center'
                  style={{ width: '100px' }}
                >
                    <NavLink
                        className='nav-link fw-bold navbar-button border '
                        to='/'
                        style={{ borderRadius: '8px' }}
                        onClick={handleNavLinkClick}
                    >
                        首頁
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </NavLink>
                </li>
                <li
                  className='nav-item text-center'
                  style={{ width: '120px' }}
                >
                    <NavLink
                        className='nav-link fw-bold navbar-button border '
                        to='/products'
                        style={{ borderRadius: '8px' }}
                        onClick={handleNavLinkClick}
                    >
                        產品列表
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </NavLink>
                </li>
                <li className='nav-item d-flex'>
                  <NavLink
                    to='/cart'
                    className='nav-link position-relative border px-3 py-1 fw-bold'
                    style={{ borderRadius: '8px' }}
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
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
