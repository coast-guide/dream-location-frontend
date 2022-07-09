import Axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
// MUI
import { Button, Grid, Snackbar, TextField, Typography } from '@mui/material';
import { default as Alert, default as MuiAlert } from '@mui/material/Alert';
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
    openSnack: false,
    disabledBtn: false,
    serverError: false,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'catchUsernameChange':
        draft.usernameValue = action.usernameChosen;
        draft.serverError = false;
        break;
      case 'catchPasswordChange':
        draft.passwordValue = action.passwordChosen;
        draft.serverError = false;
        break;
      case 'changeSendRequest':
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case 'catchToken':
        draft.token = action.tokenValue;
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

      case 'catchServerError':
        draft.serverError = true;
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
      const source = Axios.CancelToken.source();
      async function signIn() {
        try {
          const response = await Axios.post(
            'https://dream-location-backend.herokuapp.com/api-auth-djoser/token/login/',
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
          dispatch({ type: 'allowTheButton' });
          dispatch({ type: 'catchServerError' });
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
            'https://dream-location-backend.herokuapp.com/api-auth-djoser/users/me/',
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
          dispatch({ type: 'openTheSnack' });
        } catch (error) {
          console.log(error.response);
        }
      }
      getUserInfo();

      return () => source.cancel();
    }
  }, [state.token]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate('/');
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
          <Typography variant='h4'>SIGN IN</Typography>
        </Grid>

        {state.serverError ? (
          <Alert severity='error'>Incorrect username or password!</Alert>
        ) : (
          ''
        )}

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
            error={state.serverError}
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
            error={state.serverError}
          />
        </Grid>

        <Grid item container xs={8} className='login-btn-container'>
          <Button
            variant='contained'
            fullWidth
            type='submit'
            className='login-btn'
            disabled={state.disabledBtn}
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

      <Snackbar
        open={state.openSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <CustomAlert severity='success'>
          you have successfully logged in!{' '}
        </CustomAlert>
      </Snackbar>
    </div>
  );
}

export default Login;
