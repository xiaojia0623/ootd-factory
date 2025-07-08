import { BrowserRouter  } from 'react-router-dom';
import App from '../App';
//import { MessageProvider } from '../redux/messageStore';


const AppWithProvider = () => {
  return (
    <BrowserRouter basename="/ootd-factory">
      <App />
    </BrowserRouter >
  );
};

export default AppWithProvider;