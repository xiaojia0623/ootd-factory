
const DeleteProductModal = ({close, text, handleDelete, id}) => {
  return (
    <div className='modal fade' tabIndex='-1' id='deleteModal' aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div className='modal-dialog'>
            <div className='modal-content'>
                <div className='modal-header bg-danger'>
                    <h5 className='modal-title text-light' id='exampleModalLabel'>刪除確認</h5>
                    <button
                        type='button'
                        className='btn-close'
                        onClick={close}
                        aria-label='Close'
                    ></button>
                </div>
                <div className='modal-body'>
                    <p>確定要刪除 <span className="text-danger fw-bold">{text} </span>?</p>
                </div>
                <div className='modal-footer'>
                    <button
                        type='button'
                        className='btn btn-secondary'
                        onClick={close}
                    >
                        取消
                    </button>
                    <button type='button' className='btn btn-primary' onClick={() => handleDelete(id)}>
                        確定
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DeleteProductModal;
