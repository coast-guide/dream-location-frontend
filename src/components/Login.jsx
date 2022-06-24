import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';
// MUI
import { Grid, Typography, Button, TextField } from '@mui/material';

//css
import './Login.css';

//Contexts
import DispatchContext from '../Contexts/DispatchContext';
import StateContext from '../Contexts/StateContext';

function Login() {
  const navigate = useNavigate();
  const GlobalDispatch = useContext(DispatchContext);
  const GlobalState = useContext(StateContext);

  const initialState = {
    usernameValue: '',
    passwordValue: '',
    sendRequest: 0,
    token: '',
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'catchUsernameChange':
        draft.usernameValue = action.usernameChosen;
        break;
      case 'catchPasswordChange':
        draft.passwordValue = action.passwordChosen;
        break;
      case 'changeSendRequest':
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case 'catchToken':
        draft.token = action.tokenValue;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  function formSubmitHandler(e) {
    e.preventDefault();
    console.log('The form has been submitted');
    dispatch({ type: 'changeSendRequest' });
  }

  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
      async function signIn() {
        try {
          const response = await Axios.post(
            'http://localhost:8000/api-auth-djoser/token/login/',
            {
              username: state.usernameValue,
              password: state.passwordValue,
            },
            {
              cancelToken: source.token,
            }
          );
          console.log(response);
          dispatch({
            type: 'catchToken',
            tokenValue: response.data.auth_token,
          });
          GlobalDispatch({
            type: 'catchToken',
            tokenValue: response.data.auth_token,
          });
          // navigate('/');
        } catch (error) {
          console.log(error.response);
        }
      }
      signIn();

      return () => source.cancel();
    }
  }, [state.sendRequest]);

  //Get user info from backend
  useEffect(() => {
    if (state.token !== '') {
      const source = Axios.CancelToken.source();
      async function getUserInfo() {
        try {
          const response = await Axios.get(
            'http://localhost:8000/api-auth-djoser/users/me/',
            {
              headers: { Authorization: `Token ${state.token}` },
            },
            {
              cancelToken: source.token,
            }
          );
          console.log(response);
          GlobalDispatch({
            type: 'userSignsIn',
            usernameInfo: response.data.username,
            emailInfo: response.data.email,
            IdInfo: response.data.id,
          });
          navigate('/');
        } catch (error) {
          console.log(error.response);
        }
      }
      getUserInfo();

      return () => source.cancel();
    }
  }, [state.token]);

  return (
    <div className='formContainer'>
      <form onSubmit={formSubmitHandler}>
        <Grid item container className='formHeader'>
          <Typography variant='h4'>SIGN IN</Typography>
        </Grid>
        <Grid item container className='containerItem'>
          <TextField
            id='username'
            label='Username'
            variant='outlined'
            fullWidth
            value={state.usernameValue}
            onChange={(e) =>
              dispatch({
                type: 'catchUsernameChange',
                usernameChosen: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item container className='containerItem'>
          <TextField
            id='password'
            label='Password'
            variant='outlined'
            fullWidth
            type='password'
            value={state.passwordValue}
            onChange={(e) =>
              dispatch({
                type: 'catchPasswordChange',
                passwordChosen: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item container xs={8} className='login-btn-container'>
          <Button
            variant='contained'
            fullWidth
            type='submit'
            className='login-btn'
          >
            SIGN IN
          </Button>
        </Grid>
      </form>

      <Grid item container className='sign-up-container'>
        <Typography variant='small'>
          Don't have an account yet?
          <span onClick={() => navigate('/register')} className='sign-up-text'>
            SIGN UP
          </span>
        </Typography>
      </Grid>
    </div>
  );
}

export default Login;
