import Axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';

//contexts
import StateContext from '../Contexts/StateContext';

// MUI
import { Button, Grid, Snackbar, TextField, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

//css
import './Profile.css';

function ProfileUpdate(props) {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    agencyNameValue: props.userProfile.agencyName,
    phoneNumberValue: props.userProfile.phoneNumber,
    bioValue: props.userProfile.bio,
    uploadedPicture: [],
    profilePictureValue: props.userProfile.profilePic,
    sendRequest: 0,
    openSnack: false,
    disabledBtn: false,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'catchAgencyNameChange':
        draft.agencyNameValue = action.agencyNameChosen;
        break;
      case 'catchPhoneNumberChange':
        draft.phoneNumberValue = action.phoneNumberChosen;
        break;
      case 'catchBioChange':
        draft.bioValue = action.bioChosen;
        break;
      case 'catchUploadedPicture':
        draft.uploadedPicture = action.pictureChosen;
        break;
      case 'catchProfilePictureChange':
        draft.profilePictureValue = action.profilePictureChosen;
        break;
      case 'changeSendRequest':
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case 'openTheSnack':
        draft.openSnack = true;
        break;

      case 'disableTheBtn':
        draft.disabledBtn = true;
        break;

      case 'allowTheButton':
        draft.disabledBtn = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  //use effect to catch uploaded picture
  useEffect(() => {
    if (state.uploadedPicture[0]) {
      dispatch({
        type: 'catchProfilePictureChange',
        profilePictureChosen: state.uploadedPicture[0],
      });
    }
  }, [state.uploadedPicture[0]]);

  //use effect to send the request
  useEffect(() => {
    if (state.sendRequest) {
      async function updateProfile() {
        const formData = new FormData();
        if (
          typeof state.profilePictureValue === 'string' ||
          state.profilePictureValue === null
        ) {
          formData.append('agency_name', state.agencyNameValue);
          formData.append('phone_number', state.phoneNumberValue);
          formData.append('bio', state.bioValue);
          formData.append('seller', GlobalState.userId);
        } else {
          formData.append('agency_name', state.agencyNameValue);
          formData.append('phone_number', state.phoneNumberValue);
          formData.append('bio', state.bioValue);
          formData.append('profile_picture', state.profilePictureValue);
          formData.append('seller', GlobalState.userId);
        }

        try {
          const response = await Axios.patch(
            `https://dream-location-backend.herokuapp.com/api/profiles/${GlobalState.userId}/update/`,
            formData
          );

          dispatch({ type: 'openTheSnack' });
        } catch (error) {
          dispatch({ type: 'allowTheButton' });
        }
      }
      updateProfile();
    }
  }, [state.sendRequest]);

  function formSubmitHandler(e) {
    e.preventDefault();
    dispatch({ type: 'changeSendRequest' });
    dispatch({ type: 'disableTheBtn' });
  }

  function profilePictureDisplay() {
    if (typeof state.profilePictureValue !== 'string') {
      return (
        <ul>
          {state.profilePictureValue ? (
            <li>{state.profilePictureValue.name}</li>
          ) : (
            ''
          )}
        </ul>
      );
    } else if (typeof state.profilePictureValue === 'string') {
      return (
        <Grid item className='update-profile-picture-container'>
          <img
            src={props.userProfile.profilePic}
            alt='profile picture'
            className='update-profile-picture'
          />
        </Grid>
      );
    }
  }
  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate(0);
      }, 1500);
    }
  }, [state.openSnack]);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });
  return (
    <>
      <div className='formContainer'>
        <form onSubmit={formSubmitHandler}>
          <Grid item container justifyContent='center'>
            <Typography variant='h4'>MY PROFILE</Typography>
          </Grid>
          <Grid item container className='containerItem'>
            <TextField
              id='agencyName'
              label='Agency Name*'
              variant='outlined'
              fullWidth
              value={state.agencyNameValue}
              onChange={(e) =>
                dispatch({
                  type: 'catchAgencyNameChange',
                  agencyNameChosen: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item container className='containerItem'>
            <TextField
              id='phoneNumber'
              label='Phone Number*'
              variant='outlined'
              fullWidth
              value={state.phoneNumberValue}
              onChange={(e) =>
                dispatch({
                  type: 'catchPhoneNumberChange',
                  phoneNumberChosen: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item container className='containerItem'>
            <TextField
              id='bio'
              label='Bio'
              variant='outlined'
              fullWidth
              multiline
              rows={6}
              value={state.bioValue}
              onChange={(e) =>
                dispatch({
                  type: 'catchBioChange',
                  bioChosen: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item container>
            {profilePictureDisplay()}
          </Grid>

          <Grid item container xs={6} className='pictures-btn-container'>
            <Button
              variant='contained'
              component='label'
              fullWidth
              className='pictures-btn'
            >
              PROFILE PICTURE
              <input
                type='file'
                accept='image/png, image/gif, image/jpeg'
                hidden
                onChange={(e) =>
                  dispatch({
                    type: 'catchUploadedPicture',
                    pictureChosen: e.target.files,
                  })
                }
              />
            </Button>
          </Grid>

          <Grid item container xs={8} className='update-btn-container'>
            <Button
              variant='contained'
              fullWidth
              type='submit'
              disabled={state.disabledBtn}
              className='update-btn'
            >
              UPDATE
            </Button>
          </Grid>
        </form>
        <Snackbar
          open={state.openSnack}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity='success'>
            you have successfully updated your profile!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default ProfileUpdate;
