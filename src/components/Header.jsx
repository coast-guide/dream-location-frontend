import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//MUI
import {
  AppBar,
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Toolbar,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

//Icons
import { BiLogOutCircle } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';

//Context
import DispatchContext from '../Contexts/DispatchContext';
import StateContext from '../Contexts/StateContext';

//CSS
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleProfile() {
    setAnchorEl(null);
    navigate('/profile');
  }

  const [openSnack, setOpenSnack] = useState(false);

  async function handleLogout() {
    setAnchorEl(null);
    const confirmLogout = window.confirm('Are you sure you want to leave?');
    if (confirmLogout) {
      try {
        const response = await Axios.post(
          'https://dream-location-backend.herokuapp.com/api-auth-djoser/token/logout/',
          GlobalState.userToken,
          { headers: { Authorization: 'Token '.concat(GlobalState.userToken) } }
        );
        console.log(response);
        GlobalDispatch({ type: 'logout' });
        setOpenSnack(true);
      } catch (e) {
        console.log(e.response);
      }
    }
  }

  useEffect(() => {
    if (openSnack) {
      setTimeout(() => {
        navigate(0);
      }, 1500);
    }
  }, [openSnack]);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

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
          <Button
            color='inherit'
            className='agenciesBtn'
            onClick={() => navigate('/agencies')}
          >
            <Typography variant='h6'>Agencies</Typography>
          </Button>
        </div>
        <div className='rightNav'>
          <Button
            className='propertyBtn'
            onClick={() => navigate('/addProperty')}
          >
            Add Property
          </Button>

          {GlobalState.userIsLogged ? (
            <Button className='loginBtn' onClick={handleClick}>
              {GlobalState.userUsername}
            </Button>
          ) : (
            <Button className='loginBtn' onClick={() => navigate('/login')}>
              Login
            </Button>
          )}

          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem>
              <Button startIcon={<CgProfile />} onClick={handleProfile}>
                Profile
              </Button>
            </MenuItem>
            <MenuItem>
              <Button startIcon={<BiLogOutCircle />} onClick={handleLogout}>
                Logout
              </Button>
            </MenuItem>
          </Menu>
        </div>
        <Snackbar
          open={openSnack}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity='success'>you have successfully logged out! </Alert>
        </Snackbar>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
