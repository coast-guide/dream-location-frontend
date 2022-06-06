import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  return (
    <AppBar position='static' className='AppBar'>
      <Toolbar>
        <div className='leftNav'>
          <Button color='inherit' onClick={() => navigate('/')}>
            <Typography variant='h4'>Dream Location</Typography>
          </Button>
        </div>
        <div>
          <Button
            color='inherit'
            className='listingsBtn'
            onClick={() => navigate('/listings')}
          >
            <Typography variant='h6'>Listings</Typography>
          </Button>
          <Button color='inherit' className='agenciesBtn'>
            <Typography variant='h6'>Agencies</Typography>
          </Button>
        </div>
        <div className='rightNav'>
          <Button className='propertyBtn'>Add Property</Button>
          <Button className='loginBtn' onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
