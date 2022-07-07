import Axios from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';

//contexts
import StateContext from '../Contexts/StateContext';

//Assets
import defaultProfilePicture from '../Assets/default-profile-picture.png';

// MUI
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';

//css
import './Agencies.css';

function Agencies() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const initialState = {
    dataIsLoading: true,
    agenciesList: [],
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'catchAgencies':
        draft.agenciesList = action.agenciesArray;
        break;

      case 'loadingDone':
        draft.dataIsLoading = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  //request to get all profiles
  useEffect(() => {
    async function getAgencies() {
      try {
        const response = await Axios.get(`http://localhost:8000/api/profiles/`);
        console.log(response.data);
        dispatch({
          type: 'catchAgencies',
          agenciesArray: response.data,
        });
        dispatch({ type: 'loadingDone' });
      } catch (error) {
        console.log(error.response);
      }
    }
    getAgencies();
  }, [state.userId]);

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
    <Grid
      container
      justifyContent='flex-start'
      spacing={2}
      className='agency-display-container'
    >
      {state.agenciesList.map((agency) => {
        function propertiesDisplay() {
          if (agency.seller_listings.length === 0) {
            return (
              <Button disabled size='small'>
                No Property
              </Button>
            );
          } else if (agency.seller_listings.length === 1) {
            return (
              <Button
                size='small'
                onClick={() => navigate(`/agencies/${agency.seller}`)}
              >
                One property listed
              </Button>
            );
          } else {
            return (
              <Button
                size='small'
                onClick={() => navigate(`/agencies/${agency.seller}`)}
              >
                {agency.seller_listings.length} properties
              </Button>
            );
          }
        }
        if (agency.agency_name && agency.phone_number)
          return (
            <Grid key={agency.id} item className='agency-display-item'>
              <Card>
                <CardMedia
                  component='img'
                  alt='profile picture'
                  height='140'
                  image={
                    agency.profile_picture
                      ? agency.profile_picture
                      : defaultProfilePicture
                  }
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    {agency.agency_name}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {agency.bio.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions>{propertiesDisplay()}</CardActions>
              </Card>
            </Grid>
          );
      })}
    </Grid>
  );
}

export default Agencies;
