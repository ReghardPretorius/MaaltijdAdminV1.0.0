import { Container, Card, Button } from 'react-bootstrap';
import "../styles/hero.css";


const Hero = () => {
  return (
    // <div style={{ width: '100vw', height: '100vh', margin: '0 auto', padding: '45px 30px 60px', background: '#f4f7ff', backgroundImage: 'url("https://maaltjidassets.s3.af-south-1.amazonaws.com/Background.png")', backgroundRepeat: 'repeat', backgroundSize: 'cover', overflow: 'hidden', backgroundPosition: 'top center'}}> 
    <div className='hero-container'>
      
      <Container className='d-flex justify-content-center'>
        <Card className='p-3 m-1 d-flex flex-column align-items-center hero-card bg-light w-75' style={{ borderColor: '#daa927', borderStyle:'solid', borderWidth:'medium'}}>
          <h1 className='text-center mb-4'>Hello Admin!</h1>
          <p className='text-center mb-4'>
            <h2>Today is going to be a great day!</h2>
          </p>
          <div className='d-flex justify-content-between'>
            <Button variant='primary' style={{backgroundColor: '#1F305E',  borderColor: '#1F305E'}}  href='/login' className='me-3'>
              Sign In
            </Button>
          </div>
        </Card>
      </Container>
      </div>
    // </div>
  );
};

export default Hero;
