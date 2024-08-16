import {  Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import {useGetNumberOfDeliveriesForTodayMutation} from "../slices/orderAPIslice";
import Loader from '../components/Loader';
import { AiFillCheckCircle} from "react-icons/ai";

import { useLogoutMutation } from '../slices/adminAPISlice';
import { logout } from '../slices/authSlice';
import { FaArrowLeft } from 'react-icons/fa';


 import "../styles/home.css";
 import "../styles/background.css";
 import "../styles/user.css"; 
 import "../styles/orders.css";
 import "../styles/shopping-cart.css";
  

const TomorrowMain = () => {


  const now = new Date();
const navigate = useNavigate();
const [loadingMessage, setLoadingMessage] = useState(true);
const [messageOrdersTomorrow, setMessageOrdersTomorrow] = useState('');
const [message, setMessage] = useState('');


const addDays = (date, days) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };


  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-ZA', options).format(date);
  };





  const { adminInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();


    
  const handleBackClicked = () => {
    navigate('/');
  }

  
  const handleAllOrdersClicked = () => {
    navigate('/tomorrow/all');
  }


  const handleSplitOrdersClicked = () => {
    navigate('/tomorrow/individual');
  }

  
  useEffect(() => {
    const now = new Date();
    setMessageOrdersTomorrow(`${formatDate(addDays(now,1))}`);
  }, []);


  useEffect(() => {


    const intervalId = setInterval(() => {
      const now = new Date();
      //now.setHours(now.getHours() + 24);
//const now = now1+1;
      const dayOfWeek = now.getDay(); // Sunday - Saturday : 0 - 6
      // Set target time to 12:00:00 for the current day
      const targetYear = now.getFullYear();
      const targetMonth = now.getMonth();
      const targetDay = now.getDate();
      const targetTime = new Date(targetYear, targetMonth, targetDay, 12, 0, 0);
      const difference = targetTime - now;
  
      const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-ZA', options).format(date);
      };
  
      const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      };
  
      let nextDeliveryDate;
  
      if (dayOfWeek >= 1 && dayOfWeek <= 4) {
        // Monday - Thursday
        if (difference > 0) {
          const hours = Math.floor(Math.abs(difference) / (1000 * 60 * 60));
          const minutes = Math.floor(Math.abs((difference % (1000 * 60 * 60)) / (1000 * 60)));
          const seconds = Math.floor(Math.abs((difference % (1000 * 60)) / 1000));
  
          
          setMessage(`Time left to order:  ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
         setLoadingMessage(false);
        } else {
          nextDeliveryDate = addDays(now, 2);
          setMessage(`Orders Finalised`);
          setLoadingMessage(false);
        }
      } else if (dayOfWeek === 5) {
        // Friday
        if (difference > 0) {
          const hours = Math.floor(Math.abs(difference) / (1000 * 60 * 60));
          const minutes = Math.floor(Math.abs((difference % (1000 * 60 * 60)) / (1000 * 60)));
          const seconds = Math.floor(Math.abs((difference % (1000 * 60)) / 1000));
  
          setMessage(`Time left to order: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          setLoadingMessage(false);
        } else {
           // Next Monday
          setMessage(`Orders Finalised`);
          setLoadingMessage(false);
        }
      } else if (dayOfWeek === 6) {
        // Saturday
        if (difference > 0) {
           // Next Monday
          setMessage(`No orders for tomorrow`);
          setLoadingMessage(false);
        } else {
          // Next Tuesday
          setMessage(`No orders for tomorrow`);
          setLoadingMessage(false);
        }
      } else if (dayOfWeek === 0) {
        // Sunday
         // Next Tuesday
        setMessage(`Orders Finalised`);
        setLoadingMessage(false);
      }
  
    }, 1000);
  
    return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
  }, []);

  if (loadingMessage) {
    return (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
          <Loader animation="border" />
        </div>
      );
}


  

  return (
<>

          <div className="container">
          <div className='ordersheader'>
          <div className="d-flex align-items-center mb-3">
            <div className="arrow">
              <FaArrowLeft onClick={handleBackClicked} />
            </div>
            <div className="profile flex-grow-1">
              <h1 className="text-center my-auto">Orders for Tomorrow {messageOrdersTomorrow}</h1>
            </div>
          </div>
        </div>
        <Row className='pl-1 pr-1 '>
<div className="messageCard">
          <div className="rowitem">
        <div className="shopping_card">
        <div className="card-content"><span>
        {message === 'Orders Finalised' ? (
          <AiFillCheckCircle className="checkoutIcon pr-2" style={{ color: 'green' }}/>
        ) : null}
            {message}         </span>

        </div>
    </div>
    </div>
    </div>
        </Row> 


        <div className="user__item-list">
            <div className="user_card" onClick={handleAllOrdersClicked}>
            <div className="user_card-title">
                  <Row>
                  <Col  xs={12} className='my-1'>
                  <h5 className='my-1'>
                    View All Items
                    </h5>
                  </Col>
        </Row>
                </div>
              </div>

              <div className="user_card" onClick={handleSplitOrdersClicked}>
                <div className="user_card-title">
                  <Row>
                    <Col  xs={12} className='my-1'>
                      <h5 className='my-1'>
                        View Individual Orders
                        </h5>
                    </Col>
                  </Row>
                </div>
              </div>
          </div>
    
    
        </div>


</>
  );

};
export default TomorrowMain;