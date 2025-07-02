import { BrowserRouter  } from 'react-router-dom';
import App from '../App';
import { MessageProvider } from '../redux/messageStore';


const AppWithProvider = () => {
  return (
    <MessageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter >
    </MessageProvider>
  );
};

export default AppWithProvider;