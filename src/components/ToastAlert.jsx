import {  Toaster, ToastBar } from 'react-hot-toast';

const ToastAlert = () => {
  return (
    <>
    <Toaster position="top-right"
                toastOptions={{
                    className: 'toaster',
                    style: {
                    padding: '16px',
                    color: '#1E1E1E',
                    },
                    success: {
                        style: {
                            border: '2px solid lightgreen',
                        },
                    },
                    error: {
                        style: {
                            border: '2px solid red',
                        },
                    },
                }}>
        {(t) => (
            <ToastBar toast={t}>
            {({ icon, message }) => (
                <>
                {icon}
                {message}
                
                </>
            )}
            </ToastBar>
        )}
    </Toaster>
    </>
  )
}

export default ToastAlert
