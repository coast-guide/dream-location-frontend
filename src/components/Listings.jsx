import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';

//React leaflet
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// leaflet
import { Icon } from 'leaflet';

// MUI
import RoomIcon from '@mui/icons-material/Room';
import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

//Map Icons
import apartmentIconPng from '../Assets/MapIcons/apartment.png';
import houseIconPng from '../Assets/MapIcons/house.png';
import officeIconPng from '../Assets/MapIcons/office.png';

// Assets
import './Listings.css';

function Listings() {
  const navigate = useNavigate();
  const houseIcon = new Icon({
    iconUrl: houseIconPng,
    iconSize: [40, 40],
  });

  const apartmentIcon = new Icon({
    iconUrl: apartmentIconPng,
    iconSize: [40, 40],
  });

  const officeIcon = new Icon({
    iconUrl: officeIconPng,
    iconSize: [40, 40],
  });
  const [latitude, setLatitude] = useState(22.643389171984662);
  const [longitiude, setLongitiude] = useState(88.43367821647634);

  const initialState = {
    mapInstance: null,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'getMap':
        draft.mapInstance = action.mapData;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  function TheMapComponent() {
    const map = useMap();
    dispatch({ type: 'getMap', mapData: map });
    return null;
  }

  const [allListings, setAllListings] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);

  useEffect(() => {
    const source = Axios.CancelToken.source();
    async function getAllListings() {
      try {
        const response = await Axios.get(
          'https://dream-location-backend.herokuapp.com/api/listings/',
          { cancelToken: source.token }
        );
        setAllListings(response.data);
        setDataIsLoading(false);
      } catch (error) {}
    }
    getAllListings();

    return () => source.cancel();
  }, []);

  if (dataIsLoading === true)
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
    <Grid container>
      <Grid item xs={4}>
        {allListings.map((listing) => (
          <Card key={listing.id} className='cardStyle'>
            <CardHeader
              action={
                <IconButton
                  aria-label='settings'
                  onClick={() => {
                    state.mapInstance.flyTo(
                      [listing.latitude, listing.longitude],
                      16
                    );
                  }}
                >
                  <RoomIcon />
                </IconButton>
              }
              title={listing.title}
            />
            <CardMedia
              component='img'
              image={listing.picture1}
              alt={listing.title}
              className='pictureStyle'
              onClick={() => navigate(`/listings/${listing.id}`)}
            />
            <CardContent>
              <Typography variant='body2'>
                {listing.description.substring(0, 200)}...
              </Typography>
            </CardContent>

            {listing.property_status === 'Sale' ? (
              <Typography className='priceOverlay'>
                {listing.listing_type}: $
                {listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Typography>
            ) : (
              <Typography className='priceOverlay'>
                {listing.listing_type}: $
                {listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                / {listing.rental_frequency}
              </Typography>
            )}
            <CardActions disableSpacing>
              <IconButton aria-label='add to favorites'>
                {listing.seller_agency_name}
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Grid>
      <Grid item xs={8} className='mapStyle'>
        <AppBar position='sticky'>
          <div style={{ height: '100vh' }}>
            <MapContainer
              center={[latitude, longitiude]}
              zoom={14}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <TheMapComponent />
              {allListings.map(function (listing) {
                function IconDisplay(listing) {
                  if (listing.listing_type === 'Apartment')
                    return apartmentIcon;

                  if (listing.listing_type === 'House') return houseIcon;

                  if (listing.listing_type === 'Office') return officeIcon;
                }

                return (
                  <Marker
                    key={listing.id}
                    icon={IconDisplay(listing)}
                    position={[listing.latitude, listing.longitude]}
                  >
                    <Popup>
                      <Typography variant='h5'>{listing.title}</Typography>
                      <img
                        src={listing.picture1}
                        style={{
                          height: '14rem',
                          width: '18rem',
                          cursor: 'pointer',
                        }}
                        alt={`listed ${listing.listing_type}`}
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      />
                      <Typography variant='body1'>
                        {listing.description.substring(0, 150)}...
                      </Typography>
                      <Button
                        variant='contained'
                        fullWidth
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      >
                        Details
                      </Button>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </AppBar>
      </Grid>
    </Grid>
  );
}

export default Listings;
