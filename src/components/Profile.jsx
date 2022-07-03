import { useEffect, useRef, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';

//contexts
import StateContext from '../Contexts/StateContext';

//Assets
import defaultProfilePicture from '../Assets/default-profile-picture.png';

//components
import ProfileUpdate from './ProfileUpdate';

// MUI
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';

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
          `http://localhost:8000/api/profiles/${GlobalState.userId}/`
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
                You have x properties listed
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
