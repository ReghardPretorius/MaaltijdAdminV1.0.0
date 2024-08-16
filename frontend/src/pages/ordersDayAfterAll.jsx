
import { Container, Row, Col } from "react-bootstrap";
import products from "../assets/data/products";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { useGetDeliveriesForTodayMutation, 
    useGetOrderItemsMutation,     
    useSendDeliveredEmailMutation,
    useSendOutForDeliveryEmailMutation,     
    useUpdateStatusLogMutation,     
    useUpdatePaidOrderMutation  } from "../slices/orderAPIslice";
import Button from "react-bootstrap/Button";
import Badge from 'react-bootstrap/Badge';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../components/Loader';
import { AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";



 import "../styles/home.css";
 import "../styles/background.css";
 import "../styles/user.css"; 
 import "../styles/orders.css";
 import "../styles/shopping-cart.css";
  

const DayAfterAll = () => {


  const now = new Date();
const navigate = useNavigate();
const [displayOrders, setDisplayOrders] = useState([]);
const [displayTotalNumberOfItems, setDisplayTotalNumberOfItems] = useState([]);

const [getDeliveries, { isLoadingDeliveries }] = useGetDeliveriesForTodayMutation();
const [getOrderDetails, { isLoadingGetUserOrders }] = useGetOrderItemsMutation();

  const { adminInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();


    
  const handleBackClicked = () => {
    navigate('/dayafter');
  }

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
                let orderMeals = [];
                for (let i = 0; i < data.length; i++) {
                    // let date = new Date(data[i].timestamp);
                    // let dateDeliveredObject = new Date(data[i].actualDateDelivered);
                    // let deliveryDateObject = new Date(data[i].deliveryDate);
                    // let id = data[i].userID; 
                    
                    let orderID = data[i].OGOrderID;
                    let  dishes = await getOrderDetails({ orderID }).unwrap();
                    
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
                        // userName: user.name,
                        // userSurname: user.surname,
                        // userEmail: user.email ,
                        // userCell: user.cellNumber,
                        // _id: data[i]._id,
                        // timestamp: data[i].timestamp,
                        // totalPrice: data[i].totalPrice,
                        // totalQuantity: data[i].totalQuantity,
                        // OGOrderID: data[i].OGOrderID,
                        // shortAddress: data[i].shortAddress,
                        // deliveryAddress: data[i].deliveryAddress,
                        // status: data[i].status,
                        // merchantTransactionId: data[i].merchantTransactionId,
                        // dateDelivered: dateDeliveredObject.toLocaleDateString('en-ZA', options),
                        // deliveryDate: deliveryDateObject.toLocaleDateString('en-ZA', options),
                        // time: date.toLocaleDateString('en-ZA', options),
                        // meals: orderMeals
                    };
                    outputArray.push(entry);
                }
    
                // Sort the array by timestamp in descending order (newest to oldest)
                //outputArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                // Sort the array by timestamp in ascending order (oldest to newest)
                outputArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    

                //setDisplayOrders(outputArray);
                setDisplayTotalNumberOfItems(orderMeals);
                const result = [];


orderMeals.forEach(meal => {
  const existingMeal = result.find(m => m.itemName === meal.itemName);
  if (existingMeal) {
    existingMeal.itemTotalQuantity += parseInt(meal.quantity);
  } else {
    result.push({
      itemName: meal.itemName,
      itemTotalQuantity: parseInt(meal.quantity),
      itemPicture: meal.itemPicture
    });
  }
});
setDisplayOrders(result);

    
                let toDeliver = [];
                let outForDelivery = [];
                let delivered = [];
    
                // Split the outputArray based on status
                toDeliver = outputArray.filter(entry => entry.status === 'Order Placed');
                //toDeliver = outputArray.filter(entry => entry.status === 'Refrigerating');
                outForDelivery = outputArray.filter(entry => entry.status === 'Out For Delivery');
                delivered = outputArray.filter(entry => entry.status === 'Delivered');
                // setToDeliver(toDeliver);    
                // setOutForDelivery(outForDelivery);
                // setDelivered(delivered)
    
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
    
  
    if (loadingMessage || loading) {
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
    <h1 className="text-center my-auto">Orders for Oormore {messageOrdersTomorrow}</h1>
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
        {message === 'Not Finalised' ? (
        <AiFillCloseCircle className="checkoutIcon" style={{ color: 'red' }} />
    ) : null}
  {message}         </span>

</div>
</div>
</div>
</div>
</Row> 

<h5>Meals (Total: {displayTotalNumberOfItems.length})</h5>
            <ul>
              {displayOrders.map((meal, mealIndex) => (
                <li key={mealIndex}>
                  {meal.itemTotalQuantity}x {meal.itemName}
                </li>
              ))}
            </ul>



</div>


</>
  );

};
export default DayAfterAll;