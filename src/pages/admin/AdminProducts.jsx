import {useEffect, useRef, useState, useContext} from 'react';
import axios from 'axios';
import ProductModal from '../../components/ProductModal';
import DeleteModal from '../../components/DeleteModal';
import Pagination from '../../components/Pagination';
import { Modal } from 'bootstrap';
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../redux/messageStore';

const VITE_PATH = import.meta.env.VITE_API_PATH;

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});

    //type: 決定modal 展開的用途
    const [type, setType] = useState('create'); //edit
    //暫存方法
    const [tempProduct, setTempProduct] = useState({})

    const [, dispatch] = useContext(MessageContext);

    const productModal = useRef(null);
    const deleteModal = useRef(null);


    useEffect(() => {
      productModal.current = new Modal('#productModal', {
        backdrop: 'static',
        keyboard: false,
      });
      deleteModal.current = new Modal('#deleteModal', {
        backdrop: 'static',
        keyboard: false,
      });
        getProducts();
    }, []);
      
    const getProducts = async(page=1) => {
      const productRes = await axios.get(
        `/v2/api/${VITE_PATH}/admin/products?page=${page}`
      );
      setProducts(productRes.data.products);
      setPagination(productRes.data.pagination);
    }

    const openProductModal = (type, product) => {
      setType(type);
      setTempProduct(product);
      productModal.current.show();
    }

    const closeProductModal = () => {
      productModal.current.hide();
      
    }

    const openDeleteModal = (product) => {
      setTempProduct(product);
      deleteModal.current.show();
    }

    const closeDeleteModal = () => {
      deleteModal.current.hide();
    }

    const deleteProduct = async(id) => {
      try{
        const res = await axios.delete(`/v2/api/${VITE_PATH}/admin/product/${id}`)
        if (res.data.success) {
          getProducts();
          closeDeleteModal();
        }
        handleSuccessMessage(dispatch, res);
      }catch(error){
        handleErrorMessage(dispatch, error);
      }
    }

  return (
    <div className='p-3'>
      <ProductModal closeProductModal={closeProductModal} getProducts={getProducts} tempProduct={tempProduct} type={type}/>
      <DeleteModal close={closeDeleteModal} text={tempProduct.title} handleDelete={deleteProduct} id={tempProduct.id}/>
      <h3>產品列表</h3>
      <hr />
      <div className='text-end'>
        <button type='button' className='btn btn-primary btn-sm' onClick={() => openProductModal('create', {})}>
          建立新商品
        </button>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>產品id</th>
            <th scope='col'>分類</th>
            <th scope='col'>名稱</th>
            <th scope='col'>原價</th>
            <th scope='col'>售價</th>
            <th scope='col'>啟用狀態</th>
            <th scope='col'>編輯</th>
          </tr>
        </thead>
        <tbody>
            {products.map((product) => {
                return(
                    <tr key={product.id}>
                      <td>{product.id}</td>
                        <td>{product.category}</td>
                        <td>{product.title}</td>
                        <td>$ {product.origin_price}</td>
                        <td>$ {product.price}</td>
                        <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                        <td>
                        <button type='button' className='btn btn-primary btn-sm' onClick={() => openProductModal('edit', product)}>
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
                )
            })}
          
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getProducts}/>
      
    </div>
  );
};

export default AdminProducts;
