import ReactLoading from 'react-loading';

const Loading = ({isLoading}) => {


  return (
    <>
    {isLoading && (
                    <div style={{backgroundColor:'rgba(0,0,0,0.5', position:'fixed', top:0, 
                    bottom:0,left:0, right:0, zIndex:10000, display:'flex', 
                    justifyContent:'center', alignItems:'center', 
                    backdropFilter: 'blur(2px)', alignContent:'center'}}>
                        <p className='fs-3 text-white fw-bold p-0'>加載中</p>
                        <ReactLoading type='bubbles' color='white' height={60} width={100} />
                    </div>
                )}
    </>
  )
}

export default Loading
