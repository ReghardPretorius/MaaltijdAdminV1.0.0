//import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
//import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import logo from "../assets/logos/logo.png";

import "../styles/header.css";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [displayAddressName, setDisplayAddressName] = useState('');


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };


    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.addressName) {
      let truncatedAddressName;
      if (userInfo.addressName.length > 25) {
        truncatedAddressName =
          windowWidth <= 992
            ? userInfo.addressName.slice(0, 25) + '...'
            : userInfo.addressName;
      } else {
        truncatedAddressName = userInfo.addressName;
      }
      setDisplayAddressName(truncatedAddressName);
    }
  }, [userInfo, windowWidth]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [logoutApiCall] = useLogoutMutation();

  // if (userInfo && userInfo.addressName) {
  //   const displayAddressName =
  //   userInfo.addressName &&
  //   (windowWidth <= 992
  //     ? userInfo.addressName.slice(0, 23) + '...'
  //     : userInfo.addressName);
  //   };



  // const displayAddressName = userInfo.addressName && userInfo.addressName.length > 25 ?
  //   userInfo.addressName.slice(0, 25) + '...' : userInfo.addressName;

  // const logoutHandler = async () => {
  //   try {
  //     await logoutApiCall().unwrap();
  //     dispatch(logout());
  //     navigate('/login');
  //   } catch (err) {
  //     //console.error(err);
  //   }
  // };

  return (
    <div style={{height:'70px'}}>
          {/* {userInfo ? ( */}
    
    <header>
      <Navbar className='navbarstyle' variant='dark' expand='lg' collapseOnSelect fixed="top">
        <Container>
                <>
                <div className="logo" onClick={() => navigate("/")}>
                <img src={logo} alt="logo" />
                
              </div>
          <LinkContainer to='/'>
            <Navbar.Brand className='maaltijdFont'>Maaltijd</Navbar.Brand>
          </LinkContainer>
          </>
             
          {/* <LinkContainer to='/'>
            <Navbar.Brand>Maaltijd</Navbar.Brand>
          </LinkContainer> */}

          
          {/* <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id='username'>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/register'>
                    <Nav.Link>
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse> */}
        </Container>
      </Navbar>
    </header>
    {/* ) : (
      <>
      </>
    )} */}
    </div>
  );
};

export default Header;