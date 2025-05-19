import axios from 'axios';
import { useContext, useEffect, useState, useRef } from 'react';
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../redux/messageStore';

const VITE_PATH = import.meta.env.VITE_API_PATH;

const ProductModal = ({
  closeProductModal,
  getProducts,
  type,
  tempProduct,
}) => {
  const [tempData, setTempData] = useState({
    title: '',
    category: '',
    origin_price: 100,
    price: 300,
    unit: '',
    description: '',
    content: '',
    is_enabled: 1,
    imageUrl: '',
    imagesUrl: [],
  });

  const [, dispatch] = useContext(MessageContext);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (type === 'create') {
      setTempData({
        title: '',
        category: '',
        origin_price: 100,
        price: 300,
        unit: '',
        description: '',
        content: '',
        is_enabled: 1,
        imageUrl: '',
        imagesUrl: [],
      });
    } else if (type === 'edit') {
      setTempData(tempProduct);
    }
  }, [type, tempProduct]);

  const handleChange = e => {
    const { name, value } = e.target;

    if (['price', 'origin_price'].includes(name)) {
      setTempData({ ...tempData, [name]: Number(value) });
      return;
    } else if (name === 'is_enabled') {
      setTempData({ ...tempData, [name]: +e.target.checked });
    } else {
      setTempData({ ...tempData, [name]: value });
    }
  };

  //判斷第幾個index新增圖片，監聽input內change事件
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempData.imagesUrl];
    newImages[index] = value;
    setTempData({
      ...tempData,
      imagesUrl: newImages,
    });
  };

  const submit = async () => {
    try {
      let api = `/v2/api/${VITE_PATH}/admin/product`;
      let method = 'post';
      if (type === 'edit') {
        api = `/v2/api/${VITE_PATH}/admin/product/${tempProduct.id}`;
        method = 'put';
      }
      const res = await axios[method](api, { data: tempData });
      handleSuccessMessage(dispatch, res);
      closeProductModal();
      // 清空 input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      getProducts();
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };

  const uploadFile = async file => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file-to-upload', file);

    try {
      await axios.post(`/v2/api/${VITE_PATH}/admin/upload`, formData);
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };

  //多圖區新增按鈕
  const handleAddImage = () => {
    const newImages = [...tempData.imagesUrl, ''];

    setTempData({
      ...tempData,
      imagesUrl: newImages,
    });
  };
  //多圖區刪除按鈕
  const handleRemoveImage = () => {
    const newImages = [...tempData.imagesUrl];

    newImages.pop();

    setTempData({
      ...tempData,
      imagesUrl: newImages,
    });
  };

  return (
    <div
      className='modal fade'
      id='productModal'
      tabIndex='-1'
      aria-labelledby='exampleModalLabel'
      //aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='exampleModalLabel'>
              {type === 'create' ? '建立新商品' : `編輯 ${tempData.title}`}
            </h1>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={closeProductModal}
            ></button>
          </div>

          <div className='modal-body'>
            <div className='row'>
              <div className='col-sm-4'>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='customFile'>
                    圖片上傳
                    <input
                      type='file'
                      ref={fileInputRef}
                      id='customFile'
                      className='form-control'
                      accept='.jpg,.jpeg,.png'
                      name='imgupdate'
                      onChange={uploadFile}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='image'>
                    主圖 (請輸入圖片連結)
                    <div className='input-group mb-2'>
                      <input
                        type='text'
                        name='imageUrl'
                        id='image'
                        value={tempData.imageUrl}
                        placeholder='請輸入圖片連結'
                        className='form-control'
                        onChange={handleChange}
                      />
                    </div>
                  </label>
                  <img
                    src={tempData.imageUrl}
                    alt={tempData.imageUrl}
                    className='img-fluid'
                  />
                </div>

                {/* 副圖 */}
                <div className='p-3'>
                  {tempData.imagesUrl?.map((image, index) => (
                    <div key={index} className='mb-2'>
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className='form-label'
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        value={image}
                        onChange={e => handleImageChange(e, index)}
                        id={`imagesUrl-${index + 1}`}
                        type='text'
                        className='form-control mb-2'
                        placeholder={`圖片網址 ${index + 1}`}
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className='img-fluid mb-3'
                        />
                      )}
                    </div>
                  ))}
                  <div className='btn-group w-100'>
                    {tempData.imagesUrl?.length < 5 &&
                      tempData.imagesUrl[tempData.imagesUrl?.length - 1] !==
                        '' && (
                        <button
                          onClick={handleAddImage}
                          className='btn btn-outline-primary btn-sm w-100'
                        >
                          新增圖片
                        </button>
                      )}
                    {tempData.imagesUrl?.length > 1 && (
                      <button
                        onClick={handleRemoveImage}
                        className='btn btn-outline-danger btn-sm w-100'
                      >
                        取消圖片
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className='col-sm-8'>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='title'>
                    標題
                    <input
                      type='text'
                      id='title'
                      name='title'
                      placeholder='請輸入標題'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.title}
                    />
                  </label>
                </div>
                <div className='row'>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='category'>
                      分類
                      <input
                        type='text'
                        id='category'
                        name='category'
                        placeholder='請輸入分類'
                        className='form-control'
                        onChange={handleChange}
                        value={tempData.category}
                      />
                    </label>
                  </div>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='unit'>
                      單位
                      <input
                        type='unit'
                        id='unit'
                        name='unit'
                        placeholder='請輸入單位'
                        className='form-control'
                        onChange={handleChange}
                        value={tempData.unit}
                      />
                    </label>
                  </div>
                </div>
                <div className='row'>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='origin_price'>
                      原價
                      <input
                        type='number'
                        id='origin_price'
                        name='origin_price'
                        placeholder='請輸入原價'
                        className='form-control'
                        onChange={handleChange}
                        value={tempData.origin_price}
                      />
                    </label>
                  </div>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='price'>
                      售價
                      <input
                        type='number'
                        id='price'
                        name='price'
                        placeholder='請輸入售價'
                        className='form-control'
                        onChange={handleChange}
                        value={tempData.price}
                      />
                    </label>
                  </div>
                </div>
                <hr />
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='description'>
                    產品描述
                    <textarea
                      type='text'
                      id='description'
                      name='description'
                      placeholder='請輸入產品描述'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.description}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='content'>
                    說明內容
                    <textarea
                      type='text'
                      id='content'
                      name='content'
                      placeholder='請輸入產品說明內容'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.content}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='w-100 form-check-label'
                      htmlFor='is_enabled'
                    >
                      是否啟用
                      <input
                        type='checkbox'
                        id='is_enabled'
                        name='is_enabled'
                        placeholder='請輸入產品說明內容'
                        className='form-check-input'
                        onChange={handleChange}
                        checked={tempData.is_enabled}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={closeProductModal}
            >
              關閉
            </button>
            <button type='button' className='btn btn-primary' onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
