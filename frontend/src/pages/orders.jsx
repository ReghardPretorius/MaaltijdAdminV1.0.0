import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUserOrdersMutation } from "../slices/orderAPIslice";
import { useDispatch, useSelector } from "react-redux"; 
import { Form, Button, Row, Col, Container, ListGroup  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../components/Loader';
import { FaRegGrinTongueWink } from 'react-icons/fa';

import "../styles/orders.css"; 

const OrdersList = () => {
    const [displayOrders, setDisplayOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [getUserOrders, { isLoadingGetUserOrders }] = useGetUserOrdersMutation();
    const userID = useSelector((state) => state.auth.userInfo._id);


    const handleOrderClicked = (orderId) => {
        // Handle order click logic here
        navigate(`/user/orders/${orderId}`);
        
      };

      const handleArrowClick = () => {
        navigate('/user');
      };

    useEffect(() => {
        const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        const UserOrders = async () => {
            try {
                const data = await getUserOrders({ userID }).unwrap();
                let outputArray = [];
                for (let i = 0; i < data.length; i++) {
                    let date = new Date(data[i].timestamp);
                    let dateDeliveredObject = new Date(data[i].actualDateDelivered);
                    let deliveryDateObject = new Date(data[i].deliveryDate);
                    let entry = {
                        _id: data[i]._id,
                        timestamp: data[i].timestamp,
                        totalPrice: data[i].totalPrice,
                        totalQuantity: data[i].totalQuantity,
                        OGOrderID: data[i].OGOrderID,
                        status: data[i].status,
                        dateDelivered: dateDeliveredObject.toLocaleDateString('en-ZA', options),
                        deliveryDate: deliveryDateObject.toLocaleDateString('en-ZA', options),
                        time: date.toLocaleDateString('en-ZA', options)
                        
                    };

                    outputArray.push(entry);
                }

                // Sort the array by timestamp in descending order (newest to oldest)
                outputArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));



                setDisplayOrders(outputArray);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        UserOrders();
    }, [userID, getUserOrders]);

    const OrderCard = ({ order, onClick }) => {
        return (
          <div className="orders_card" onClick={onClick}>
            <div className="order_card-title">
              <h4><span>{order.time}</span></h4>
            </div>
            <div className="ocard-content">
              {/* <Row>Amount: R{order.totalPrice}</Row>
              <Row>Number Of Meals: {order.totalQuantity}</Row>
              <Row>Status: {order.status}</Row> */}

<Row><span><i>Amount:</i> <b>R{order.totalPrice}</b></span></Row>
<Row><span><i>Number Of Meals:</i> <b>{order.totalQuantity}</b></span></Row>
<Row><span><i>Status:</i> <b>{order.status}</b></span></Row>

              {/* <Row>Estimated Delivery Date: {order.DeliveryDate}</Row> */}
              {order.Status === 'Delivered' ? (
  <Row><span>
    <i>Date Delivered:</i> <b>{order.dateDelivered}</b>
    </span></Row>
) : (
  <Row><span>
    <i>Est. Delivery Date:</i> <b>{order.deliveryDate}</b>
    </span></Row>
)}
            </div>
          </div>
        );
      };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
              <Loader animation="border" />
            </div>
          );
    }

    return (
        <Container>
        <div>
            <div className='ordersheader'>
            <div className="d-flex align-items-center mb-3">
  <div className="arrow">
    <FaArrowLeft onClick={handleArrowClick} />
  </div>
  <div className="profile flex-grow-1">
    <h1 className="text-center my-auto">Orders</h1>
  </div>
</div>
            </div>
            <div className="order__item-list">
          {displayOrders.length === 0 ? (
            <Container>
            <Row className='pl-1 pr-1 '>
                    <div className="orowitem">
                  <div className="noorderyet_card">
                  {/* <div class="card-title">Special Offer!</div> */}
                  <span>
                  <div className="ocard-content px-4">No Orders (Yet <span role="img" aria-label="grin tongue wink">😜</span>)</div>
                  </span>
              </div>
              </div>
                  </Row>
            </Container>

) : (

  <>
  
  {displayOrders.map(order => (

              <OrderCard order={order} key={order._id} onClick={() => handleOrderClicked(order.OGOrderID)}/>

        ))}

        {/* <div className="orders-list">
      <ul>
        {displayOrders.map(order => (
          <li key={order._id}>
            <Link to={`/user/orders/${order._id}`}>
              <OrderCard order={order} />
            </Link>
          </li>
        ))}
      </ul>
    </div> */}

{/* )} */}
    </>

)}
        </div>
</div>
</Container>

       
    );
};

export default OrdersList;
