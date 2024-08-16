import React,  { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderItemsMutation, useGetOrderDetailsMutation, useGetOrderDetailsNoUserMutation } from "../slices/orderAPIslice";
import {    useSendRescheduleEmailMutation,
  useUpdateStatusLogMutation,     useUpdatePaidOrderMutation  } from "../slices/orderAPIslice";
  import { useGetUserInfoMutation } from '../slices/usersApiSlice';
import { Form, Button, Row, Col, Container, ListGroup, Modal  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"; 
import { FaArrowLeft } from 'react-icons/fa';
import products from "../assets/data/products";
import { ListGroupItem } from "react-bootstrap";
import Loader from '../components/Loader';


import DatePicker from '../components/DatePicker';

import "../styles/orderDetails.css";


const RescheduleOrder = () => {
    const { orderId } = useParams();
    const orderID = orderId;
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [loadingItems, setLoadingItems] = useState(true);
    //const order = orderDetails[orderId];
    const detailsRef = useRef(null);
    const headerRef = useRef(null);
    const [remainingHeight, setRemainingHeight] = useState(0);

    const [displayDetails, setDisplayDetails] = useState([]);
    const [shortAddress, setShortAddress] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryDateUnformatted, setDeliveryDateUnformatted] = useState('');
    const [showModal, setShowModal] = useState(false);



    const [status, setStatus] = useState('');
    const [id, setID] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');


    const [dateDelivered, setDateDelivered] = useState('');
    const [orderTotalPrice, setOrderTotalPrice] = useState('');
    const [orderTotalQuantity, setOrderTotalQuantity] = useState('');
    const [freeDelivery, setFreeDelivery] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [merchantTransactionId, setMerchantTransactionId] = useState('');
    const [validOrder, setValidOrder] = useState(false);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateFormatted, setSelectedDateFormatted] = useState(null);

    const [startDate, setStartDate] = useState(new Date());

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [getOrderDetails, { isLoadingGetUserOrders }] = useGetOrderItemsMutation();
    const [getOrder, { isLoadingGetOrder }] = useGetOrderDetailsMutation();
    const [getPaidOrder, { isLoadingGetPaidOrder }] = useGetOrderDetailsNoUserMutation();
    const [getUserInfo, { isLoadingGetUserInfo }] = useGetUserInfoMutation();


    const [updatePaidOrderStatus, { isLoadingUpdateOrderStatus }] = useUpdatePaidOrderMutation();
    const [updatePaidOrderDate, { isLoadingUpdateOrderDate }] = useUpdatePaidOrderMutation();
    const [updateLog, { isLoadingUpdateLog }] = useUpdateStatusLogMutation();
    const [sendRescheduleMail, { isLoadingSendDeliveredMail }] = useSendRescheduleEmailMutation();




      const handleArrowClick = () => {
        navigate('/reschedule');
      };

      useLayoutEffect(() => {
        const updateHeight = () => {
          const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
          const detailsHeight = detailsRef.current ? detailsRef.current.offsetHeight : 0;

          const windowHeight = window.innerHeight;

    
          setRemainingHeight(windowHeight - 130 - 30 - headerHeight - detailsHeight);
         
        };
    
        // Initial calculation
        // updateHeight();
        setTimeout(updateHeight, 500);
    
        // Recalculate on window resize
        window.addEventListener('resize', updateHeight);
    
        return () => window.removeEventListener('resize', updateHeight);
      }, []);

      const handleShowModal = () => {
        setShowModal(true);

      };
    
      const handleCloseModal = () => {
        setShowModal(false);
      };

      const handleConfirmReschedule  = async () => {
        const options2 = {
          timeZone: 'Etc/GMT-2', // GMT+2 is represented as GMT-2 in IANA timezone database
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false // 24-hour format
      };

      const date = new Date(deliveryDate);
      const delDate = new Intl.DateTimeFormat('en-za', options2).format(date);
        if (status === 'Out For Delivery') {
          let statusNew = 'Cooling Process';
          const order = {
            _id: id,
            status: statusNew,
            deliveryDate: delDate,
          };

          //await updateLog({id, currentStatus, getherIngredientsTimestamp  });
          await updatePaidOrderStatus({order});
          await sendRescheduleMail({merchantTransactionId, email, name , surname, orderID, selectedDateFormatted  }); 
        } else {
          const order = {
            _id: id,
            deliveryDate: delDate,
        };
        await updatePaidOrderStatus({order});
        await sendRescheduleMail({merchantTransactionId, email, name , surname, orderID, selectedDateFormatted  });
      }
   navigate('/reschedule');
      }

      useEffect(() => {
        const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        let date = new Date(selectedDate)
let sd = date.toLocaleDateString('en-ZA', options);

setSelectedDateFormatted(sd);

    }, [selectedDate]);

    useEffect(() => {
        const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        
        const Order = async () => {
            try {
                const order = await getPaidOrder({ orderID }).unwrap();
                if (order) {
                  setValidOrder(true);
              }

                let orderDate = new Date(order.timestamp);
                let orderDateFormatted = orderDate.toLocaleDateString('en-ZA', options);
                let deliveryDate = new Date(order.deliveryDate);
                setDeliveryDateUnformatted(deliveryDate);
                let deliveryDateFormatted = deliveryDate.toLocaleDateString('en-ZA', options);

                let id = order.userID; 
                let user = await getUserInfo({ id }).unwrap();

                setName(user.name);
                setSurname(user.surname);
                setEmail(user.email);

                setMerchantTransactionId(order.merchantTransactionId)
                setStatus(order.status);
                setDateDelivered(order.actualDateDelivered);
                setDeliveryDate(deliveryDateFormatted);
                setFreeDelivery(order.freeDelivery);
                setOrderTotalPrice(order.totalPrice);
                setOrderTotalQuantity(order.totalQuantity);
                setShortAddress(order.shortAddress);
                setOrderDate(orderDateFormatted);
                setID(order._id);


            } catch (error) {
                console.error("Failed to fetch order:", error);
                setValidOrder(false);
              } finally {
                setLoadingDetails(false);
            };
        };
        

        
        const OrderDetails = async () => {
            try {
                const data = await getOrderDetails({ orderID }).unwrap();
                let outputArray = [];
            for (let i = 0; i < data.length; i++) {
                let product = products.find(product => product.id === data[i].orderItemCode);

                let picture = product ? product.image01 : null;
                let entry = {
                    itemCode: data[i].orderItemCode,
                    itemName: data[i].orderItemName,
                    itemPrice: data[i].orderItemPrice,
                    totalPrice: data[i].orderTotalPrice,
                    quantity: data[i].quantity,
                    itemPicture: picture
                    
                    //time: date.toLocaleDateString('en-ZA', options)
                   
                };
                outputArray.push(entry);
            }

                // Sort the array by timestamp in descending order (newest to oldest)
                outputArray.sort((a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate));



                setDisplayDetails(outputArray);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoadingItems(false);
            }
        };
        Order();
        OrderDetails();
    }, [orderID, getOrderDetails, getPaidOrder]);


    if (!orderID) {
        return <div>Order not found</div>;
    }

    if (!validOrder && (!loadingDetails || !loadingItems)) {
      return (
      <>
      <div className='ordersheader' ref={headerRef}>
      <div className="d-flex align-items-center">
        <div className="arrow">
          <FaArrowLeft onClick={handleArrowClick} />
        </div>
        <div className="profile flex-grow-1">
          <h1 className="text-center my-auto">Order Details</h1>
        </div>
      </div>
    </div>
      
      <div>Invalid Order</div>
      </>
      );
  }

    if (loadingDetails || loadingItems) {
      return (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
            <Loader animation="border" />
          </div>
        );
  }

    return (


<div className='orderdetails__page'>
  <Container>
    <div className='ordersheader' ref={headerRef}>
      <div className="d-flex align-items-center">
        <div className="arrow">
          <FaArrowLeft onClick={handleArrowClick} />
        </div>
        <div className="profile flex-grow-1">
          <h1 className="text-center my-auto">Reschedule Order</h1>
        </div>
      </div>
    </div>
    <div ref={detailsRef}>
      <Row className="pl-1 pr-1 orderrow_rowitem">
        <div className="orderdetails_rowitem">
          <div className="orderdetails_overview_card d-flex ">
            <div className="orderdetails_card-content">
              <Row>Status: {status}</Row>
              <Row>Order Number: {merchantTransactionId}</Row>
              <Row>Delivery Address: {shortAddress}</Row>
              <Row>Amount: R {orderTotalPrice}</Row>
              <Row>Number Of Meals: {orderTotalQuantity}</Row>
              {status === 'Delivered' ? (
                <Row>Delivery Date: {dateDelivered}</Row>
              ) : (
                <Row>Current Delivery Date: {deliveryDate}</Row>
              )}
            </div>
          </div>
        </div>
      </Row>
    </div>
    <Row className='orderrow_rowitem'>
    <div className='changedate_rowitem'>
      <Row >

        <div className='pl-3'>
        Change Delivery Date:
        </div>
      </Row>
      <Row>
    <DatePicker initialDate={deliveryDateUnformatted} onChange={(date) => setSelectedDate(date)} />
    </Row>
    <Row className='pt-4'>
    {selectedDate && <p>Selected Date: {selectedDateFormatted}</p>}
    </Row>
    <Row>
    <div className='button-container'>
    <Button onClick={() => handleShowModal()} disabled={!selectedDate || selectedDateFormatted === deliveryDate}>Reschedule</Button>
    </ div>
    </Row>
    
    </div>
    </Row>


    <Modal show={showModal} onHide={handleCloseModal} style={{ paddingTop: '150px' }}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>

              <p>Are you sure you want to move order Delivery Date</p>
              <p>From: {deliveryDate}</p>
              <p>To: {selectedDateFormatted}</p>

          </Modal.Body>
          <Modal.Footer className='d-flex justify-content-between'>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmReschedule}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

  </Container>
</div>

    );
};

export default RescheduleOrder;
