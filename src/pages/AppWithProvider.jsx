import { useReducer } from 'react';
import { HashRouter } from 'react-router-dom';
import App from '../App';
import { MessageContext, messageReducer, initState } from '../redux/messageStore';

const AppWithProvider = () => {
  const [message, dispatch] = useReducer(messageReducer, initState);

  return (
    <MessageContext.Provider value={{ message, dispatch }}>
      <HashRouter>
        <App />
      </HashRouter>
    </MessageContext.Provider>
  );
};

export default AppWithProvider;