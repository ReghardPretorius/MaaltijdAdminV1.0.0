import Hero from '../components/Hero';
import {  Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import {useGetNumberOfDeliveriesForTodayMutation} from "../slices/orderAPIslice";
import Button from "react-bootstrap/Button";
import Badge from 'react-bootstrap/Badge';

import { useLogoutMutation } from '../slices/adminAPISlice';
import { logout } from '../slices/authSlice';

 //import { useNavigate } from 'react-router-dom';

 import "../styles/home.css";
 import "../styles/background.css";
 import "../styles/user.css"; 
  

const HomeScreen = () => {

  const [logoutApiCall] = useLogoutMutation();

  const now = new Date();
  const [messageDeliveries, setMessageDeliveries] = useState('');
  const [messageOrdersOormore, setMessageOrdersOormore] = useState('');
  const [messageOrdersTomorrow, setMessageOrdersTomorrow] = useState('');
  const [numberOfDeliveries, setNumberOfDeliveries] = useState('');
  const [numberOfOrdersTomorow, setNumberOfOrdersTomorow] = useState('');
  const [numberOfOrdersDayAfterTomorrow, setNumberOfOrdersDayAfterTomorrow] = useState('');
  const navigate = useNavigate();
  const [pageNumber] = useState(0);

  const { adminInfo } = useSelector((state) => state.auth);
  const [getNumberOfDeliveries, { isLoadingGetNumberOfDeliveries }] = useGetNumberOfDeliveriesForTodayMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    const now = new Date();
    setMessageDeliveries(`Deliveries for Today: ${formatDate(now)}`);
    setMessageOrdersTomorrow(`Orders for Tomorrow: ${formatDate(addDays(now,1))}`);
    setMessageOrdersOormore(`Orders for "Oormore": ${formatDate(addDays(now,2))}`);
    GetNumberOfDeliveries();
    GetNumberOfOrdersTomorrow();
    GetNumberOfOrdersDayAfterTomorrow();
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
    }
  };










    const addDays = (date, days) => {
      let result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }


  const GetNumberOfDeliveries = async () => {

    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getUTCDate()).padStart(2, '0');
    const formattedNow = `${year}-${month}-${day}T00:00:00.000+00:00`;
    try {
        const resNumDel = await getNumberOfDeliveries({ formattedNow }).unwrap();
        setNumberOfDeliveries(resNumDel);

    } catch (error) {
        console.error("Failed to fetch order:", error);

      } finally {

    };
  };


;

  const GetNumberOfOrdersTomorrow = async () => {


    const tomorrow = addDays(now, 1);
    const year = tomorrow.getUTCFullYear();
    const month = String(tomorrow.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(tomorrow.getUTCDate()).padStart(2, '0');
    const formattedNow = `${year}-${month}-${day}T00:00:00.000+00:00`;
    try {
        const resNumDel = await getNumberOfDeliveries({ formattedNow }).unwrap();
        setNumberOfOrdersTomorow(resNumDel);
    } catch (error) {
        console.error("Failed to fetch order:", error);

      } finally {

    };
  };

  const GetNumberOfOrdersDayAfterTomorrow = async () => {
    const dayAfterTomorrow = addDays(now, 2)

    const year = dayAfterTomorrow.getUTCFullYear();
    const month = String(dayAfterTomorrow.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(dayAfterTomorrow.getUTCDate()).padStart(2, '0');
    const formattedNow = `${year}-${month}-${day}T00:00:00.000+00:00`;
    try {
        const resNumDel = await getNumberOfDeliveries({ formattedNow }).unwrap();
        setNumberOfOrdersDayAfterTomorrow(resNumDel);
    } catch (error) {
        console.error("Failed to fetch order:", error);

      } finally {

    };
  };
    
  const handleDeliveriesClicked = () => {
    navigate('/delivery/main');
  }

  
  const handleOrdersTomorrowClicked = () => {
    navigate('/tomorrow');
  }


  const handleOrdersOormoreClicked = () => {
    navigate('/dayafter');
  }


  const handleManageWalletClicked = () => {
    navigate('/wallet');
  }


  const handleReshueduleClicked = () => {
    navigate('/reschedule');
  }


  


  

  



  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-ZA', options).format(date);
  };




  return (
<>
    {adminInfo ? (
          <div className="container">
          <div className="email pt-2">
            <h4>Hello {adminInfo.name}</h4>
          </div>
        <div className="user__item-list">
            <div className="user_card" onClick={handleDeliveriesClicked}>
            <div className="user_card-title">
                  <Row>
                  <Col  xs={9} className='my-1'>
                  <h5 className='my-1'>
                    {messageDeliveries}
                    </h5>
                  </Col>
                  <Col xs={3} className="d-flex justify-content-end align-items-center">
                  <Badge bg="primary" pill  style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>
         {numberOfDeliveries}
        </Badge>
        </Col>
        </Row>
                </div>
              </div>

              <div className="user_card" onClick={handleOrdersTomorrowClicked}>
                <div className="user_card-title">
                  <Row>
                    <Col  xs={9} className='my-1'>
                      <h5 className='my-1'>
                        {messageOrdersTomorrow}
                        </h5>
                    </Col>
                    <Col xs={3} className="d-flex justify-content-end align-items-center">
                      <Badge bg="primary" pill  style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>
                        {numberOfOrdersTomorow}
                      </Badge>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="user_card" onClick={handleOrdersOormoreClicked}>
                <div className="user_card-title">
                  <Row>
                    <Col  xs={9} className='my-1'>
                      <h5 className='my-1'>
                        {messageOrdersOormore}
                        </h5>
                    </Col>
                    <Col xs={3} className="d-flex justify-content-end align-items-center">
                      <Badge bg="primary" pill  style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>
                        {numberOfOrdersDayAfterTomorrow}
                      </Badge>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="user_card" onClick={handleReshueduleClicked}>
                <div className="user_card-title">
                  <Row>
                    <Col  xs={9} className='my-1'>
                      <h5 className='my-1'>
                      Reschedule Orders
                        </h5>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="user_card" onClick={handleManageWalletClicked}>
                <div className="user_card-title">
                  <Row>
                    <Col  xs={9} className='my-1'>
                      <h5 className='my-1'>
                        Manage User Wallets
                        </h5>
                    </Col>
                  </Row>
                </div>
              </div>
    

            <div className="mt-5 d-flex justify-content-end">
          <Button onClick={logoutHandler}>
            Logout
          </Button>
        </div>
          </div>
    
    
        </div>
    ) : (
      <div className='welcomebanner'>
      <Hero />
      </div>
    )}
</>
  );

};
export default HomeScreen;


