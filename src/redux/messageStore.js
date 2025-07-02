import React, { createContext, useReducer } from "react";


// 初始狀態
export const initState = {
    type:'',
    title:'',
    text:''
}

// 建立 Context
export const MessageContext = createContext({
    message: initState,
    dispatch: () => {},
})

// Reducer
export const messageReducer = (state, action) => {
    switch(action.type) {
        case 'POST_MESSAGE':
            return {
                ...action.payload
            }
        case 'CLEAR_MESSAGE':
            return {
                ...initState
            }
        default:
            return state;
    }
}

// 成功/錯誤訊息處理
export function handleSuccessMessage(dispatch, res) {
    dispatch({
        type: 'POST_MESSAGE',
        payload: {
            type: 'success',
            title: '更新成功',
            text: res.data.message,
        }
    });
    setTimeout(() => {
        dispatch({
            type:'CLEAR_MESSAGE',
        })
    }, 3000)
}

export function handleErrorMessage(dispatch, error) {
    dispatch({
        type: 'POST_MESSAGE',
        payload: {
            type: 'danger',
            title: '失敗',
            text: Array.isArray(error?.response?.data?.message) ? error?.response?.data?.message.join('、') : error?.response?.data?.message,
        }
    });
    setTimeout(() => {
        dispatch({
            type:'CLEAR_MESSAGE',
        })
    }, 3000)
}


//  放在最下面的 Provider
export const MessageProvider = ({ children }) => {
  const [message, dispatch] = useReducer(messageReducer, initState);

  return React.createElement(
    MessageContext.Provider,
    { value: { message, dispatch } },
    children
  );
};