import { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';

//contexts
import StateContext from '../Contexts/StateContext';

//Assets
import defaultProfilePicture from '../Assets/default-profile-picture.png';

// MUI
import {
  Grid,
  Typography,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  CardContent,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';

//css
import './AgencyDetail.css';

function AgencyDetail() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const params = useParams();

  const initialState = {
    userProfile: {
      agencyName: '',
      phoneNumber: '',
      profilePic: '',
      bio: '',
      sellerListings: [],
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
          `http://localhost:8000/api/profiles/${params.id}/`
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
  }, []);

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
    <div>
      {' '}
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
        <Grid item container direction='column' justifyContent='center' xs={6}>
          <Grid item>
            <Typography className='welcome-text-container' variant='h5'>
              <span className='welcome-text'>
                {state.userProfile.agencyName}
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <Typography className='welcome-text-container' variant='h5'>
              <IconButton>
                <PhoneIcon /> {state.userProfile.phoneNumber}
              </IconButton>
            </Typography>
          </Grid>
        </Grid>
        <Grid item className='user-bio'>
          {state.userProfile.bio}
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent='flex-start'
        spacing={2}
        className='agency-display-container'
      >
        {state.userProfile.sellerListings.map((listing) => {
          return (
            <Grid key={listing.id} item className='agency-display-item'>
              <Card>
                <CardMedia
                  component='img'
                  height='140'
                  image={
                    `http://localhost:8000${listing.picture1}`
                      ? `http://localhost:8000${listing.picture1}`
                      : defaultProfilePicture
                  }
                  alt='listing picture'
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  style={{ cursor: 'pointer' }}
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    {listing.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {listing.description.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions>
                  {listing.property_status === 'Sale'
                    ? `${listing.listing_type}: $${listing.price}`
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : `${listing.listing_type}: $${listing.price}/${listing.rental_frequency}`
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default AgencyDetail;
