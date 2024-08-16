import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import OrderItem from '../models/orderItemModel.js';
import PaidOrder from '../models/paidOrderModel.js';
import OrderCounter from '../models/orderCounter.js';
import orderStatus from '../models/orderStatusLog.js';
import Address from '../models/addressModel.js';
import generateToken from '../utils/generateToken.js';
import moment from 'moment'



// @desc    Create a new order
// @route   POST /api/users
// @access  Public
const createInitialOrder = asyncHandler(async (req, res) => {
  //const { name, email, password } = req.body;
  const { userID } = req.body;

  // const counter = await OrderCounter.findById('invoiceNumber');
  // console.log(counter)
  // if (!counter) {
  //   console.log('create initial invoice nr');
  //   await new OrderCounter({ _id: 'invoiceNumber', seq: 0 }).save();
  // }


  const getNextSequenceValue = async (sequenceName) => {
    const counter = await OrderCounter.findByIdAndUpdate(
      sequenceName,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return counter.seq;
  };
  
  const formatInvoiceNumber = (seq) => {
    const paddedSeq = String(seq).padStart(6, '0'); // Ensure the sequence is at least 6 digits long
    return `MAA${paddedSeq}`;
  };


  const seq = await getNextSequenceValue('invoiceNumber');
  const invoiceNumber = formatInvoiceNumber(seq);
  const merchantTransactionId = invoiceNumber;
  //console.log(merchantTransactionId);

  const order = await Order.create({
    userID,
    merchantTransactionId
  });

  if (order) {
    res.status(201).json({
      _id: order._id,
      merchantTransactionId: order.merchantTransactionId
    });
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateOrder = asyncHandler(async (req, res) => {


    const order = await Order.findById(req.body.order._id);

    if (order) {

      // let dateUTC;
      // if (req.body.deliveryDate){
      //   dateUTC = new Date(req.body.deliveryDate + 'T00:00:00.000Z');
      // }
      // const localizedDate = moment.utc(dateUTC).local().format('YYYY-MM-DD HH:mm:ss');
      
      // console.log(localizedDate);



        order.paymentSuccessful = req.body.paymentSuccessful || order.paymentSuccessful;
        order.totalPrice = req.body.totalPrice || order.totalPrice;
        order.deliveryLat = req.body.deliveryLat || order.deliveryLat;
        order.deliveryLong = req.body.deliveryLong || order.deliveryLong;
        order.deliveryAddress = req.body.deliveryAddress || order.deliveryAddress;
        //order.freeDelivery = req.body.freeDelivery || order.freeDelivery;
        order.totalQuantity = req.body.totalQuantity || order.totalQuantity;
        order.typesOfItems = req.body.typesOfItems || order.typesOfItems;
        order.deliveryDate = req.body.deliveryDate || order.deliveryDate;
        order.shortAddress = req.body.shortAddress || order.shortAddress;
        order.status = req.body.status || order.status;
        order.deliveryFee = req.body.deliveryFee || order.deliveryFee;
        //order.merchantTransactionId = req.body.merchantTransactionId || order.merchantTransactionId;
        if (req.body.totalQuantity >= 3){
          order.freeDelivery = 'Yes'
        } else {
          order.freeDelivery = 'No'
        }
       
  
  
      const updatedOrder = await order.save();

  
      res.json({
        _id: updatedOrder._id,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });

  // @desc    Update paidOrder
// @route   PUT /api/users/profile
// @access  Private
const updatePaidOrder = asyncHandler(async (req, res) => {


    const order = await PaidOrder.findById(req.body.order._id);

    if (order) {

      // let dateUTC;
      // if (req.body.deliveryDate){
      //   dateUTC = new Date(req.body.deliveryDate + 'T00:00:00.000Z');
      // }
      // const localizedDate = moment.utc(dateUTC).local().format('YYYY-MM-DD HH:mm:ss');
      
      // console.log(localizedDate);



        order.paymentSuccessful = req.body.order.paymentSuccessful || order.paymentSuccessful;
        order.totalPrice = req.body.order.totalPrice || order.totalPrice;
        order.deliveryLat = req.body.order.deliveryLat || order.deliveryLat;
        order.deliveryLong = req.body.order.deliveryLong || order.deliveryLong;
        order.deliveryAddress = req.body.order.deliveryAddress || order.deliveryAddress;
        //order.freeDelivery = req.body.freeDelivery || order.freeDelivery;
        order.totalQuantity = req.body.order.totalQuantity || order.totalQuantity;
        order.typesOfItems = req.body.order.typesOfItems || order.typesOfItems;
        order.deliveryDate = req.body.order.deliveryDate || order.deliveryDate;
        order.shortAddress = req.body.order.shortAddress || order.shortAddress;
        order.status = req.body.order.status || order.status;
        order.deliveryFee = req.body.order.deliveryFee || order.deliveryFee;
        order.freeDelivery = req.body.order.freeDelivery || order.freeDelivery
        //order.merchantTransactionId = req.body.merchantTransactionId || order.merchantTransactionId;

       
  
  
      const updatedOrder = await order.save();

  
      res.json({
        _id: updatedOrder._id,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });


  // @desc    Create a new Order Item
// @route   POST /api/users
// @access  Public
const createOrderItem = asyncHandler(async (req, res) => {

    //const { name, email, password } = req.body;
    const { orderID, userID, orderItemCode, orderItemName, quantity, orderItemPrice, orderTotalPrice, deliveryDate, merchantTransactionId } = req.body;
    //const deliveryDate = new Date(deliveryDate1 + 'T00:00:00.000Z');
    const orderItem = await OrderItem.create({
        orderID,
        userID,
        orderItemCode,
        orderItemName,
        quantity,
        orderItemPrice,
        orderTotalPrice,
        deliveryDate,
        merchantTransactionId
    });
  
    if (orderItem) {
  
      res.status(201).json({
        _id: orderItem._id
      });
    } else {
      res.status(400);
      throw new Error('Invalid orderItem data');
    }
  });

  // @desc    Create a paid order
// @route   POST /api/users
// @access  Public
const createPaidOrder = asyncHandler(async (req, res) => {
  //const { name, email, password } = req.body;
  //console.log(req.body);
  const { userID, totalPrice, deliveryLat, deliveryLong , deliveryAddress, freeDelivery, totalQuantity, typesOfItems, deliveryDate, shortAddress , status, OGOrderID, merchantTransactionId, deliveryFee  } = req.body;
 const numberOfFailedDeliveryAttempts = 0;
 const rescheduled = "No";

  const paidorder = await PaidOrder.create({
    userID,
    totalPrice,
    deliveryLat, 
    deliveryLong ,
    deliveryAddress, 
    freeDelivery, 
    totalQuantity, 
    typesOfItems, 
    deliveryDate ,
    shortAddress, 
    status, 
    OGOrderID,
    merchantTransactionId,
    numberOfFailedDeliveryAttempts,
    rescheduled,
    deliveryFee
  });

  if (paidorder) {
    res.status(201).json({
      _id: paidorder._id,
    });
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
});

  // @desc   Get all user orders
// @route   POST /api/users
// @access  Public

const getUserOrders = asyncHandler(async (req, res) => {
  const { userID } = req.body; // Assuming user ID is passed in the route parameters
  

  // Input validation (optional but recommended):
  if (!userID) {
    return res.status(400).json({ message: 'Missing required parameter: userID' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const orders = await PaidOrder.find({ userID });

  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404).json({ message: 'No orders found for this user' });
  }
});

  // @desc   Get all order items
// @route   POST /api/users
// @access  Public

const getOrderItems = asyncHandler(async (req, res) => {
  const { orderID } = req.body; // Assuming user ID is passed in the route parameters
  
  // Input validation (optional but recommended):
  if (!orderID) {
    return res.status(400).json({ message: 'Missing required parameter: userID' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const orderItems = await OrderItem.find({ orderID });
  // console.log(orderItems);
  if (orderItems) {
    res.status(200).json(orderItems);
  } else {
    res.status(404).json({ message: 'No order items found for this order' });
  }
});

  // @desc   Get a single order
// @route   POST /api/users
// @access  Public

const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderID } = req.body; // Assuming user ID is passed in the route parameters
  const _id = orderID;
  //console.log(_id);
  // Input validation (optional but recommended):
  if (!_id) {
    return res.status(400).json({ message: 'Missing required parameter: orderID' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const order = await Order.find({ _id });
  //console.log(order);
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'No order found for this order' });
  }
});

  // @desc   Get a single order
// @route   POST /api/users
// @access  Public

const getPaidOrderDetails = asyncHandler(async (req, res) => {
  const { orderID, userID } = req.body; // Assuming user ID is passed in the route parameters
  const OGOrderID = orderID;
  //console.log(_id);
  // Input validation (optional but recommended):
  if (!OGOrderID) {
    return res.status(400).json({ message: 'Missing required parameter: orderID' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const order = await PaidOrder.findOne({ OGOrderID });
  //console.log(order);

  if (order.userID === userID) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'No order found for this order' });
  }
});


  // @desc   Get a single order
// @route   POST /api/users
// @access  Public

const getPaidOrderDetailsNoUser = asyncHandler(async (req, res) => {
  const { orderID } = req.body; // Assuming user ID is passed in the route parameters
  const OGOrderID = orderID;
  //console.log(_id);
  // Input validation (optional but recommended):
  if (!OGOrderID) {
    return res.status(400).json({ message: 'Missing required parameter: orderID' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const order = await PaidOrder.findOne({ OGOrderID });
  //console.log(order);

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'No order found for this order' });
  }
});

  // @desc    Create a new Status log
// @route   POST /api/users
// @access  Public
const createStatusLog = asyncHandler(async (req, res) => {
  //const { name, email, password } = req.body;
  const { OGOrderID, userID, merchantTransactionId,status, orderPlacedTimestamp } = req.body;
  //const deliveryDate = new Date(deliveryDate1 + 'T00:00:00.000Z');

  const currentStatus = status;
  
  const orderstatus = await orderStatus.create({
    OGOrderID,
      userID,
      merchantTransactionId,
      currentStatus,
      orderPlacedTimestamp
  });

  if (orderstatus) {

    res.status(201).json({
      _id: orderItem._id
    });
  } else {
    res.status(400);
    throw new Error('Invalid order status data');
  }
});


// @desc    Update Status Log
// @route   PUT /api/users/profile
// @access  Private

/// FIX
const updateStatusLog = asyncHandler(async (req, res) => {

const OGOrderID = req.body.id;

    
  const orderstatus =  await orderStatus.findOne({ OGOrderID });

  if (orderstatus)  {  
    orderstatus.currentStatus = req.body.currentStatus || orderstatus.currentStatus;
    orderstatus.getherIngredientsTimestamp = req.body.getherIngredientsTimestamp || orderstatus.getherIngredientsTimestamp;
    orderstatus.preparingTimestamp = req.body.preparingTimestamp || orderstatus.preparingTimestamp;
    orderstatus.refrigeratingTimestamp = req.body.refrigeratingTimestamp || orderstatus.refrigeratingTimestamp;
    orderstatus.outForDeliveryTimestamp = req.body.outForDeliveryTimestamp || orderstatus.outForDeliveryTimestamp;
    orderstatus.couldNotBeDelivered1Timestamp = req.body.couldNotBeDelivered1Timestamp || orderstatus.couldNotBeDelivered1Timestamp;
    orderstatus.couldNotBeDelivered2Timestamp = req.body.couldNotBeDelivered2Timestamp || orderstatus.couldNotBeDelivered2Timestamp;
    orderstatus.deliveredTimestamp = req.body.deliveredTimestamp || orderstatus.deliveredTimestamp;

    const updatedOrderStatus = await orderstatus.save();
    res.json({
      _id: updatedOrder._id,
    });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});




const getNumberOfDeliveries = asyncHandler(async (req, res) => {
  const { formattedNow } = req.body; // Assuming user ID is passed in the route parameters
  const deliveryDate = formattedNow;
  //console.log(_id);
  // Input validation (optional but recommended):
  if (!formattedNow) {
    return res.status(400).json({ message: 'Missing required parameter: date' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const amount = await PaidOrder.countDocuments({ deliveryDate });
  //console.log(order);

    res.status(200).json(amount);
});


  // @desc   Get all the deliveries for today
// @route   POST /api/users
// @access  Public

const getDeliveriesByDate = asyncHandler(async (req, res) => {
  const { date } = req.body; // Assuming user ID is passed in the route parameters

  const deliveryDate = date;
  //console.log(_id);
  // Input validation (optional but recommended):
  if (!deliveryDate) {
    return res.status(400).json({ message: 'Missing required parameter: date' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const orders = await PaidOrder.find({ deliveryDate });
  //console.log(order);
  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404).json({ message: 'No order found for this date' });
  }
});



const getUndeliveredOrders = asyncHandler(async (req, res) => {

 const orders = await PaidOrder.find({ status: { $ne: 'Delivered' } });
 //console.log(orders); 
 if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404).json({ message: 'No order found for this date' });
  }
});




export {
  createInitialOrder,
  updateOrder,
  createOrderItem,
  createPaidOrder,
  getUserOrders,
  getOrderItems,
  getOrderDetails,
  createStatusLog,
  updateStatusLog,
  getPaidOrderDetails,
  getNumberOfDeliveries,
  getDeliveriesByDate,
  updatePaidOrder,
  getUndeliveredOrders,
  getPaidOrderDetailsNoUser
};