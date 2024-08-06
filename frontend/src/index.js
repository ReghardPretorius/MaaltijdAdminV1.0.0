import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './app/store';
import { Provider } from 'react-redux';
import HomeScreen from './pages/Home.jsx';
import LoginScreen from './pages/Login.jsx';
import DeliveryMain from './pages/deliveryMain.jsx';
import TomorrowMain from './pages/ordersTomorrowMain.jsx';
import TomorrowAll from './pages/ordersTomorrowAll.jsx';
import TomorrowSplit from './pages/ordersTomorrowSplit.jsx';
import DayAfterMain from './pages/ordersDayAfterMain.jsx';
import DayAfterAll from './pages/ordersDayAfterAll.jsx';
import DayAfterSplit from './pages/ordersDayAfterSplit.jsx';

import Reschedule from './pages/reschedule.jsx';
import Wallet from './pages/wallet.jsx';

import RescheduleOrder from './pages/rescheduleOrder.jsx';
import UserWallet from './pages/userWallet.jsx';

import PrivateRoute from './components/PrivateRoute.jsx';









const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />

      <Route path='/login' element={<LoginScreen />} />

      <Route path='' element={<PrivateRoute />}>
      <Route path='/delivery/main' element={<DeliveryMain />} />
      <Route path='/tomorrow' element={<TomorrowMain />} />
      <Route path='/tomorrow/all' element={<TomorrowAll />} />
      <Route path='/tomorrow/individual' element={<TomorrowSplit />} />
      <Route path='/dayafter' element={<DayAfterMain />} />
      <Route path='/dayafter/all' element={<DayAfterAll />} />
      <Route path='/dayafter/split' element={<DayAfterSplit />} />
      <Route path='/reschedule' element={<Reschedule />} />
      <Route path='/reschedule/order/:orderId' element={<RescheduleOrder />} />
      <Route path='/wallet' element={<Wallet />} />
      <Route path='/wallet/user/:userID' element={<UserWallet />} />
      
      
        {/* <Route path='/user/orders/:orderId' element={<OrderDetails />} /> */}
      </Route>
    </Route>
  )
);


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
