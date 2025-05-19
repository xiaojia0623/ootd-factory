import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import '@fortawesome/fontawesome-free/css/all.min.css';


const TopButton = () => {

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
        setVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


  return (
    <div className={`top-button ${visible ? 'show' : 'hide'}`}  onClick={scrollToTop}
        style={{ borderRadius:'50%',  }}>
        <Link className="goTopBtn jq-goTop" >
            <i className="fas fa-arrow-up"></i>
         </Link>
    </div>
  )
}

export default TopButton
