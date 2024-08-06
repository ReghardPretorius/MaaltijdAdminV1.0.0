import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }) => {
  return (
    <Container >
      <Row className='justify-content-md-center mt-1 mb-5' >
        <Col xs={12} md={6} className='card p-3' style={{ borderColor: '#daa927', borderStyle:'solid', borderWidth:'medium'}}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;