import Axios from 'axios';
import React, { useContext, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';

//contexts
import StateContext from '../Contexts/StateContext';

//Css
import './ListingDetail.css';

//Assets
import defaultProfilePicture from '../Assets/default-profile-picture.png';
import hospitalIconPng from '../Assets/MapIcons/hospital.png';
import stadiumIconPng from '../Assets/MapIcons/stadium.png';
import universityIconPng from '../Assets/MapIcons/university.png';

//Components
import ListingUpdate from './ListingUpdate';

// React Leaflet
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { Icon } from 'leaflet';

// MUI
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PhoneIcon from '@mui/icons-material/Phone';
import RoomIcon from '@mui/icons-material/Room';
import {
  Breadcrumbs,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  Link,
  Snackbar,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

function ListingDetail() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const params = useParams();

  const stadiumIcon = new Icon({
    iconUrl: stadiumIconPng,
    iconSize: [40, 40],
  });

  const hospitalIcon = new Icon({
    iconUrl: hospitalIconPng,
    iconSize: [40, 40],
  });

  const universityIcon = new Icon({
    iconUrl: universityIconPng,
    iconSize: [40, 40],
  });

  const initialState = {
    dataIsLoading: true,
    listingInfo: '',
    sellerProfileInfo: '',
    openSnack: false,
    disabledBtn: false,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'catchListingInfo':
        draft.listingInfo = action.listingObject;
        break;
      case 'loadingDone':
        draft.dataIsLoading = false;
        break;
      case 'catchSellerProfileInfo':
        draft.sellerProfileInfo = action.profileObject;
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

  //request to get listing info
  useEffect(() => {
    async function getListingInfo() {
      try {
        const response = await Axios.get(
          `https://dream-location-backend.herokuapp.com/api/listings/${params.id}/`
        );
        console.log(response.data);
        dispatch({
          type: 'catchListingInfo',
          listingObject: response.data,
        });
      } catch (error) {
        console.log(error.response);
      }
    }
    getListingInfo();
  }, []);

  //request to get profile info
  useEffect(() => {
    if (state.listingInfo) {
      async function getProfileInfo() {
        try {
          const response = await Axios.get(
            `https://dream-location-backend.herokuapp.com/api/profiles/${state.listingInfo.seller}/`
          );
          console.log(response.data);
          dispatch({
            type: 'catchSellerProfileInfo',
            profileObject: response.data,
          });
          dispatch({ type: 'loadingDone' });
        } catch (error) {
          console.log(error.response);
        }
      }
      getProfileInfo();
    }
  }, [state.listingInfo]);

  const listingPictures = [
    state.listingInfo.picture1,
    state.listingInfo.picture2,
    state.listingInfo.picture3,
    state.listingInfo.picture4,
    state.listingInfo.picture5,
  ]
    .filter((picture) => picture !== null)
    .map((picture) => ({
      original: picture,
      thumbnail: picture,
      fullscreen: picture,
    }));

  const date = new Date(state.listingInfo.date_posted);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  async function deleteHandler() {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this listing?'
    );
    if (confirmDelete) {
      try {
        const response = await Axios.delete(
          `https://dream-location-backend.herokuapp.com/api/listings/${params.id}/delete/`
        );
        console.log(response.data);
        dispatch({ type: 'openTheSnack' });
        dispatch({ type: 'disableTheBtn' });
      } catch (error) {
        dispatch({ type: 'allowTheButton' });
        console.log(error.response.data);
      }
    }
  }
  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate('/listings');
      }, 1500);
    }
  }, [state.openSnack]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  return (
    <div className='listing-detail-container'>
      <Grid item className='breadcrumb-container'>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link
            underline='hover'
            color='inherit'
            onClick={() => navigate('/listings')}
            className='breadcrumb-link'
          >
            Listings
          </Link>

          <Typography color='text.primary'>
            {state.listingInfo.title}
          </Typography>
        </Breadcrumbs>
      </Grid>
      {/* Image slider */}
      <Grid
        item
        container
        justifyContent='center'
        className='image-slider-container'
      >
        <ImageGallery
          items={listingPictures}
          showThumbnails={false}
          lazyLoad={true}
          showPlayButton={true}
          showFullscreenButton={true}
          autoPlay={true}
          showBullets={true}
        />
      </Grid>
      {/* More Information */}
      <Grid item container className='listing-info-container'>
        <Grid item container direction='column' xs={7} spacing={1}>
          <Grid item>
            <Typography variant='h5'> {state.listingInfo.title}</Typography>
          </Grid>
          <Grid item>
            <RoomIcon />{' '}
            <Typography variant='h6'> {state.listingInfo.city}</Typography>
          </Grid>
          <Grid item>
            <Typography variant='subtitle1'>{formattedDate}</Typography>
          </Grid>
        </Grid>
        <Grid item container xs={5} alignItems='center'>
          <Typography variant='h6' className='listing_price'>
            {state.listingInfo.listing_type} |{' '}
            {state.listingInfo.property_status === 'Sale'
              ? `$${state.listingInfo.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
              : `$${state.listingInfo.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/${
                  state.listingInfo.rental_frequency
                }`}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        item
        container
        justifyContent='flex-start'
        className='listing-info-container'
      >
        {state.listingInfo.rooms > 0 ? (
          <Grid item xs={2} className='check-item'>
            <Typography variant='h6'>
              {' '}
              {state.listingInfo.rooms} Rooms
            </Typography>
          </Grid>
        ) : (
          ''
        )}
        {state.listingInfo.furnished && (
          <Grid item xs={2} className='check-item'>
            <CheckBoxIcon className='checkbox-icon' />{' '}
            <Typography variant='h6'> Furnished</Typography>
          </Grid>
        )}
        {state.listingInfo.pool && (
          <Grid item xs={2} className='check-item'>
            <CheckBoxIcon className='checkbox-icon' />{' '}
            <Typography variant='h6'> Pool</Typography>
          </Grid>
        )}
        {state.listingInfo.elevator && (
          <Grid item xs={2} className='check-item'>
            <CheckBoxIcon className='checkbox-icon' />{' '}
            <Typography variant='h6'> Elevator</Typography>
          </Grid>
        )}
        {state.listingInfo.cctv && (
          <Grid item xs={2} className='check-item'>
            <CheckBoxIcon className='checkbox-icon' />{' '}
            <Typography variant='h6'> Cctv</Typography>
          </Grid>
        )}
        {state.listingInfo.parking && (
          <Grid item xs={2} className='check-item'>
            <CheckBoxIcon className='checkbox-icon' />{' '}
            <Typography variant='h6'> Parking</Typography>
          </Grid>
        )}
      </Grid>
      {/* Description */}
      {state.listingInfo.description && (
        <Grid item container className='listing-info-container'>
          <Typography variant='h5'>Description</Typography>
          <Typography variant='h6'>{state.listingInfo.description}</Typography>
        </Grid>
      )}

      {/* Seller Info */}
      <Grid container className='profile-container'>
        <Grid item xs={6}>
          <img
            className='profile-picture'
            src={
              state.sellerProfileInfo.profile_picture !== null
                ? state.sellerProfileInfo.profile_picture
                : defaultProfilePicture
            }
            onClick={() =>
              navigate(`/agencies/${state.sellerProfileInfo.seller}`)
            }
          />
        </Grid>
        <Grid item container direction='column' justifyContent='center' xs={6}>
          <Grid item>
            <Typography className='welcome-text-container' variant='h5'>
              <span className='welcome-text'>
                {state.sellerProfileInfo.agency_name}
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <Typography className='welcome-text-container' variant='h5'>
              <IconButton>
                <PhoneIcon /> {state.sellerProfileInfo.phone_number}
              </IconButton>
            </Typography>
          </Grid>
        </Grid>
        {GlobalState.userId == state.listingInfo.seller && (
          <Grid item container justifyContent='space-around'>
            <Button
              onClick={handleClickOpen}
              variant='contained'
              color='primary'
            >
              Update
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={deleteHandler}
              disabled={state.disabledBtn}
            >
              Delete
            </Button>

            <Dialog open={open} onClose={handleClose} fullScreen>
              <ListingUpdate
                listingData={state.listingInfo}
                closeDialog={handleClose}
              />
            </Dialog>
          </Grid>
        )}
      </Grid>

      {/* Map */}
      <Grid
        item
        container
        className='map-component-container'
        spacing={1}
        justifyContent='space-between'
      >
        <Grid item xs={3} className='poi-info-container'>
          {state.listingInfo.listing_pois_within_10km.map((poi) => {
            function degreeToRadian(coordinate) {
              return coordinate * (Math.PI / 180);
            }

            function CalculateDistance() {
              const latitude1 = degreeToRadian(state.listingInfo.latitude);
              const longitude1 = degreeToRadian(state.listingInfo.longitude);
              const latitude2 = degreeToRadian(poi.location.coordinates[0]);
              const longitude2 = degreeToRadian(poi.location.coordinates[1]);
              // The formula
              const latDiff = latitude2 - latitude1;
              const lonDiff = longitude2 - longitude1;
              const R = 6371000 / 1000;

              const a =
                Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                Math.cos(latitude1) *
                  Math.cos(latitude2) *
                  Math.sin(lonDiff / 2) *
                  Math.sin(lonDiff / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

              const d = R * c;

              const dist =
                Math.acos(
                  Math.sin(latitude1) * Math.sin(latitude2) +
                    Math.cos(latitude1) *
                      Math.cos(latitude2) *
                      Math.cos(lonDiff)
                ) * R;
              return dist.toFixed(2);
            }
            return (
              <div key={poi.id} className='poi-info'>
                <Typography variant='h6'>{poi.name}</Typography>
                <Typography variant='subtitle1'>
                  {poi.type} |{' '}
                  <span className='distance-text'>
                    {CalculateDistance()} Kilometers
                  </span>
                </Typography>
              </div>
            );
          })}
        </Grid>
        <Grid item xs={9}>
          <MapContainer
            center={[state.listingInfo.latitude, state.listingInfo.longitude]}
            zoom={14}
            scrollWheelZoom={true}
            className='map-container'
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker
              position={[
                state.listingInfo.latitude,
                state.listingInfo.longitude,
              ]}
            >
              <Popup>{state.listingInfo.title}</Popup>
            </Marker>
            {state.listingInfo.listing_pois_within_10km.map((poi) => {
              function poiIcon() {
                if (poi.type === 'Stadium') {
                  return stadiumIcon;
                } else if (poi.type === 'Hospital') {
                  return hospitalIcon;
                } else if (poi.type === 'University') {
                  return universityIcon;
                }
              }
              return (
                poi.location.coordinates && (
                  <Marker
                    key={poi.id}
                    position={[
                      poi.location.coordinates[0],
                      poi.location.coordinates[1],
                    ]}
                    icon={poiIcon()}
                  >
                    <Popup>{poi.name}</Popup>
                  </Marker>
                )
              );
            })}
          </MapContainer>
        </Grid>
      </Grid>
      <Snackbar
        open={state.openSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity='success'>
          you have successfully deleted the property!{' '}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ListingDetail;
