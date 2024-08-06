
import { Container, Row, Col, Modal } from "react-bootstrap";
import products from "../assets/data/products";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { useGetDeliveriesForTodayMutation, useGetOrderItemsMutation,   
  useSendGatheringIngredientsEmailMutation, useSendCookingEmailMutation, useSendRefrigeratingEmailMutation,     useUpdateStatusLogMutation,     useUpdatePaidOrderMutation  } from "../slices/orderAPIslice";
import Button from "react-bootstrap/Button";
import Badge from 'react-bootstrap/Badge';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../components/Loader';
import { useGetUserInfoMutation } from '../slices/usersApiSlice';
import { useLogoutMutation } from '../slices/adminAPISlice';
import { logout } from '../slices/authSlice';
import Accordion from 'react-bootstrap/Accordion';
import { AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
import "../styles/home.css";
import "../styles/background.css";
import "../styles/user.css"; 
import "../styles/orders.css"; 
import "../styles/deliveryMain.css"; 

const DayAfterSplit = () => {

  const [logoutApiCall] = useLogoutMutation();
  const [messageDeliveries, setMessageDeliveries] = useState('');
  const [messageOrdersOormore, setMessageOrdersOormore] = useState('');
  const [messageOrdersTomorrow, setMessageOrdersTomorrow] = useState('');
  const [numberOfDeliveries, setNumberOfDeliveries] = useState('');
  const [numberOfOrdersTomorow, setNumberOfOrdersTomorow] = useState('');
  const [displayOrders, setDisplayOrders] = useState([]);
  const [orderedGlobal, setOrderedGlobal] = useState([]);
  const [ingredientsGlobal , setIngredientsGlobal] = useState([]);
  const [cookingGlobal , setCookingGlobal] = useState([]);
  const [fridgingGlobal , setFridgingGlobal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalToDeliverGlobal, setShowModalToDeliverGlobal] = useState(false);
  const [showModalOutForDeliverGlobal, setShowModalOutForDeliverGlobal] = useState(false);
  const [numberOfOrdersDayAfterTomorrow, setNumberOfOrdersDayAfterTomorrow] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');


  const { adminInfo } = useSelector((state) => state.auth);
  const [getDeliveries, { isLoadingDeliveries }] = useGetDeliveriesForTodayMutation();
  const [getUserInfo, { isLoadingGetUserInfo }] = useGetUserInfoMutation();
  const [getOrderDetails, { isLoadingGetUserOrders }] = useGetOrderItemsMutation();

  const [updatePaidOrderStatus, { isLoadingUpdateOrderStatus }] = useUpdatePaidOrderMutation();
  const [updateLog, { isLoadingUpdateLog }] = useUpdateStatusLogMutation();
  const [sendIngredientsMail, { isLoadingSendIngredientsMail }] = useSendGatheringIngredientsEmailMutation();
  const [sendCookingMail, { isLoadingSendCookingMail }] = useSendCookingEmailMutation();
  const [sendCoolingMail, { isLoadingSendCoolingMail }] = useSendRefrigeratingEmailMutation();

  const dispatch = useDispatch();

  const [loadingMessage, setLoadingMessage] = useState(true);

  useEffect(() => {
    const now = new Date();
    setMessageOrdersTomorrow(`${formatDate(addDays(now,2))}`);
  }, []);

  useEffect(() => {
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const year = tomorrow.getUTCFullYear();
    const month = String(tomorrow.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(tomorrow.getUTCDate()).padStart(2, '0');
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

            let ordered = [];
            let ingredients = [];
            let cooking = [];
            let fridging = [];

            // Split the outputArray based on status
            ordered = outputArray.filter(entry => entry.status === 'Order Placed');
            //toDeliver = outputArray.filter(entry => entry.status === 'Refrigerating');
            ingredients = outputArray.filter(entry => entry.status === 'Sourcing Ingredients');
            cooking = outputArray.filter(entry => entry.status === 'Preparing Meals');
            fridging = outputArray.filter(entry => entry.status === 'Cooling Process');
            setOrderedGlobal(ordered);
            setIngredientsGlobal(ingredients);
            setCookingGlobal(cooking);
            setFridgingGlobal(fridging);

        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    OrdersForDelivery();
  }, []);

  useEffect(() => {


    const intervalId = setInterval(() => {
      const now = new Date();
      //now.setHours(now.getHours() - 48);
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
        setMessage(`Not Finalised`);
         setLoadingMessage(false);
      } else if (dayOfWeek === 5) {
        // Friday
        setMessage(`No orders for the day after tomorrow`);
        setLoadingMessage(false);
      } else if (dayOfWeek === 6) {
        // Saturday
        if (difference > 0) {
           // Next Monday
           const hours = Math.floor(Math.abs(difference) / (1000 * 60 * 60));
           const minutes = Math.floor(Math.abs((difference % (1000 * 60 * 60)) / (1000 * 60)));
           const seconds = Math.floor(Math.abs((difference % (1000 * 60)) / 1000));
   
           
           setMessage(`Time left to order: 1 Day & ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          setLoadingMessage(false);
        } else {
          setMessage(`Orders Finalised`);
          setLoadingMessage(false);
        }
      } else if (dayOfWeek === 0) {
        // Sunday
         // Next Tuesday
         setMessage(`Not Finalised`);
         setLoadingMessage(false);
      }
  
    }, 1000);
  
    return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
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

  const handleBackClicked = () => {
    navigate('/tomorrow');
  }

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-ZA', options).format(date);
  };


  const OrderPlacedDetails = ({ orders, handleToOutForDelivery }) => {

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModalOrderPlaced, setShowModalToDeliver] = useState(false);

  
    const handleShowModal = (order) => {
      setSelectedOrder(order);
      setShowModalToDeliver(true);
    };
  
    const handleCloseModal = () => {
      setShowModalToDeliver(false);
      setSelectedOrder(null);
    };
  
    const handleConfirm = async () => {
      const entryToMove = orderedGlobal.find(entry => entry._id === selectedOrder._id);
      const updatedOrdered = orderedGlobal.filter(entry => entry._id !== selectedOrder._id);
      if (entryToMove) {
        entryToMove.status = 'Sourcing Ingredients';
        setIngredientsGlobal([...ingredientsGlobal, entryToMove]);
        setOrderedGlobal(updatedOrdered);
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

    let getherIngredientsTimestamp = new Date();
    let currentStatus = 'Sourcing Ingredients'

    await updateLog({id, currentStatus, getherIngredientsTimestamp  });

    await updatePaidOrderStatus({order});
    await sendIngredientsMail({merchantTransactionId, email, name , surname, orderID  });   


      handleCloseModal();
    };
  
    return (
      <div>
        {orders.map((order, orderIndex) => (
          <div key={orderIndex} className='orderplaced_card'>
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
    <Button onClick={() => handleShowModal(order)}>Move To "Getting Ingredients"</Button>
  </div>
  </div>
        ))}
  
        <Modal show={showModalOrderPlaced} onHide={handleCloseModal} style={{ paddingTop: '150px' }}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <p>Are you sure you want to move {selectedOrder.userName} {selectedOrder.userSurname}'s order to Getting Ingredients?</p>
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

  const SourcingIngredientsDetails = ({ orders, handleToOutForDelivery }) => {

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModalIngredients, setShowModalToDeliver] = useState(false);

  
    const handleShowModal = (order) => {
      setSelectedOrder(order);
      setShowModalToDeliver(true);
    };
  
    const handleCloseModal = () => {
      setShowModalToDeliver(false);
      setSelectedOrder(null);
    };
  
    const handleConfirm = async () => {
      const entryToMove = ingredientsGlobal.find(entry => entry._id === selectedOrder._id);
      const updatedIngedients = ingredientsGlobal.filter(entry => entry._id !== selectedOrder._id);
      if (entryToMove) {
        entryToMove.status = 'Preparing Meals';
        setCookingGlobal([...cookingGlobal, entryToMove]);
        setIngredientsGlobal(updatedIngedients);
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

    let preparingTimestamp = new Date();
    let currentStatus = 'Preparing Meals'

    await updateLog({id, currentStatus, preparingTimestamp  });


    await updatePaidOrderStatus({order});
    await sendCookingMail({merchantTransactionId, email, name , surname, orderID  });   


      handleCloseModal();
    };
  
    return (
      <div>
        {orders.map((order, orderIndex) => (
          <div key={orderIndex} className='ingredients_card'>
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
    <Button onClick={() => handleShowModal(order)}>Move To "Cooking Meals"</Button>
  </div>
  </div>
        ))}
  
        <Modal show={showModalIngredients} onHide={handleCloseModal} style={{ paddingTop: '150px' }}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <p>Are you sure you want to move {selectedOrder.userName} {selectedOrder.userSurname}'s order to Cooking Meals?</p>
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

  const PreparingMealsDetails = ({ orders, handleToOutForDelivery }) => {

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModalCooking, setShowModalToDeliver] = useState(false);

  
    const handleShowModal = (order) => {
      setSelectedOrder(order);
      setShowModalToDeliver(true);
    };
  
    const handleCloseModal = () => {
      setShowModalToDeliver(false);
      setSelectedOrder(null);
    };
  


    const handleConfirm = async () => {
      const entryToMove = cookingGlobal.find(entry => entry._id === selectedOrder._id);
      const updatedCooking = cookingGlobal.filter(entry => entry._id !== selectedOrder._id);
      if (entryToMove) {
        entryToMove.status = 'Cooling Process';
        setFridgingGlobal([...fridgingGlobal, entryToMove]);
        setCookingGlobal(updatedCooking);
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

    let refrigeratingTimestamp = new Date();
    let currentStatus = 'Cooling Process'

    await updateLog({id, currentStatus, refrigeratingTimestamp  });


    await updatePaidOrderStatus({order});
    await sendCoolingMail({merchantTransactionId, email, name , surname, orderID  });


      handleCloseModal();
    };
  
    return (
      <div>
        {orders.map((order, orderIndex) => (
          <div key={orderIndex} className='cooking_card'>
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
    <Button onClick={() => handleShowModal(order)}>Move To "Cooling"</Button>
  </div>
  </div>
        ))}
  
        <Modal show={showModalCooking} onHide={handleCloseModal} style={{ paddingTop: '150px' }}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <p>Are you sure you want to move {selectedOrder.userName} {selectedOrder.userSurname}'s order to Cooling?</p>
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

  const CoolingProccessDetails = ({ orders, handleToOutForDelivery }) => {

  
    return (
      <div>
        {orders.map((order, orderIndex) => (
          <div key={orderIndex} className='cooling_card'>
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
    <FaArrowLeft onClick={handleBackClicked} />
  </div>
  <div className="profile flex-grow-1">
    <h1 className="text-center my-auto">Orders for Tomorrow {messageOrdersTomorrow}</h1>
  </div>
</div>
</div>
<Row class='pl-1 pr-1 '>
<div className="messageCard">
<div class="rowitem">
<div class="shopping_card">
<div class="card-content"><span>
{message === 'Orders Finalised' ? (
<AiFillCheckCircle className="checkoutIcon pr-2" style={{ color: 'green' }}/>
) : null}
        {message === 'Not Finalised' ? (
        <AiFillCloseCircle className="checkoutIcon" style={{ color: 'red' }} />
    ) : null}
  {message}         </span>

</div>
</div>
</div>
</div>
</Row> 
        <div className="order__item-list">
          {displayOrders.length === 0 ? (
            <Container>
              <Row class='pl-1 pr-1 '>
                <div class="orowitem">
                  <div class="noorderyet_card">
                    <span>
                      <div class="ocard-content px-4">No Orders For Tomorrow</div>
                    </span>
                  </div>
                </div>
              </Row>
            </Container>
          ) : (
            <>
            <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h4>Order Placed: ({orderedGlobal.length})</h4></Accordion.Header>
        <Accordion.Body>
        <>
                  {orderedGlobal.length === 0 ? (
                    <h6>No Orders Placed</h6>
                  ) : (
                    <OrderPlacedDetails orders={orderedGlobal} />
                  )}
                </>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h4>Getting Ingredients:  ({ingredientsGlobal.length})</h4></Accordion.Header>
        <Accordion.Body>
        <>
                  {ingredientsGlobal.length === 0 ? (
                    <h6>No Orders Buying Ingredients</h6>
                  ) : (
                    <SourcingIngredientsDetails orders={ingredientsGlobal} />
                  )}
                </>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h4>Cooking Meals:  ({cookingGlobal.length})</h4></Accordion.Header>
        <Accordion.Body>
        <>
                  {cookingGlobal.length === 0 ? (
                    <h6>No Orders Being Prepared</h6>
                  ) : (
                    <PreparingMealsDetails orders={cookingGlobal} />
                  )}
                </>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header><h4>Cooling Process:  ({fridgingGlobal.length})</h4></Accordion.Header>
        <Accordion.Body>
        <>
                  {fridgingGlobal.length === 0 ? (
                    <h6>No Orders Cooling</h6>
                  ) : (
                    <CoolingProccessDetails orders={fridgingGlobal} />
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

export default DayAfterSplit;
