import React,  { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderItemsMutation, useGetOrderDetailsMutation, useGetOrderDetailsNoUserMutation } from "../slices/orderAPIslice";
import {    useSendRescheduleEmailMutation,
  useUpdateStatusLogMutation,     useUpdatePaidOrderMutation  } from "../slices/orderAPIslice";
  import { useGetUserInfoMutation, useUpdateWalletMutation, useCreateWalletLogMutation } from '../slices/usersApiSlice';
import { Form, Button, Row, Col, Container, ListGroup, Modal, Input  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"; 
import { FaArrowLeft } from 'react-icons/fa';
import products from "../assets/data/products";
import { ListGroupItem } from "react-bootstrap";
import Loader from '../components/Loader';


import DatePicker from '../components/DatePicker';

import "../styles/orderDetails.css";
import "../styles/wallet.css";


const UserWallet = () => {

    const { adminInfo } = useSelector((state) => state.auth);
    const { userID } = useParams();
    const id = userID;
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [loadingItems, setLoadingItems] = useState(true);
    //const order = orderDetails[orderId];
    const detailsRef = useRef(null);
    const headerRef = useRef(null);
    const [remainingHeight, setRemainingHeight] = useState(0);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [cellNumber, setCellNumber] = useState('');
    const [walletGlobal, setWallet] = useState('');
    const [campaignGlobal, setCampaignGlobal] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [expireGlobal, setExpire] = useState('');
    const [expiryDateGlobal, setExpiryDateGlobal] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [hasExpiryDate, setHasExpiryDate] = useState(false);
    
    const [currentWallet, setCurrentWallet] = useState('');
    const [selectedDateFormatted, setSelectedDateFormatted] = useState(null);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [getUserInfo, { isLoadingGetUserInfo }] = useGetUserInfoMutation();


    const [updateWallet, { isLoadingUpdateWallet }] = useUpdateWalletMutation();
    const [sendRescheduleMail, { isLoadingSendDeliveredMail }] = useSendRescheduleEmailMutation();
    const [createWalletLog, { isLoadingCreateWalletLog }] = useCreateWalletLogMutation();
    



    useEffect(() => {
      const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
      let date = new Date(selectedDate)
let sd = date.toLocaleDateString('en-ZA', options);
console.log(sd);
setSelectedDateFormatted(sd);

  }, [selectedDate]);

      const handleArrowClick = () => {
        navigate('/wallet');
      };

      const handleShowModal = () => {
        setShowModal(true);
        console.log(currentWallet);
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
      };

      const handleWalletChange = (e) => {
        let newWallet = e.target.value;
        setWallet(newWallet);
      };

      const handleCampaignChange = (e) => {
        let newCampaign = e.target.value;
        setCampaignGlobal(newCampaign);
      };

      const handleCheckboxChange = (event) => {
        setHasExpiryDate(event.target.checked);
        if (!event.target.checked) {
          setExpiryDateGlobal(null); // Reset date when unchecked
          setExpire("No");
        } else {
          setExpire("Yes");
        }
      };

      const handleConfirmWallet  = async () => {

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

      const date = new Date(selectedDate);
      const expDate = new Intl.DateTimeFormat('en-za', options2).format(date);

          const order = {
            _id: id,
            wallet: walletGlobal,
          };

          let expire = expireGlobal;
          let userID = id;
          let walletAmount = walletGlobal;
          let admin = adminInfo.name + " " + adminInfo.surname;
          let campaign = campaignGlobal;
          let expiryDate = expDate;
          let allocatedBy = admin;
          let userName = name + " " + surname;

          //await updateLog({id, currentStatus, getherIngredientsTimestamp  });
          await createWalletLog({userID, walletAmount, admin, campaign, expire, expiryDate, allocatedBy,  userName})
          //await sendRescheduleMail({merchantTransactionId, email, name , surname, selectedDateFormatted  }); 
        
   navigate('/wallet');
      }


    useEffect(() => {
        
        const Order = async () => {
            try {
                let user = await getUserInfo({ id }).unwrap();
                console.log(user);
                setName(user.name);
                setSurname(user.surname);
                setEmail(user.email);
                setCurrentWallet(user.wallet);
                setCellNumber(user.cellNumber);



            } catch (error) {
                console.error("Failed to fetch order:", error);
              } finally {
                setLoadingDetails(false);
            };
        };
        setExpire("No");
        Order();
       
    }, []);


    if (!userID) {
        return <div>Order not found</div>;
    }

    if (loadingDetails) {
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
          <h1 className="text-center my-auto">Increase Wallet</h1>
        </div>
      </div>
    </div>
    <div ref={detailsRef}>
      <Row className="pl-1 pr-1 orderrow_rowitem">
        <div className="orderdetails_rowitem">
          <div className="orderdetails_overview_card d-flex ">
            <div className="orderdetails_card-content">
              <Row>Name: {name} {surname}</Row>
              <Row>Email: {email}</Row>
              <Row>Cell Number: {cellNumber}</Row>
              <Row>Current Wallet: R {currentWallet}</Row>
            </div>
          </div>
        </div>
      </Row>
    </div>
    <Row className='orderrow_rowitem'>
    <div className='changedate_rowitem'>
      <Row >

        <div className='pl-3'>
        Enter Amount:
        </div>
      </Row>
      <Row className='px-3'>
    <input  value={walletGlobal}
    type='number'
            onChange={handleWalletChange} />
    </Row>
    <Row >

<div className='pl-3 pt-4'>
Enter Campaign:
</div>
</Row>
    <Row className=' px-3'>
    <input   value={campaignGlobal}
            onChange={handleCampaignChange} />
    </Row>
    <Row className='pl-3'>
    <div className='pt-3 pl-5'>
        <input 
          type="checkbox"
          checked={hasExpiryDate}
          onChange={handleCheckboxChange}
           className="custom-checkbox"
        />
        Has expiry date
        </div>

        <div className='pt-3 pl-5'>
      {hasExpiryDate && (
        <DatePicker
        onChange={(date) => setSelectedDate(date)}
        placeholderText="Select expiry date"
        />
      )}
    </div>
    </Row>
    <Row>
    <div className='button-container pt-3'>
    <Button onClick={() => handleShowModal()} disabled={!campaignGlobal || !walletGlobal}>Increase Wallet</Button>
    </ div>
    </Row>
    
    </div>
    </Row>


    <Modal show={showModal} onHide={handleCloseModal} style={{ paddingTop: '150px' }}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>

              <p>Are you sure you want to increase {name}'s wallet by R{walletGlobal}?</p>
              {hasExpiryDate && (
        <p>With Expiry date : {selectedDateFormatted} </p>
      )}
          </Modal.Body>
          <Modal.Footer className='d-flex justify-content-between'>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmWallet}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

  </Container>
</div>

    );
};

export default UserWallet;
