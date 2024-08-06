import { Container, Row, Modal } from "react-bootstrap";
import products from "../assets/data/products";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { useGetUndeliveredOrdersMutation, useGetOrderItemsMutation,     useSendDeliveredEmailMutation,
    useUpdateStatusLogMutation,     useUpdatePaidOrderMutation  } from "../slices/orderAPIslice";
import { useGetAllUsersMutation } from "../slices/usersApiSlice";
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
import "../styles/wallet.css"; 

const Wallet = () => {

  const [displayUsers, setDisplayUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [getAllUsers, { isLoadingGetAllUsers }] = useGetAllUsersMutation();



  useEffect(() => {
    const GetUsers = async () => {
        try {
            const data = await getAllUsers().unwrap();
            console.log(data);
            let outputArray = [];
            for (let i = 0; i < data.length; i++) {
                let entry = {
                    id: data[i]._id,
                    name: data[i].name,
                    surname: data[i].surname,
                    email: data[i].email,
                    cellNumber: data[i].cellNumber,
                    wallet: data[i].wallet,
                };
                outputArray.push(entry);
            }

            // Sort the array by timestamp in ascending order (oldest to newest)
            outputArray.sort((a, b) => a.surname.localeCompare(b.surname));

            setDisplayUsers(outputArray);

        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    GetUsers();
  }, []);


  const handleArrowClick = () => {
    navigate('/');
  }

  const handleIncreaseWalletClicked = (userID) => {
    navigate(`/wallet/user/${userID}`);
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-ZA', options).format(date);
  };

  const AllUsers = ({ users, handleToOutForDelivery }) => {




    const handleConfirm = async () => {
    
    };
  
    return (
      <div>
        {users.map((user, userIndex) => (
          <div key={userIndex} className='users_card'>
            <p><strong>Name:</strong> {user.name} {user.surname}</p>
            <p><strong>Cell:</strong> {user.cellNumber}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Current Wallet: R</strong> {user.wallet}</p>
            <div className='button-container'>
        <Row className='button-row'>
          <Button onClick={() => handleIncreaseWalletClicked(user.id)}>Increase Wallet</Button>
        </Row>
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
              <h1 className="text-center my-auto">Users</h1>
            </div>
          </div>
        </div>
        <div className="order__item-list">
          {displayUsers.length === 0 ? (
            <Container>
              <Row class='pl-1 pr-1 '>
                <div class="orowitem">
                  <div class="noorderyet_card">
                    <span>
                      <div class="ocard-content px-4">No Users</div>
                    </span>
                  </div>
                </div>
              </Row>
            </Container>
          ) : (
            <>
            <AllUsers users={displayUsers} />
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Wallet;