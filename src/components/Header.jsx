import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
//MUI
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';

//Icons
import { BiLogOutCircle } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';

//Context
import StateContext from '../Contexts/StateContext';
import DispatchContext from '../Contexts/DispatchContext';

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

  async function handleLogout() {
    setAnchorEl(null);
    const confirmLogout = window.confirm('Are you sure you want to leave?');
    if (confirmLogout) {
      try {
        const response = await Axios.post(
          'http://localhost:8000/api-auth-djoser/token/logout/',
          GlobalState.userToken,
          { headers: { Authorization: 'Token '.concat(GlobalState.userToken) } }
        );
        console.log(response);
        GlobalDispatch({ type: 'logout' });
        navigate('/');
      } catch (e) {
        console.log(e.response);
      }
    }
  }

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

          {GlobalState.userIsLogged ? (
            <Button className='loginBtn' onClick={handleClick}>
              {GlobalState.userUserName}
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
              <Button startIcon={<CgProfile />} onClick={handleClose}>
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
      </Toolbar>
    </AppBar>
  );
}

export default Header;
