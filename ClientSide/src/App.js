import { Provider } from 'react-redux';
import './App.css';
import { Routing } from './Components/Navigation/Routing';
import store from './Redux/Store';


function App() {
  return (
    <>
      <Provider store={store}>
        <Routing></Routing>
      </Provider>


    </>
  );
}

export default App;
