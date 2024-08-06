import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import './styles/app.css'; // Import your global CSS if needed

const App = () => {
  return (
    <>
      <Header />
    <ToastContainer /> 
      <Container> 
        <Outlet />
      </Container>
    </>
  );
};

export default App;

