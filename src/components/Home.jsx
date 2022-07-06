import { Typography, Button } from '@mui/material';
import './Home.css';
import city from '../Assets/city.jpg';
import { useNavigate } from 'react-router-dom';

export default function BasicGrid() {
  const navigate = useNavigate();
  return (
    <>
      <div className='cityImg-overlayText-container'>
        <img src={city} alt='City background' className='cityImg' />
        <div className='overlayText'>
          <Typography variant='h1' className='homeText'>
            FIND YOUR <span className='homeTextColor'>NEXT PROPERTY</span> ON
            DREAM LOCATION
          </Typography>
          <Button
            variant='contained'
            className='homeBtn'
            onClick={() => navigate('/listings')}
          >
            SEE ALL PROPERTIES
          </Button>
        </div>
      </div>
    </>
  );
}
