import Axios from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';

//contexts
import StateContext from '../Contexts/StateContext';

//Assets
import defaultProfilePicture from '../Assets/default-profile-picture.png';

//components
import ProfileUpdate from './ProfileUpdate';

// MUI
import { Button, CircularProgress, Grid, Typography } from '@mui/material';

//css
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const initialState = {
    userProfile: {
      agencyName: '',
      phoneNumber: '',
      profilePic: '',
      bio: '',
    },
    dataIsLoading: true,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'catchUserProfileInfo':
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.bio = action.profileObject.bio;
        draft.userProfile.sellerListings = action.profileObject.seller_listings;
        draft.userProfile.sellerId = action.profileObject.seller;
        break;

      case 'loadingDone':
        draft.dataIsLoading = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  //request to get profile info
  useEffect(() => {
    async function getProfileInfo() {
      try {
        const response = await Axios.get(
          `https://dream-location-backend.herokuapp.com/api/profiles/${GlobalState.userId}/`
        );
        console.log(response.data);
        dispatch({
          type: 'catchUserProfileInfo',
          profileObject: response.data,
        });
        dispatch({ type: 'loadingDone' });
      } catch (error) {
        console.log(error.response);
      }
    }
    getProfileInfo();
  }, [state.userId]);

  function propertiesDisplay() {
    if (state.userProfile.sellerListings.length === 0) {
      return (
        <Button
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          disabled
          size='small'
        >
          No Property
        </Button>
      );
    } else if (state.userProfile.sellerListings.length === 1) {
      return (
        <Button
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          size='small'
        >
          One Property listed
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          size='small'
        >
          {state.userProfile.sellerListings.length} Properties
        </Button>
      );
    }
  }

  function WelcomeDisplay() {
    if (
      state.userProfile.agencyName === null ||
      state.userProfile.agencyName === '' ||
      state.userProfile.phoneNumber === null ||
      state.userProfile.phoneNumber === ''
    ) {
      return (
        <Typography className='welcome-text-container' variant='h5'>
          {' '}
          Welcome{' '}
          <span className='welcome-text'>{GlobalState.userUserName}</span>,
          please submit this form below to update your profile.
        </Typography>
      );
    } else {
      return (
        <Grid container className='profile-container'>
          <Grid item xs={6}>
            <img
              className='profile-picture'
              src={
                state.userProfile.profilePic !== null
                  ? state.userProfile.profilePic
                  : defaultProfilePicture
              }
            />
          </Grid>
          <Grid
            item
            container
            direction='column'
            justifyContent='center'
            xs={6}
          >
            <Grid item>
              <Typography className='welcome-text-container' variant='h5'>
                Welcome{' '}
                <span className='welcome-text'>{GlobalState.userUserName}</span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography className='welcome-text-container' variant='h5'>
                You have {propertiesDisplay()}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  if (state.dataIsLoading === true)
    return (
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        style={{ height: '100vh' }}
      >
        <CircularProgress />
      </Grid>
    );
  return (
    <>
      <div>{WelcomeDisplay()}</div>

      <ProfileUpdate userProfile={state.userProfile} />
    </>
  );
}

export default Profile;
