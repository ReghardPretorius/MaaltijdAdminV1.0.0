import { Container, Row, Modal } from "react-bootstrap";
import products from "../assets/data/products";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { useGetUndeliveredOrdersMutation, useGetOrderItemsMutation,     useSendDeliveredEmailMutation,
    useUpdateStatusLogMutation,     useUpdatePaidOrderMutation  } from "../slices/orderAPIslice";
import Button from "react-bootstrap/Button";
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../components/Loader';
import { useGetUserInfoMutation } from '../slices/usersApiSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../styles/home.css";
import "../styles/background.css";
import "../styles/user.css"; 
import "../styles/orders.css"; 
import "../styles/deliveryMain.css"; 

const Reschedule = () => {

  const [displayOrders, setDisplayOrders] = useState([]);
  const [toDeliverGlobal, setToDeliver] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [getUndeliveredOrders, { isLoadingUndeliveredOrders }] = useGetUndeliveredOrdersMutation();
  const [getUserInfo, { isLoadingGetUserInfo }] = useGetUserInfoMutation();
  const [getOrderDetails, { isLoadingGetUserOrders }] = useGetOrderItemsMutation();

  const [updatePaidOrderStatus, { isLoadingUpdateOrderStatus }] = useUpdatePaidOrderMutation();
  const [updatePaidOrderDate, { isLoadingUpdateOrderDate }] = useUpdatePaidOrderMutation();
  const [updateLog, { isLoadingUpdateLog }] = useUpdateStatusLogMutation();
  const [sendDeliveredMail, { isLoadingSendDeliveredMail }] = useSendDeliveredEmailMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getUTCDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}T00:00:00.000+00:00`;
    const OrdersForDelivery = async () => {
        try {
            const data = await getUndeliveredOrders().unwrap();
            let outputArray = [];
            for (let i = 0; i < data.length; i++) {
                let date = new Date(data[i].timestamp);
                let dateDeliveredObject = new Date(data[i].actualDateDelivered);
                let deliveryDateObject = new Date(data[i].deliveryDate);
                let id = data[i].userID; 
                let user = await getUserInfo({ id }).unwrap();
                let orderID = data[i].OGOrderID;
                let  dishes = await getOrderDetails({ orderID }).unwrap();
                let orderMeals = [];
            for (let i = 0; i < dishes.length; i++) {
                let product = products.find(product => product.id === dishes[i].orderItemCode);
                let picture = product ? product.image01 : null;
                let entry = {
                    itemCode: dishes[i].orderItemCode,
                    itemName: dishes[i].orderItemName,
                    itemPrice: dishes[i].orderItemPrice,
                    totalPrice: dishes[i].orderTotalPrice,
                    quantity: dishes[i].quantity,
                    itemPicture: picture
                };
                orderMeals.push(entry);
            }
                let entry = {
                    userName: user.name,
                    userSurname: user.surname,
                    userEmail: user.email ,
                    userCell: user.cellNumber,
                    _id: data[i]._id,
                    timestamp: data[i].timestamp,
                    totalPrice: data[i].totalPrice,
                    totalQuantity: data[i].totalQuantity,
                    OGOrderID: data[i].OGOrderID,
                    shortAddress: data[i].shortAddress,
                    deliveryAddress: data[i].deliveryAddress,
                    status: data[i].status,
                    merchantTransactionId: data[i].merchantTransactionId,
                    dateDelivered: dateDeliveredObject.toLocaleDateString('en-ZA', options),
                    deliveryDate: deliveryDateObject.toLocaleDateString('en-ZA', options),
                    time: date.toLocaleDateString('en-ZA', options),
                    meals: orderMeals
                };
                outputArray.push(entry);
            }

            // Sort the array by timestamp in ascending order (oldest to newest)
            outputArray.sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));

            let ordersToShow = [];
            ordersToShow = outputArray.filter(entry => entry.status !== 'Delivered');

            setDisplayOrders(ordersToShow);

        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    OrdersForDelivery();
  }, []);


  const handleArrowClick = () => {
    navigate('/');
  }

  const handleRescheduleClicked = (orderId) => {
    navigate(`/reschedule/order/${orderId}`);
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-ZA', options).format(date);
  };

  const AllOrders = ({ orders, handleToOutForDelivery }) => {

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModalReschedule, setShowModalReschedule] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
      };
  
    const handleShowModal = (order) => {
      setSelectedOrder(order);
      setShowModalReschedule(true);
    };
  
    const handleCloseModal = () => {
        setShowModalReschedule(false);
      setSelectedOrder(null);
    };



    const handleConfirm = async () => {
      const entryToMove = toDeliverGlobal.find(entry => entry._id === selectedOrder._id);
      if (entryToMove) {
        entryToMove.status = 'Out For Delivery';
    }

    const order = {
      _id: entryToMove._id,
      status: entryToMove.status
    };

    let merchantTransactionId = entryToMove.merchantTransactionId;
    let email = entryToMove.userEmail;
    let name = entryToMove.userName;
    let surname = entryToMove.userSurname;
    let orderID = entryToMove.OGOrderID;
    let id = entryToMove.OGOrderID;

    let outForDeliveryTimestamp = new Date();
    let currentStatus = 'Out For Delivery'

    await updateLog({id, currentStatus, outForDeliveryTimestamp  });
    await updatePaidOrderStatus({order});
    //await sendOutForDeliveryMail({merchantTransactionId, email, name , surname, orderID  });   


      handleCloseModal();
    };
  
    return (
      <div>
        {orders.map((order, orderIndex) => (
          <div key={orderIndex} className='reschedule_card'>
            <p><strong>Name:</strong> {order.userName} {order.userSurname}</p>
            <p><strong>Cell:</strong> {order.userCell}</p>
            <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>
            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
            <p><strong>Short Address:</strong> {order.shortAddress}</p>
            <p><strong>Current Status:</strong> {order.status}</p>
  
            <h5>Meals</h5>
            <ul>
              {order.meals.map((meal, mealIndex) => (
                <li key={mealIndex}>
                  {meal.quantity}x {meal.itemName}
                </li>
              ))}
            </ul>  <div className='button-container'>
            <div className='button-container'>
        <Row className='button-row'>
          <Button onClick={() => handleRescheduleClicked(order.OGOrderID)}>Reschedule Order</Button>
        </Row>
      </div>
  </div>
  </div>
        ))}
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
              <h1 className="text-center my-auto">Reschedule</h1>
            </div>
          </div>
        </div>
        <div className="order__item-list">
          {displayOrders.length === 0 ? (
            <Container>
              <Row className='pl-1 pr-1 '>
                <div className="orowitem">
                  <div className="noorderyet_card">
                    <span>
                      <div className="ocard-content px-4">No Deliveries to Rescedule</div>
                    </span>
                  </div>
                </div>
              </Row>
            </Container>
          ) : (
            <>
            <AllOrders orders={displayOrders} />
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Reschedule;


// import { Container, Row, Modal } from "react-bootstrap";
// import products from "../assets/data/products";
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { useEffect, useState } from "react";
// import { useGetUndeliveredOrdersMutation, useGetOrderItemsMutation, useSendDeliveredEmailMutation,
//     useUpdateStatusLogMutation, useUpdatePaidOrderMutation } from "../slices/orderAPIslice";
// import Button from "react-bootstrap/Button";
// import { FaArrowLeft } from 'react-icons/fa';
// import Loader from '../components/Loader';
// import { useGetUserInfoMutation } from '../slices/usersApiSlice';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import "../styles/home.css";
// import "../styles/background.css";
// import "../styles/user.css"; 
// import "../styles/orders.css"; 
// import "../styles/deliveryMain.css"; 

// const DatePickerWrapper = ({ selectedDate, onChange }) => {
//     return (
//       <DatePicker selected={selectedDate} onChange={onChange} />
//     );
//   };
  

// const AllOrders = ({ orders, updateLog, updatePaidOrderStatus }) => {
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [showModalReschedule, setShowModalReschedule] = useState(false);
//     const [selectedDate, setSelectedDate] = useState(null);

//     const handleDateChange = (date) => {
//         setSelectedDate(date);
//     };

//     const handleShowModal = (order) => {
//         setSelectedOrder(order);
//         setShowModalReschedule(true);
//     };

//     const handleCloseModal = () => {
//         setShowModalReschedule(false);
//         setSelectedOrder(null);
//     };

//     const handleConfirm = async () => {
//         const entryToMove = orders.find(entry => entry._id === selectedOrder._id);
//         if (entryToMove) {
//             entryToMove.status = 'Out For Delivery';
//         }

//         const order = {
//             _id: entryToMove._id,
//             status: entryToMove.status
//         };

//         let merchantTransactionId = entryToMove.merchantTransactionId;
//         let email = entryToMove.userEmail;
//         let name = entryToMove.userName;
//         let surname = entryToMove.userSurname;
//         let orderID = entryToMove.OGOrderID;
//         let id = entryToMove.OGOrderID;

//         let outForDeliveryTimestamp = new Date();
//         let currentStatus = 'Out For Delivery';

//         await updateLog({ id, currentStatus, outForDeliveryTimestamp });
//         await updatePaidOrderStatus({ order });
//         //await sendOutForDeliveryMail({merchantTransactionId, email, name , surname, orderID  });   

//         handleCloseModal();
//     };

//     return (
//         <div>
//             {orders.map((order, orderIndex) => (
//                 <div key={orderIndex} className='outfordelivery_card'>
//                     <p><strong>Name:</strong> {order.userName} {order.userSurname}</p>
//                     <p><strong>Cell:</strong> {order.userCell}</p>
//                     <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>
//                     <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
//                     <p><strong>Short Address:</strong> {order.shortAddress}</p>
//                     <p><strong>Current Status:</strong> {order.status}</p>

//                     <h5>Meals</h5>
//                     <ul>
//                         {order.meals.map((meal, mealIndex) => (
//                             <li key={mealIndex}>
//                                 {meal.quantity}x {meal.itemName}
//                             </li>
//                         ))}
//                     </ul>
//                     <div className='button-container'>
//                         <Row className='button-row'>
//                             <Button onClick={() => handleShowModal(order)}>Reschedule Order</Button>
//                         </Row>
//                     </div>
//                 </div>
//             ))}

//             <Modal show={showModalReschedule} onHide={handleCloseModal}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Reschedule Delivery Date</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                 <DatePickerWrapper selectedDate={selectedDate} onChange={handleDateChange} />
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
//                     <Button variant="primary" onClick={handleConfirm}>Confirm Reschedule</Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// const Reschedule = () => {
//     const [displayOrders, setDisplayOrders] = useState([]);
//     const [toDeliverGlobal, setToDeliver] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     const [getUndeliveredOrders, { isLoadingUndeliveredOrders }] = useGetUndeliveredOrdersMutation();
//     const [getUserInfo, { isLoadingGetUserInfo }] = useGetUserInfoMutation();
//     const [getOrderDetails, { isLoadingGetUserOrders }] = useGetOrderItemsMutation();

//     const [updatePaidOrderStatus, { isLoadingUpdateOrderStatus }] = useUpdatePaidOrderMutation();
//     const [updatePaidOrderDate, { isLoadingUpdateOrderDate }] = useUpdatePaidOrderMutation();
//     const [updateLog, { isLoadingUpdateLog }] = useUpdateStatusLogMutation();
//     const [sendDeliveredMail, { isLoadingSendDeliveredMail }] = useSendDeliveredEmailMutation();

//     const dispatch = useDispatch();

//     useEffect(() => {
//         const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
//         const now = new Date();
//         const year = now.getUTCFullYear();
//         const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//         const day = String(now.getUTCDate()).padStart(2, '0');
//         const date = `${year}-${month}-${day}T00:00:00.000+00:00`;
//         const OrdersForDelivery = async () => {
//             try {
//                 const data = await getUndeliveredOrders().unwrap();
//                 let outputArray = [];
//                 for (let i = 0; i < data.length; i++) {
//                     let date = new Date(data[i].timestamp);
//                     let dateDeliveredObject = new Date(data[i].actualDateDelivered);
//                     let deliveryDateObject = new Date(data[i].deliveryDate);
//                     let id = data[i].userID;
//                     console.log(id);
//                     let user = await getUserInfo({ id }).unwrap();
//                     let orderID = data[i].OGOrderID;
//                     console.log(orderID);
//                     let dishes = await getOrderDetails({ orderID }).unwrap();
//                     let orderMeals = [];
//                     for (let i = 0; i < dishes.length; i++) {
//                         let product = products.find(product => product.id === dishes[i].orderItemCode);
//                         let picture = product ? product.image01 : null;
//                         let entry = {
//                             itemCode: dishes[i].orderItemCode,
//                             itemName: dishes[i].orderItemName,
//                             itemPrice: dishes[i].orderItemPrice,
//                             totalPrice: dishes[i].orderTotalPrice,
//                             quantity: dishes[i].quantity,
//                             itemPicture: picture
//                         };
//                         orderMeals.push(entry);
//                     }
//                     let entry = {
//                         userName: user.name,
//                         userSurname: user.surname,
//                         userEmail: user.email,
//                         userCell: user.cellNumber,
//                         _id: data[i]._id,
//                         timestamp: data[i].timestamp,
//                         totalPrice: data[i].totalPrice,
//                         totalQuantity: data[i].totalQuantity,
//                         OGOrderID: data[i].OGOrderID,
//                         shortAddress: data[i].shortAddress,
//                         deliveryAddress: data[i].deliveryAddress,
//                         status: data[i].status,
//                         merchantTransactionId: data[i].merchantTransactionId,
//                         dateDelivered: dateDeliveredObject.toLocaleDateString('en-ZA', options),
//                         deliveryDate: deliveryDateObject.toLocaleDateString('en-ZA', options),
//                         time: date.toLocaleDateString('en-ZA', options),
//                         meals: orderMeals
//                     };
//                     outputArray.push(entry);
//                 }

//                 // Sort the array by timestamp in ascending order (oldest to newest)
//                 outputArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

//                 let ordersToShow = [];
//                 ordersToShow = outputArray.filter(entry => entry.status !== 'Delivered');
//                 console.log(ordersToShow);

//                 setDisplayOrders(ordersToShow);

//             } catch (error) {
//                 console.error("Failed to fetch orders:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         OrdersForDelivery();
//     }, []);

//     const handleArrowClick = () => {
//         navigate('/');
//     }

//     const formatDate = (date) => {
//         const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//         return new Intl.DateTimeFormat('en-ZA', options).format(date);
//     };

//     if (loading) {
//         return (
//             <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
//                 <Loader animation="border" />
//             </div>
//         );
//     }

//     return (
//         <Container>
//             <div>
//                 <div className='ordersheader'>
//                     <div className="d-flex align-items-center mb-3">
//                         <div className="arrow">
//                             <FaArrowLeft onClick={handleArrowClick} />
//                         </div>
//                         <div className="profile flex-grow-1">
//                             <h1 className="text-center my-auto">Reschedule</h1>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="order__item-list">
//                     {displayOrders.length === 0 ? (
//                         <Container>
//                             <Row className='pl-1 pr-1 '>
//                                 <div className="orowitem">
//                                     <div className="noorderyet_card">
//                                         <span>
//                                             <div className="ocard-content px-4">No Deliveries to Reschedule</div>
//                                         </span>
//                                     </div>
//                                 </div>
//                             </Row>
//                         </Container>
//                     ) : (
//                         <>
//                             <AllOrders
//                                 orders={displayOrders}
//                                 updateLog={updateLog}
//                                 updatePaidOrderStatus={updatePaidOrderStatus}
//                             />
//                         </>
//                     )}
//                 </div>
//             </div>
//         </Container>
//     );
// };

// export default Reschedule;


// import React, { useEffect, useState } from 'react';
// import { Container, Row, Modal } from "react-bootstrap";
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import {
//   useGetUndeliveredOrdersMutation, useGetOrderItemsMutation,
//   useSendDeliveredEmailMutation, useUpdateStatusLogMutation,
//   useUpdatePaidOrderMutation
// } from "../slices/orderAPIslice";
// import Button from "react-bootstrap/Button";
// import { FaArrowLeft } from 'react-icons/fa';
// import Loader from '../components/Loader';
// import { useGetUserInfoMutation } from '../slices/usersApiSlice';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import products from "../assets/data/products";
// import "../styles/home.css";
// import "../styles/background.css";
// import "../styles/user.css"; 
// import "../styles/orders.css"; 
// import "../styles/deliveryMain.css"; 

// const AllOrders = ({ orders, toDeliverGlobal, updateLog, updatePaidOrderStatus }) => {
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showModalReschedule, setShowModalReschedule] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   const handleShowModal = (order) => {
//     setSelectedOrder(order);
//     setShowModalReschedule(true);
//   };

//   const handleCloseModal = () => {
//     setShowModalReschedule(false);
//     setSelectedOrder(null);
//   };

//   const handleConfirm = async () => {
//     const entryToMove = toDeliverGlobal.find(entry => entry._id === selectedOrder._id);
//     if (entryToMove) {
//       entryToMove.status = 'Out For Delivery';
//     }

//     const order = {
//       _id: entryToMove._id,
//       status: entryToMove.status
//     };

//     let id = entryToMove.OGOrderID;
//     let outForDeliveryTimestamp = new Date();
//     let currentStatus = 'Out For Delivery';

//     await updateLog({ id, currentStatus, outForDeliveryTimestamp });
//     await updatePaidOrderStatus({ order });

//     handleCloseModal();
//   };

//   return (
//     <div>
//       {orders.map((order, orderIndex) => (
//         <div key={orderIndex} className='outfordelivery_card'>
//           <p><strong>Name:</strong> {order.userName} {order.userSurname}</p>
//           <p><strong>Cell:</strong> {order.userCell}</p>
//           <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>
//           <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
//           <p><strong>Short Address:</strong> {order.shortAddress}</p>
//           <p><strong>Current Status:</strong> {order.status}</p>
//           <h5>Meals</h5>
//           <ul>
//             {order.meals.map((meal, mealIndex) => (
//               <li key={mealIndex}>
//                 {meal.quantity}x {meal.itemName}
//               </li>
//             ))}
//           </ul>
//           <div className='button-container'>
//             <Row className='button-row'>
//               <Button onClick={() => handleShowModal(order)}>Reschedule Order</Button>
//             </Row>
//           </div>
//         </div>
//       ))}
//       <Modal show={showModalReschedule} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Reschedule Delivery Date</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <DatePicker selected={selectedDate} onChange={handleDateChange} />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
//           <Button variant="primary" onClick={handleConfirm}>Confirm Reschedule</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// const Reschedule = () => {
//   const [displayOrders, setDisplayOrders] = useState([]);
//   const [toDeliverGlobal, setToDeliver] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const [getUndeliveredOrders] = useGetUndeliveredOrdersMutation();
//   const [getUserInfo] = useGetUserInfoMutation();
//   const [getOrderDetails] = useGetOrderItemsMutation();
//   const [updatePaidOrderStatus] = useUpdatePaidOrderMutation();
//   const [updateLog] = useUpdateStatusLogMutation();

//   useEffect(() => {
//     const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
//     const now = new Date();
//     const year = now.getUTCFullYear();
//     const month = String(now.getUTCMonth() + 1).padStart(2, '0');
//     const day = String(now.getUTCDate()).padStart(2, '0');
//     const date = `${year}-${month}-${day}T00:00:00.000+00:00`;

//     const OrdersForDelivery = async () => {
//       try {
//         const data = await getUndeliveredOrders().unwrap();
//         let outputArray = [];
//         for (let i = 0; i < data.length; i++) {
//           let date = new Date(data[i].timestamp);
//           let dateDeliveredObject = new Date(data[i].actualDateDelivered);
//           let deliveryDateObject = new Date(data[i].deliveryDate);
//           let id = data[i].userID;
//           let user = await getUserInfo({ id }).unwrap();
//           let orderID = data[i].OGOrderID;
//           let dishes = await getOrderDetails({ orderID }).unwrap();
//           let orderMeals = [];

//           for (let j = 0; j < dishes.length; j++) {
//             let product = products.find(product => product.id === dishes[j].orderItemCode);
//             let picture = product ? product.image01 : null;
//             let entry = {
//               itemCode: dishes[j].orderItemCode,
//               itemName: dishes[j].orderItemName,
//               itemPrice: dishes[j].orderItemPrice,
//               totalPrice: dishes[j].orderTotalPrice,
//               quantity: dishes[j].quantity,
//               itemPicture: picture
//             };
//             orderMeals.push(entry);
//           }

//           let entry = {
//             userName: user.name,
//             userSurname: user.surname,
//             userEmail: user.email,
//             userCell: user.cellNumber,
//             _id: data[i]._id,
//             timestamp: data[i].timestamp,
//             totalPrice: data[i].totalPrice,
//             totalQuantity: data[i].totalQuantity,
//             OGOrderID: data[i].OGOrderID,
//             shortAddress: data[i].shortAddress,
//             deliveryAddress: data[i].deliveryAddress,
//             status: data[i].status,
//             merchantTransactionId: data[i].merchantTransactionId,
//             dateDelivered: dateDeliveredObject.toLocaleDateString('en-ZA', options),
//             deliveryDate: deliveryDateObject.toLocaleDateString('en-ZA', options),
//             time: date.toLocaleDateString('en-ZA', options),
//             meals: orderMeals
//           };
//           outputArray.push(entry);
//         }

//         outputArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//         let ordersToShow = outputArray.filter(entry => entry.status !== 'Delivered');
//         setDisplayOrders(ordersToShow);

//       } catch (error) {
//         console.error("Failed to fetch orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     OrdersForDelivery();
//   }, [getUndeliveredOrders, getUserInfo, getOrderDetails]);

//   const handleArrowClick = () => {
//     navigate('/');
//   }

//   const formatDate = (date) => {
//     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//     return new Intl.DateTimeFormat('en-ZA', options).format(date);
//   };

//   if (loading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
//         <Loader animation="border" />
//       </div>
//     );
//   }

//   return (
//     <Container>
//       <div>
//         <div className='ordersheader'>
//           <div className="d-flex align-items-center mb-3">
//             <div className="arrow">
//               <FaArrowLeft onClick={handleArrowClick} />
//             </div>
//             <div className="profile flex-grow-1">
//               <h1 className="text-center my-auto">Reschedule</h1>
//             </div>
//           </div>
//         </div>
//         <div className="order__item-list">
//           {displayOrders.length === 0 ? (
//             <Container>
//               <Row className='pl-1 pr-1 '>
//                 <div className="orowitem">
//                   <div className="noorderyet_card">
//                     <span>
//                       <div className="ocard-content px-4">No Deliveries to Reschedule</div>
//                     </span>
//                   </div>
//                 </div>
//               </Row>
//             </Container>
//           ) : (
//             <AllOrders
//               orders={displayOrders}
//               toDeliverGlobal={toDeliverGlobal}
//               updateLog={updateLog}
//               updatePaidOrderStatus={updatePaidOrderStatus}
//             />
//           )}
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default Reschedule;
