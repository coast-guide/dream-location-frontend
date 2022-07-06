import React, { useEffect, useRef, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';

//React leaflet
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet';

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
  Alert,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

//css
import './AddProperty.css';

const areaOptions = [
  {
    value: '',
    label: '',
  },
  {
    value: 'India',
    label: 'India',
  },
  {
    value: 'Outside India',
    label: 'Outside India',
  },
];

const indiaOptions = [
  {
    value: '',
    label: '',
  },
  {
    value: 'Delhi',
    label: 'Delhi',
  },
  {
    value: 'Mumbai',
    label: 'Mumbai',
  },
  {
    value: 'Bangalore',
    label: 'Bangalore',
  },
  {
    value: 'Chennai',
    label: 'Chennai',
  },
  {
    value: 'Hyderabad',
    label: 'Hyderabad',
  },
  {
    value: 'Kolkata',
    label: 'Kolkata',
  },
  {
    value: 'Ahmedabad',
    label: 'Ahmedabad',
  },
  {
    value: 'Pune',
    label: 'Pune',
  },
];

const outsideIndiaOptions = [
  {
    value: '',
    label: '',
  },
  {
    value: 'NewYork',
    label: 'New York City',
  },
  {
    value: 'London',
    label: 'London',
  },
  {
    value: 'Paris',
    label: 'Paris',
  },
  {
    value: 'Tokyo',
    label: 'Tokyo',
  },
  {
    value: 'Dubai',
    label: 'Dubai',
  },

  {
    value: 'Singapore',
    label: 'Singapore',
  },
  {
    value: 'Frankfurt',
    label: 'Frankfurt',
  },
  {
    value: 'Barcelona',
    label: 'Barcelona',
  },
  {
    value: 'Sydney',
    label: 'Sydney',
  },
];

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

function AddProperty() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const initialState = {
    titleValue: '',
    listingTypeValue: '',
    descriptionValue: '',
    areaValue: '',
    cityValue: '',
    latitudeValue: '',
    longitudeValue: '',
    propertyStatusValue: '',
    priceValue: '',
    rentalFrequencyValue: '',
    roomsValue: '',
    furnishedValue: false,
    poolValue: false,
    elevatorValue: false,
    CctvValue: false,
    parkingValue: false,
    picture1Value: '',
    picture2Value: '',
    picture3Value: '',
    picture4Value: '',
    picture5Value: '',
    mapInstance: null,
    markerPosition: {
      lat: '22.5726',
      lng: '88.3639',
    },
    uploadedPictures: [],
    sendRequest: 0,
    userProfile: {
      agencyName: '',
      phoneNumber: '',
    },
    openSnack: false,
    disabledBtn: false,
    titleErrors: {
      hasErrors: false,
      errorMessage: '',
    },
    listingTypeErrors: {
      hasErrors: false,
      errorMessage: '',
    },
    propertyStatusErrors: {
      hasErrors: false,
      errorMessage: '',
    },
    priceErrors: {
      hasErrors: false,
      errorMessage: '',
    },
    areaErrors: {
      hasErrors: false,
      errorMessage: '',
    },
    cityErrors: {
      hasErrors: false,
      errorMessage: '',
    },
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'catchTitleChange':
        draft.titleValue = action.titleChosen;
        draft.titleErrors.hasErrors = false;
        draft.titleErrors.errorMessage = '';
        break;
      case 'catchListingTypeChange':
        draft.listingTypeValue = action.listingTypeChosen;
        draft.listingTypeErrors.hasErrors = false;
        draft.listingTypeErrors.errorMessage = '';
        break;
      case 'catchDescriptionChange':
        draft.descriptionValue = action.descriptionChosen;
        break;
      case 'catchAreaChange':
        draft.areaValue = action.areaChosen;
        draft.areaErrors.hasErrors = false;
        draft.areaErrors.errorMessage = '';
        break;
      case 'catchCityChange':
        draft.cityValue = action.cityChosen;
        draft.cityErrors.hasErrors = false;
        draft.cityErrors.errorMessage = '';
        break;
      case 'catchLatitudeChange':
        draft.latitudeValue = action.latitudeChosen;
        break;
      case 'catchLongitudeChange':
        draft.longitudeValue = action.longitudeChosen;
        break;
      case 'catchPropertyStatusChange':
        draft.propertyStatusValue = action.propertyStatusChosen;
        draft.propertyStatusErrors.hasErrors = false;
        draft.propertyStatusErrors.errorMessage = '';
        break;
      case 'catchPriceChange':
        draft.priceValue = action.priceChosen;
        draft.priceErrors.hasErrors = false;
        draft.priceErrors.errorMessage = '';
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
      case 'catchPicture1Change':
        draft.picture1Value = action.picture1Chosen;
        break;
      case 'catchPicture2Change':
        draft.picture2Value = action.picture2Chosen;
        break;
      case 'catchPicture3Change':
        draft.picture3Value = action.picture3Chosen;
        break;
      case 'catchPicture4Change':
        draft.picture4Value = action.picture4Chosen;
        break;
      case 'catchPicture5Change':
        draft.picture5Value = action.picture5Chosen;
        break;
      case 'getMap':
        draft.mapInstance = action.mapData;
        break;
      case 'changeMarkerPosition':
        draft.markerPosition.lat = action.changeLatitude;
        draft.markerPosition.lng = action.changeLongitude;
        draft.latitudeValue = '';
        draft.longitudeValue = '';
        break;

      case 'catchUploadedPictures':
        draft.uploadedPictures = action.picturesChosen;
        break;

      case 'changeSendRequest':
        draft.sendRequest = draft.sendRequest + 1;
        break;

      case 'catchUserProfileInfo':
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
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

      case 'catchTitleErrors':
        if (action.titleChosen.length === 0) {
          draft.titleErrors.hasErrors = true;
          draft.titleErrors.errorMessage = 'Title is required';
        }
        break;

      case 'catchListingTypeErrors':
        if (action.listingTypeChosen.length === 0) {
          draft.listingTypeErrors.hasErrors = true;
          draft.listingTypeErrors.errorMessage = 'Listing type is required';
        }
        break;

      case 'catchPropertyStatusErrors':
        if (action.propertyStatusChosen.length === 0) {
          draft.propertyStatusErrors.hasErrors = true;
          draft.propertyStatusErrors.errorMessage =
            'Property status is required';
        }
        break;

      case 'catchPriceErrors':
        if (action.priceChosen.length === 0) {
          draft.priceErrors.hasErrors = true;
          draft.priceErrors.errorMessage = 'Price is required';
        }
        break;

      case 'catchAreaErrors':
        if (action.areaChosen.length === 0) {
          draft.areaErrors.hasErrors = true;
          draft.areaErrors.errorMessage = 'Area is required';
        }
        break;

      case 'catchCityErrors':
        if (action.cityChosen.length === 0) {
          draft.cityErrors.hasErrors = true;
          draft.cityErrors.errorMessage = 'City is required';
        }
        break;

      case 'emptyTitle':
        draft.titleErrors.hasErrors = true;
        draft.titleErrors.errorMessage = 'Title is required';
        break;

      case 'emptyListingType':
        draft.listingTypeErrors.hasErrors = true;
        draft.listingTypeErrors.errorMessage = 'Listing type is required';
        break;

      case 'emptyPropertyStatus':
        draft.propertyStatusErrors.hasErrors = true;
        draft.propertyStatusErrors.errorMessage = 'Property status is required';
        break;

      case 'emptyPrice':
        draft.priceErrors.hasErrors = true;
        draft.priceErrors.errorMessage = 'Price is required';
        break;

      case 'emptyArea':
        draft.areaErrors.hasErrors = true;
        draft.areaErrors.errorMessage = 'Area is required';
        break;

      case 'emptyCity':
        draft.cityErrors.hasErrors = true;
        draft.cityErrors.errorMessage = 'City is required';
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  function TheMapComponent() {
    const map = useMap();
    dispatch({ type: 'getMap', mapData: map });
    return null;
  }

  //useEffect to change the map view depending on the city chosen
  useEffect(() => {
    if (state.cityValue === 'Delhi') {
      state.mapInstance.setView([28.7041, 77.1025], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 28.7041,
        changeLongitude: 77.1025,
      });
    } else if (state.cityValue === 'Mumbai') {
      state.mapInstance.setView([19.076, 72.8777], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 19.076,
        changeLongitude: 72.8777,
      });
    } else if (state.cityValue === 'Bangalore') {
      state.mapInstance.setView([12.9716, 77.5946], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 12.9716,
        changeLongitude: 77.5946,
      });
    } else if (state.cityValue === 'Chennai') {
      state.mapInstance.setView([13.0827, 80.2707], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 13.0827,
        changeLongitude: 80.2707,
      });
    } else if (state.cityValue === 'Hyderabad') {
      state.mapInstance.setView([17.385, 78.4867], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 17.385,
        changeLongitude: 78.4867,
      });
    } else if (state.cityValue === 'Kolkata') {
      state.mapInstance.setView([22.5726, 88.3639], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 22.5726,
        changeLongitude: 88.3639,
      });
    } else if (state.cityValue === 'Ahmedabad') {
      state.mapInstance.setView([23.0225, 72.5714], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 23.0225,
        changeLongitude: 72.5714,
      });
    } else if (state.cityValue === 'Pune') {
      state.mapInstance.setView([18.5204, 73.8567], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 18.5204,
        changeLongitude: 73.8567,
      });
    } else if (state.cityValue === 'NewYork') {
      state.mapInstance.setView([40.788710557609065, -73.95911538997547], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 40.788710557609065,
        changeLongitude: -73.95911538997547,
      });
    } else if (state.cityValue === 'London') {
      state.mapInstance.setView([51.5074, 0.1278], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 51.5074,
        changeLongitude: 0.1278,
      });
    } else if (state.cityValue === 'Paris') {
      state.mapInstance.setView([48.8566, 2.3522], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 48.8566,
        changeLongitude: 2.3522,
      });
    } else if (state.cityValue === 'Tokyo') {
      state.mapInstance.setView([35.6895, 139.6917], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 35.6895,
        changeLongitude: 139.6917,
      });
    } else if (state.cityValue === 'Dubai') {
      state.mapInstance.setView([25.2048, 55.2708], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 25.2048,
        changeLongitude: 55.2708,
      });
    } else if (state.cityValue === 'Singapore') {
      state.mapInstance.setView([1.3521, 103.8198], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 1.3521,
        changeLongitude: 103.8198,
      });
    } else if (state.cityValue === 'Frankfurt') {
      state.mapInstance.setView([50.1109, 8.6821], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 50.1109,
        changeLongitude: 8.6821,
      });
    } else if (state.cityValue === 'Barcelona') {
      state.mapInstance.setView([41.3851, 2.1734], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: 41.3851,
        changeLongitude: 2.1734,
      });
    } else if (state.cityValue === 'Sydney') {
      state.mapInstance.setView([-33.8688, 151.2093], 12);
      dispatch({
        type: 'changeMarkerPosition',
        changeLatitude: -33.8688,
        changeLongitude: 151.2093,
      });
    }
  }, [state.cityValue]);

  //Draggable Marker
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        console.log(marker.getLatLng());
        dispatch({
          type: 'catchLatitudeChange',
          latitudeChosen: marker.getLatLng().lat,
        });
        dispatch({
          type: 'catchLongitudeChange',
          longitudeChosen: marker.getLatLng().lng,
        });
      },
    }),
    []
  );

  //Catching picture fields
  useEffect(() => {
    if (state.uploadedPictures[0]) {
      dispatch({
        type: 'catchPicture1Change',
        picture1Chosen: state.uploadedPictures[0],
      });
    }
  }, [state.uploadedPictures[0]]);

  useEffect(() => {
    if (state.uploadedPictures[1]) {
      dispatch({
        type: 'catchPicture2Change',
        picture2Chosen: state.uploadedPictures[1],
      });
    }
  }, [state.uploadedPictures[1]]);

  useEffect(() => {
    if (state.uploadedPictures[2]) {
      dispatch({
        type: 'catchPicture3Change',
        picture3Chosen: state.uploadedPictures[2],
      });
    }
  }, [state.uploadedPictures[2]]);

  useEffect(() => {
    if (state.uploadedPictures[3]) {
      dispatch({
        type: 'catchPicture4Change',
        picture4Chosen: state.uploadedPictures[3],
      });
    }
  }, [state.uploadedPictures[3]]);

  useEffect(() => {
    if (state.uploadedPictures[4]) {
      dispatch({
        type: 'catchPicture5Change',
        picture5Chosen: state.uploadedPictures[4],
      });
    }
  }, [state.uploadedPictures[4]]);

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
      } catch (error) {
        console.log(error.response);
      }
    }
    getProfileInfo();
  }, [state.userId]);

  function formSubmitHandler(e) {
    e.preventDefault();
    console.log('The form has been submitted');
    if (
      !state.titleErrors.hasErrors &&
      !state.listingTypeErrors.hasErrors &&
      !state.propertyStatusErrors.hasErrors &&
      !state.priceErrors.hasErrors &&
      !state.areaErrors.hasErrors &&
      !state.cityErrors.hasErrors &&
      state.latitudeValue &&
      state.longitudeValue
    ) {
      dispatch({ type: 'changeSendRequest' });
      dispatch({ type: 'disableTheBtn' });
    } else if (state.titleValue === '') {
      dispatch({ type: 'emptyTitle' });
      window.scrollTo(0, 0);
    } else if (state.listingTypeValue === '') {
      dispatch({ type: 'emptyListingType' });
      window.scrollTo(0, 0);
    } else if (state.propertyStatusValue === '') {
      dispatch({ type: 'emptyPropertyStatus' });
      window.scrollTo(0, 0);
    } else if (state.priceValue === '') {
      dispatch({ type: 'emptyPrice' });
      window.scrollTo(0, 0);
    } else if (state.areaValue === '') {
      dispatch({ type: 'emptyArea' });
      window.scrollTo(0, 0);
    } else if (state.cityValue === '') {
      dispatch({ type: 'emptyCity' });
      window.scrollTo(0, 0);
    }
  }

  useEffect(() => {
    if (state.sendRequest) {
      async function AddProperty() {
        const formData = new FormData();

        formData.append('title', state.titleValue);
        formData.append('description', state.descriptionValue);
        formData.append('area', state.areaValue);
        formData.append('city', state.cityValue);
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
        formData.append('latitude', state.latitudeValue);
        formData.append('longitude', state.longitudeValue);
        formData.append('picture1', state.picture1Value);
        formData.append('picture2', state.picture2Value);
        formData.append('picture3', state.picture3Value);
        formData.append('picture4', state.picture4Value);
        formData.append('picture5', state.picture5Value);
        formData.append('seller', GlobalState.userId);
        try {
          const response = await Axios.post(
            'http://localhost:8000/api/listings/create/',
            formData
          );
          console.log(response.data);
          dispatch({ type: 'openTheSnack' });
        } catch (error) {
          dispatch({ type: 'allowTheButton' });
          console.log(error.response);
        }
      }
      AddProperty();
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

  function submitButtonDisplay() {
    if (
      GlobalState.userIsLogged &&
      state.userProfile.agencyName !== null &&
      state.userProfile.agencyName !== '' &&
      state.userProfile.phoneNumber !== null &&
      state.userProfile.phoneNumber !== ''
    ) {
      return (
        <Button
          variant='contained'
          fullWidth
          type='submit'
          className='submit-btn'
          disabled={state.disabledBtn}
        >
          SUBMIT
        </Button>
      );
    } else if (
      GlobalState.userIsLogged &&
      (state.userProfile.agencyName === null ||
        state.userProfile.agencyName === '' ||
        state.userProfile.phoneNumber === null ||
        state.userProfile.phoneNumber === '')
    ) {
      return (
        <Button
          variant='outlined'
          fullWidth
          onClick={() => {
            navigate('/profile');
          }}
          className='submit-btn'
        >
          COMPLETE YOUR PROFILE TO ADD A PROPERTY
        </Button>
      );
    } else if (!GlobalState.userIsLogged) {
      return (
        <Button
          variant='outlined'
          fullWidth
          onClick={() => {
            navigate('/login');
          }}
          className='submit-btn'
        >
          SIGN IN TO ADD A PROPERTY
        </Button>
      );
    }
  }

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate('/listings');
      }, 1500);
    }
  }, [state.openSnack]);

  const CustomAlert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  return (
    <div className='formContainer'>
      <form onSubmit={formSubmitHandler}>
        <Grid item container className='formHeader'>
          <Typography variant='h4'>SUBMIT A PROPERTY</Typography>
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
            onBlur={(e) =>
              dispatch({
                type: 'catchTitleErrors',
                titleChosen: e.target.value,
              })
            }
            error={state.titleErrors.hasErrors}
            helperText={state.titleErrors.errorMessage}
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
              onBlur={(e) =>
                dispatch({
                  type: 'catchListingTypeErrors',
                  listingTypeChosen: e.target.value,
                })
              }
              error={state.listingTypeErrors.hasErrors}
              helperText={state.listingTypeErrors.errorMessage}
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
              onBlur={(e) =>
                dispatch({
                  type: 'catchPropertyStatusErrors',
                  propertyStatusChosen: e.target.value,
                })
              }
              error={state.propertyStatusErrors.hasErrors}
              helperText={state.propertyStatusErrors.errorMessage}
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
              onBlur={(e) =>
                dispatch({
                  type: 'catchPriceErrors',
                  priceChosen: e.target.value,
                })
              }
              error={state.priceErrors.hasErrors}
              helperText={state.priceErrors.errorMessage}
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

        <Grid item container className='placeContainer'>
          <Grid item xs={5} className='containerItem'>
            <TextField
              id='area'
              label='Area*'
              variant='standard'
              fullWidth
              value={state.areaValue}
              onChange={(e) =>
                dispatch({
                  type: 'catchAreaChange',
                  areaChosen: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: 'catchAreaErrors',
                  areaChosen: e.target.value,
                })
              }
              error={state.areaErrors.hasErrors}
              helperText={state.areaErrors.errorMessage}
              select
              SelectProps={{
                native: true,
              }}
            >
              {areaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={5} className='containerItem'>
            <TextField
              id='city'
              label='City*'
              variant='standard'
              fullWidth
              value={state.cityValue}
              onChange={(e) =>
                dispatch({
                  type: 'catchCityChange',
                  cityChosen: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: 'catchCityErrors',
                  cityChosen: e.target.value,
                })
              }
              error={state.cityErrors.hasErrors}
              helperText={state.cityErrors.errorMessage}
              select
              SelectProps={{
                native: true,
              }}
            >
              {state.areaValue === 'India'
                ? indiaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                : ''}
              {state.areaValue === 'Outside India'
                ? outsideIndiaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                : ''}
            </TextField>
          </Grid>
        </Grid>

        {/* Map */}
        <Grid item container className='location-check-container'>
          {state.latitudeValue && state.longitudeValue ? (
            <Alert severity='success'>
              Your property is located @ {state.latitudeValue},{' '}
              {state.longitudeValue}
            </Alert>
          ) : (
            <Alert severity='warning'>
              Locate Your property on the map before submitting this form.
            </Alert>
          )}
        </Grid>

        <Grid item container className='MapContainer'>
          <MapContainer
            center={[22.5726, 88.3639]}
            zoom={12}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <TheMapComponent />
            <Marker
              draggable
              eventHandlers={eventHandlers}
              position={state.markerPosition}
              ref={markerRef}
            ></Marker>
          </MapContainer>
        </Grid>

        <Grid item container xs={6} className='pictures-btn-container'>
          <Button
            variant='contained'
            component='label'
            fullWidth
            className='pictures-btn'
          >
            UPLOAD PICTURES (MAX 5)
            <input
              type='file'
              multiple
              accept='image/png, image/gif, image/jpeg'
              hidden
              onChange={(e) =>
                dispatch({
                  type: 'catchUploadedPictures',
                  picturesChosen: e.target.files,
                })
              }
            />
          </Button>
        </Grid>

        <Grid item container>
          <ul>
            {state.picture1Value ? <li>{state.picture1Value.name}</li> : ''}
            {state.picture2Value ? <li>{state.picture2Value.name}</li> : ''}
            {state.picture3Value ? <li>{state.picture3Value.name}</li> : ''}
            {state.picture4Value ? <li>{state.picture4Value.name}</li> : ''}
            {state.picture5Value ? <li>{state.picture5Value.name}</li> : ''}
          </ul>
        </Grid>

        <Grid item container xs={8} className='submit-btn-container'>
          {submitButtonDisplay()}
        </Grid>
      </form>

      <Snackbar
        open={state.openSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <CustomAlert severity='success'>
          you have successfully added your property!{' '}
        </CustomAlert>
      </Snackbar>
    </div>
  );
}

export default AddProperty;
