
import { Container, Row, Modal } from "react-bootstrap";
import products from "../assets/data/products";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { useGetDeliveriesForTodayMutation, useGetOrderItemsMutation,     useSendDeliveredEmailMutation,
  useSendOutForDeliveryEmailMutation,     useUpdateStatusLogMutation,     useUpdatePaidOrderMutation  } from "../slices/orderAPIslice";
import Button from "react-bootstrap/Button";
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../components/Loader';
import { useGetUserInfoMutation } from '../slices/usersApiSlice';
import { useLogoutMutation } from '../slices/adminAPISlice';
import { logout } from '../slices/authSlice';
import Accordion from 'react-bootstrap/Accordion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../styles/home.css";
import "../styles/background.css";
import "../styles/user.css"; 
import "../styles/orders.css"; 
import "../styles/deliveryMain.css"; 

const DeliveryMain = () => {

  const [logoutApiCall] = useLogoutMutation();
  const [messageDeliveries, setMessageDeliveries] = useState('');
  const [messageOrdersOormore, setMessageOrdersOormore] = useState('');
  const [messageOrdersTomorrow, setMessageOrdersTomorrow] = useState('');
  const [numberOfDeliveries, setNumberOfDeliveries] = useState('');
  const [numberOfOrdersTomorow, setNumberOfOrdersTomorow] = useState('');
  const [displayOrders, setDisplayOrders] = useState([]);
  const [toDeliverGlobal, setToDeliver] = useState([]);
  const [outForDeliveryGlobal , setOutForDelivery] = useState([]);
  const [deliveredGlobal , setDelivered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalToDeliverGlobal, setShowModalToDeliverGlobal] = useState(false);
  const [showModalOutForDeliverGlobal, setShowModalOutForDeliverGlobal] = useState(false);
  const [numberOfOrdersDayAfterTomorrow, setNumberOfOrdersDayAfterTomorrow] = useState('');
  const navigate = useNavigate();
  const [pageNumber] = useState(0);

  const { adminInfo } = useSelector((state) => state.auth);
  const [getDeliveries, { isLoadingDeliveries }] = useGetDeliveriesForTodayMutation();
  const [getUserInfo, { isLoadingGetUserInfo }] = useGetUserInfoMutation();
  const [getOrderDetails, { isLoadingGetUserOrders }] = useGetOrderItemsMutation();

  const [updatePaidOrderStatus, { isLoadingUpdateOrderStatus }] = useUpdatePaidOrderMutation();
  const [updatePaidOrderDate, { isLoadingUpdateOrderDate }] = useUpdatePaidOrderMutation();
  const [updateLog, { isLoadingUpdateLog }] = useUpdateStatusLogMutation();
  const [sendOutForDeliveryMail, { isLoadingSendOutForDeliveryMail }] = useSendOutForDeliveryEmailMutation();
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
            const data = await getDeliveries({ date }).unwrap();
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

            // Sort the array by timestamp in descending order (newest to oldest)
            //outputArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            // Sort the array by timestamp in ascending order (oldest to newest)
            outputArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));


            setDisplayOrders(outputArray);

            let toDeliver = [];
            let outForDelivery = [];
            let delivered = [];

            // Split the outputArray based on status
            //toDeliver = outputArray.filter(entry => entry.status === 'Order Placed');
            toDeliver = outputArray.filter(entry => entry.status === 'Cooling Process');
            outForDelivery = outputArray.filter(entry => entry.status === 'Out For Delivery');
            delivered = outputArray.filter(entry => entry.status === 'Delivered');
            setToDeliver(toDeliver);    
            setOutForDelivery(outForDelivery);
            setDelivered(delivered)

        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    OrdersForDelivery();
  }, []);

  useEffect(() => {
    const now = new Date();
    setMessageDeliveries(`Deliveries for Today: ${formatDate(now)}`);
    setMessageOrdersTomorrow(`Orders for Tomorrow: ${formatDate(addDays(now,1))}`);
    setMessageOrdersOormore(`Orders for "Oormore": ${formatDate(addDays(now,2))}`);
    // GetNumberOfDeliveries();
    // GetNumberOfOrdersTomorrow();
    // GetNumberOfOrdersDayAfterTomorrow();
  }, []);


  useEffect(() => {

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

  const handleArrowClick = () => {
    navigate('/');
  }

  const handleUpdateDetailsClicked = () => {
    navigate('/user/updateprofile');
  }

  const handleToOutForDelivery = ( _id ) => {

  }

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-ZA', options).format(date);
  };

  const ToDeliverOrderDetails = ({ orders, handleToOutForDelivery }) => {

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModalToDeliver, setShowModalToDeliver] = useState(false);
  


  
    const handleShowModal = (order) => {
      setSelectedOrder(order);
      setShowModalToDeliver(true);
    };
  
    const handleCloseModal = () => {
      setShowModalToDeliver(false);
      setSelectedOrder(null);
    };



    const handleConfirm = async () => {
      const entryToMove = toDeliverGlobal.find(entry => entry._id === selectedOrder._id);
      const updatedToDeliver = toDeliverGlobal.filter(entry => entry._id !== selectedOrder._id);
      if (entryToMove) {
        entryToMove.status = 'Out For Delivery';
        setOutForDelivery([...outForDeliveryGlobal, entryToMove]);
        setToDeliver(updatedToDeliver);
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
    //await createPaidOrder({userID, totalPrice, deliveryLat, deliveryLong ,deliveryAddress, freeDelivery, totalQuantity, typesOfItems, deliveryDate, shortAddress , status, OGOrderID, merchantTransactionId, deliveryFee }).unwrap();
    //await updateOGOrder({order, status});
    await updatePaidOrderStatus({order});
    

    await sendOutForDeliveryMail({merchantTransactionId, email, name , surname, orderID  });   


      handleCloseModal();
    };
  
    return (
      <div>
        {orders.map((order, orderIndex) => (
          <div key={orderIndex} className='outfordelivery_card'>
            <p><strong>Name:</strong> {order.userName} {order.userSurname}</p>
            <p><strong>Cell:</strong> {order.userCell}</p>
            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
            <p><strong>Short Address:</strong> {order.shortAddress}</p>
  
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
          <Button onClick={() => handleShowModal(order)}>Move To "Out For Delivery"</Button>
        </Row>
      </div>
  </div>
  </div>
        ))}
  
        <Modal show={showModalToDeliver} onHide={handleCloseModal} style={{ paddingTop: '150px' }}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <p>Are you sure you want to move {selectedOrder.userName} {selectedOrder.userSurname}'s order to Out For Delivery?</p>
            )}
          </Modal.Body>
          <Modal.Footer className='d-flex justify-content-between'>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };


  const OutForDeliveryOrderDetails = ({ orders, handleToOutForDelivery }) => {

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModalOutForDelivery, setShowModalToDeliver] = useState(false);


  
    const handleShowModal = (order) => {
      setSelectedOrder(order);
      setShowModalToDeliver(true);
    };
  
    const handleCloseModal = () => {
      setShowModalToDeliver(false);
      setSelectedOrder(null);
    };


  


    const handleConfirm = async () => {
      const entryToMove = outForDeliveryGlobal.find(entry => entry._id === selectedOrder._id);
      const updatedOutForDelivery = outForDeliveryGlobal.filter(entry => entry._id !== selectedOrder._id);
      if (entryToMove) {
        entryToMove.status = 'Delivered';
        setDelivered([...deliveredGlobal, entryToMove]);
        setOutForDelivery(updatedOutForDelivery);
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

    let deliveredTimestamp = new Date();
    let currentStatus = 'Delivered'

    await updateLog({id, currentStatus, deliveredTimestamp  });
    await updatePaidOrderStatus({order});
    await sendDeliveredMail({merchantTransactionId, email, name , surname, orderID });


      handleCloseModal();
    };
  
    return (
      <div>
        {orders.map((order, orderIndex) => (
          <div key={orderIndex} className='todeliver_card'>
            <p><strong>Name:</strong> {order.userName} {order.userSurname}</p>
            <p><strong>Cell:</strong> {order.userCell}</p>
            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
            <p><strong>Short Address:</strong> {order.shortAddress}</p>
  
            <h5>Meals</h5>
            <ul>
              {order.meals.map((meal, mealIndex) => (
                <li key={mealIndex}>
                  {meal.quantity}x {meal.itemName}
                </li>
              ))}
            </ul>  <div className='button-container'>
    <Button onClick={() => handleShowModal(order)}>Move To "Delivered"</Button>
  </div>
  </div>
        ))}
  
        <Modal show={showModalOutForDelivery} onHide={handleCloseModal} style={{ paddingTop: '150px' }}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <p>Are you sure you want to move {selectedOrder.userName} {selectedOrder.userSurname}'s order to Delivered?</p>
            )}
          </Modal.Body>
          <Modal.Footer className='d-flex justify-content-between'>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  const DeliveredOrderDetails = ({ orders, handleToOutForDelivery }) => {

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModalToDeliver, setShowModalToDeliver] = useState(false);

  
    const handleShowModal = (order) => {
      setSelectedOrder(order);
      setShowModalToDeliver(true);
    };
  
    const handleCloseModal = () => {
      setShowModalToDeliver(false);
      setSelectedOrder(null);
    };
  
    const handleConfirm = async () => {
      const entryToMove = toDeliverGlobal.find(entry => entry._id === selectedOrder._id);
      const updatedToDeliver = toDeliverGlobal.filter(entry => entry._id !== selectedOrder._id);
      if (entryToMove) {
        entryToMove.status = 'Out For Delivery';
        setOutForDelivery([...outForDeliveryGlobal, entryToMove]);
        setToDeliver(updatedToDeliver);
    }

    const order = {
      _id: entryToMove._id,
      status: entryToMove.status
    };


    //await createPaidOrder({userID, totalPrice, deliveryLat, deliveryLong ,deliveryAddress, freeDelivery, totalQuantity, typesOfItems, deliveryDate, shortAddress , status, OGOrderID, merchantTransactionId, deliveryFee }).unwrap();
    //await updateOGOrder({order, status});
    await updatePaidOrderStatus({order});


      handleCloseModal();
    };
  
    return (
      <div>
        {orders.map((order, orderIndex) => (
          <div key={orderIndex} className='delivered_card'>
            <p><strong>Name:</strong> {order.userName} {order.userSurname}</p>
            <p><strong>Cell:</strong> {order.userCell}</p>
            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
            <p><strong>Short Address:</strong> {order.shortAddress}</p>
  
            <h5>Meals</h5>
            <ul>
              {order.meals.map((meal, mealIndex) => (
                <li key={mealIndex}>
                  {meal.quantity}x {meal.itemName}
                </li>
              ))}
            </ul>  
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
              <h1 className="text-center my-auto">Deliveries</h1>
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
                      <div className="ocard-content px-4">No Deliveries For Today</div>
                    </span>
                  </div>
                </div>
              </Row>
            </Container>
          ) : (
            <>
            <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h4>To Deliver: ({toDeliverGlobal.length})</h4></Accordion.Header>
        <Accordion.Body>
        <>
                  {toDeliverGlobal.length === 0 ? (
                    <h6>No Orders To Deliver</h6>
                  ) : (
                    <ToDeliverOrderDetails orders={toDeliverGlobal} />
                  )}
                </>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h4>Out For Delivery:  ({outForDeliveryGlobal.length})</h4></Accordion.Header>
        <Accordion.Body>
        <>
                  {outForDeliveryGlobal.length === 0 ? (
                    <h6>No Orders Out For Delivery</h6>
                  ) : (
                    <OutForDeliveryOrderDetails orders={outForDeliveryGlobal} />
                  )}
                </>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h4>Delivered:  ({deliveredGlobal.length})</h4></Accordion.Header>
        <Accordion.Body>
        <>
                  {deliveredGlobal.length === 0 ? (
                    <h6>No Orders Delivered</h6>
                  ) : (
                    <DeliveredOrderDetails orders={deliveredGlobal} />
                  )}
                </>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
              


            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default DeliveryMain;

