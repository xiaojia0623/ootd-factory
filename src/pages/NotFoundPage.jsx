import { useNavigate } from 'react-router-dom';  

const NotFoundPage = () => {
    const navigate = useNavigate();
  return (
    <div className='container d-flex flex-column justify-content-center align-items-center' style={{ height: '100vh' }}>
      <h1 className='fw-bold'>Oh No ~ 404 Not Found</h1>
      <h3><button type='button' className='btn btn-primary text-white' onClick={() => navigate(-1)}>回上一頁</button></h3>
    </div>
  )
}

export default NotFoundPage
