import { useEffect, useRef, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';

//contexts
import StateContext from '../Contexts/StateContext';

// MUI
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

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
            `http://localhost:8000/api/profiles/${GlobalState.userId}/update/`,
            formData
          );
          console.log(response.data);
          navigate(0);
        } catch (error) {
          console.log(error.response);
        }
      }
      updateProfile();
    }
  }, [state.sendRequest]);

  function formSubmitHandler(e) {
    e.preventDefault();
    dispatch({ type: 'changeSendRequest' });
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

  return (
    <>
      <div className='formContainer'>
        <form onSubmit={formSubmitHandler}>
          <Grid item container className='formHeader'>
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
              className='update-btn'
            >
              UPDATE
            </Button>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default ProfileUpdate;
