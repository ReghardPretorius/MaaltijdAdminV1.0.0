import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import InputGroup from "react-bootstrap/InputGroup";
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/adminAPISlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Spinner from "react-bootstrap/Spinner";
import Loader from '../components/Loader';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (adminInfo) {
      navigate('/');
    }
  }, [navigate, adminInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading)
  return (
    <div className="mt-5" style={{ display: "flex", justifyContent: "center"}}>
      <Loader animation="border" />
    </div>
  );

  return (
    <div className='py-2'>
    <FormContainer >
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <InputGroup>
          <Form.Control
            type={passwordVisible ? 'text' : 'password'}
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="outline-secondary" id="button-addon2" onClick={() => setPasswordVisible(!passwordVisible)}>
                <i className={`bi bi-eye${passwordVisible ? '-slash' : ''}`} />
            </Button>
            </InputGroup>
        </Form.Group>

        {/* <BootstrapForm.Label className='mt-2'>
            Password&nbsp;
            {isValidPassword && (
              <FaCheckCircle style={{ color: "green", marginLeft: "5px" }} />
            )}
            {!isValidPassword && isBlurPassword && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />
            )}
          </BootstrapForm.Label>
          <InputGroup>
          <BootstrapForm.Control
            type={passwordVisible ? 'text' : 'password'}
            name="passwordForm"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            required
            style={{
              border: isValidPassword
                ? "1px solid #198754"
                : !isValidPassword && isBlurPassword
                ? "1px solid #ea868f"
                : "",
            }}
          />
              <Button variant="outline-secondary" id="button-addon2" onClick={() => setPasswordVisible(!passwordVisible)}>
                <i className={`bi bi-eye${passwordVisible ? '-slash' : ''}`} />
            </Button>
            </InputGroup>
        {!isValidPassword && isBlurPassword ? (
          <div className="error-message">Please enter a valid Password</div>
        ) : null} */}

        <Button
          disabled={isLoading}
          type='submit'
          variant='primary'
          className='mt-3'
          style={{backgroundColor: '#1F305E',  borderColor: '#1F305E'}}
        >
          Sign In
        </Button>
      </Form>

      {/* {isLoading && <Loader />} */}

      <Row className='py-3'>
        <Col>
          New Customer? <Link to='/register'>Register</Link>
        </Col>
      </Row>

      <Row className='py-3'>
        <Col>
          Forgot Password? <Link to='/forgotpassword'>Change Password</Link>
        </Col>
      </Row>
    </FormContainer>
    </div>
  );
};

export default LoginScreen;
