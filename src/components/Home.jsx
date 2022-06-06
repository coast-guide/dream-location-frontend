import { Typography, Button } from '@mui/material';
import './Home.css';
import city from '../Assets/city.jpg';

export default function BasicGrid() {
  return (
    <>
      <div className='cityImg-overlayText-container'>
        <img src={city} alt='City background' className='cityImg' />
        <div className='overlayText'>
          <Typography variant='h1' className='homeText'>
            FIND YOUR <span className='homeTextColor'>NEXT PROPERTY</span> ON
            DREAM LOCATION
          </Typography>
          <Button variant='contained' className='homeBtn'>
            SEE ALL PROPERTIES
          </Button>
        </div>
      </div>
    </>
  );
}
