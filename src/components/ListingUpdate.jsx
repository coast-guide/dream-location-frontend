import React, { useEffect, useRef, useMemo, useContext } from 'react';
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
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

//css
import './AddProperty.css';

const listingTypeOptions = [
  {
    value: '',
    label: '',
  },
  {
    value: 'Apartment',
    label: 'Apartment',
  },
  {
    value: 'House',
    label: 'House',
  },
  {
    value: 'Office',
    label: 'Office',
  },
];
const propertyStatusOptions = [
  {
    value: '',
    label: '',
  },
  {
    value: 'Sale',
    label: 'Sale',
  },
  {
    value: 'Rent',
    label: 'Rent',
  },
];
const rentalFrequencyOptions = [
  {
    value: '',
    label: '',
  },
  {
    value: 'Month',
    label: 'Month',
  },
  {
    value: 'Week',
    label: 'Week',
  },
  {
    value: 'Day',
    label: 'Day',
  },
];

function ListingUpdate(props) {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const initialState = {
    titleValue: props.listingData.title,
    listingTypeValue: props.listingData.listing_type,
    descriptionValue: props.listingData.description,
    propertyStatusValue: props.listingData.property_status,
    priceValue: props.listingData.price,
    rentalFrequencyValue: props.listingData.rental_frequency,
    roomsValue: props.listingData.rooms,
    furnishedValue: props.listingData.furnished,
    poolValue: props.listingData.pool,
    elevatorValue: props.listingData.elevator,
    CctvValue: props.listingData.cctv,
    parkingValue: props.listingData.parking,
    sendRequest: 0,
    openSnack: false,
    disabledBtn: false,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'catchTitleChange':
        draft.titleValue = action.titleChosen;
        break;
      case 'catchListingTypeChange':
        draft.listingTypeValue = action.listingTypeChosen;
        break;
      case 'catchDescriptionChange':
        draft.descriptionValue = action.descriptionChosen;
        break;

      case 'catchPropertyStatusChange':
        draft.propertyStatusValue = action.propertyStatusChosen;
        break;
      case 'catchPriceChange':
        draft.priceValue = action.priceChosen;
        break;
      case 'catchRentalFrequencyChange':
        draft.rentalFrequencyValue = action.rentalFrequencyChosen;
        break;
      case 'catchRoomsChange':
        draft.roomsValue = action.roomsChosen;
        break;
      case 'catchFurnishedChange':
        draft.furnishedValue = action.furnishedChosen;
        break;
      case 'catchPoolChange':
        draft.poolValue = action.poolChosen;
        break;
      case 'catchElevatorChange':
        draft.elevatorValue = action.elevatorChosen;
        break;
      case 'catchCctvChange':
        draft.CctvValue = action.CctvChosen;
        break;
      case 'catchParkingChange':
        draft.parkingValue = action.parkingChosen;
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

  function formSubmitHandler(e) {
    e.preventDefault();
    console.log('The form has been submitted');
    dispatch({ type: 'changeSendRequest' });
    dispatch({ type: 'disableTheBtn' });
  }

  useEffect(() => {
    if (state.sendRequest) {
      async function updateProperty() {
        const formData = new FormData();

        if (state.listingTypeValue === 'Office') {
          formData.append('title', state.titleValue);
          formData.append('description', state.descriptionValue);
          formData.append('listing_type', state.listingTypeValue);
          formData.append('property_status', state.propertyStatusValue);
          formData.append('price', state.priceValue);
          formData.append('rental_frequency', state.rentalFrequencyValue);
          formData.append('rooms', 0);
          formData.append('furnished', state.furnishedValue);
          formData.append('pool', state.poolValue);
          formData.append('elevator', state.elevatorValue);
          formData.append('cctv', state.CctvValue);
          formData.append('parking', state.parkingValue);
          formData.append('seller', GlobalState.userId);
        } else {
          formData.append('title', state.titleValue);
          formData.append('description', state.descriptionValue);
          formData.append('listing_type', state.listingTypeValue);
          formData.append('property_status', state.propertyStatusValue);
          formData.append('price', state.priceValue);
          formData.append('rental_frequency', state.rentalFrequencyValue);
          formData.append('rooms', state.roomsValue);
          formData.append('furnished', state.furnishedValue);
          formData.append('pool', state.poolValue);
          formData.append('elevator', state.elevatorValue);
          formData.append('cctv', state.CctvValue);
          formData.append('parking', state.parkingValue);
          formData.append('seller', GlobalState.userId);
        }

        try {
          const response = await Axios.patch(
            `http://localhost:8000/api/listings/${props.listingData.id}/update/`,
            formData
          );
          console.log(response.data);
          dispatch({ type: 'openTheSnack' });
        } catch (error) {
          dispatch({ type: 'allowTheButton' });
          console.log(error.response);
        }
      }
      updateProperty();
    }
  }, [state.sendRequest]);

  function priceDisplay() {
    if (state.propertyStatusValue === 'Rent')
      if (state.rentalFrequencyValue === 'Day') return 'Price per day*';
      else if (state.rentalFrequencyValue === 'Week') return 'Price per week*';
      else if (state.rentalFrequencyValue === 'Month')
        return 'Price per month*';
    return 'Price* ';
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
    <div className='formContainer'>
      <form onSubmit={formSubmitHandler}>
        <Grid item container className='formHeader'>
          <Typography variant='h4'>UPDATE LISTING</Typography>
        </Grid>
        <Grid item container className='containerItem'>
          <TextField
            id='title'
            label='Title*'
            variant='standard'
            fullWidth
            value={state.titleValue}
            onChange={(e) =>
              dispatch({
                type: 'catchTitleChange',
                titleChosen: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item container justifyContent='space-between'>
          <Grid item xs={5} className='containerItem'>
            <TextField
              id='listingType'
              label='Listing Type*'
              variant='standard'
              fullWidth
              value={state.listingTypeValue}
              onChange={(e) =>
                dispatch({
                  type: 'catchListingTypeChange',
                  listingTypeChosen: e.target.value,
                })
              }
              select
              SelectProps={{
                native: true,
              }}
            >
              {listingTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={5} className='containerItem'>
            <TextField
              id='propertyStatus'
              label='Property Status*'
              variant='standard'
              fullWidth
              value={state.propertyStatusValue}
              onChange={(e) =>
                dispatch({
                  type: 'catchPropertyStatusChange',
                  propertyStatusChosen: e.target.value,
                })
              }
              select
              SelectProps={{
                native: true,
              }}
            >
              {propertyStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Grid item container justifyContent='space-between'>
          <Grid item xs={5} className='containerItem'>
            <TextField
              id='rentalFrequency'
              label='Rental Frequency'
              variant='standard'
              disabled={state.propertyStatusValue === 'Sale' ? true : false}
              fullWidth
              value={state.rentalFrequencyValue}
              onChange={(e) =>
                dispatch({
                  type: 'catchRentalFrequencyChange',
                  rentalFrequencyChosen: e.target.value,
                })
              }
              select
              SelectProps={{
                native: true,
              }}
            >
              {rentalFrequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={5} className='containerItem'>
            <TextField
              id='price'
              type='number'
              label={priceDisplay()}
              variant='standard'
              fullWidth
              value={state.priceValue}
              onChange={(e) =>
                dispatch({
                  type: 'catchPriceChange',
                  priceChosen: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <Grid item container className='containerItem'>
          <TextField
            id='description'
            label='Description'
            variant='outlined'
            multiline
            rows={6}
            fullWidth
            value={state.descriptionValue}
            onChange={(e) =>
              dispatch({
                type: 'catchDescriptionChange',
                descriptionChosen: e.target.value,
              })
            }
          />
        </Grid>

        {state.listingTypeValue !== 'Office' ? (
          <Grid item xs={3} container className='containerItem'>
            <TextField
              id='rooms'
              type='number'
              label='Rooms'
              variant='standard'
              fullWidth
              value={state.roomsValue}
              onChange={(e) =>
                dispatch({
                  type: 'catchRoomsChange',
                  roomsChosen: e.target.value,
                })
              }
            />
          </Grid>
        ) : (
          ''
        )}
        <Grid item container>
          <Grid item xs={2} className='containerItem'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.furnishedValue}
                  onChange={(e) =>
                    dispatch({
                      type: 'catchFurnishedChange',
                      furnishedChosen: e.target.checked,
                    })
                  }
                />
              }
              label='Furnished'
            />
          </Grid>
          <Grid item xs={2} className='containerItem'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.poolValue}
                  onChange={(e) =>
                    dispatch({
                      type: 'catchPoolChange',
                      poolChosen: e.target.checked,
                    })
                  }
                />
              }
              label='Pool'
            />
          </Grid>

          <Grid item xs={2} className='containerItem'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.elevatorValue}
                  onChange={(e) =>
                    dispatch({
                      type: 'catchElevatorChange',
                      elevatorChosen: e.target.checked,
                    })
                  }
                />
              }
              label='Elevator'
            />
          </Grid>

          <Grid item xs={2} className='containerItem'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.CctvValue}
                  onChange={(e) =>
                    dispatch({
                      type: 'catchCctvChange',
                      CctvChosen: e.target.checked,
                    })
                  }
                />
              }
              label='Cctv'
            />
          </Grid>

          <Grid item xs={2} className='containerItem'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.parkingValue}
                  onChange={(e) =>
                    dispatch({
                      type: 'catchParkingChange',
                      parkingChosen: e.target.checked,
                    })
                  }
                />
              }
              label='Parking'
            />
          </Grid>
        </Grid>

        <Grid item container xs={8} className='submit-btn-container'>
          <Button
            variant='contained'
            fullWidth
            type='submit'
            className='submit-btn'
            disabled={state.disabledBtn}
          >
            UPDATE
          </Button>
        </Grid>
      </form>
      <Button variant='contained' onClick={props.closeDialog}>
        {' '}
        CANCEL{' '}
      </Button>

      <Snackbar
        open={state.openSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity='success'>
          you have successfully updated this listings!{' '}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ListingUpdate;
