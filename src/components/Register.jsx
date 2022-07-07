import Axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';

// MUI
import {
  Alert,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

//css
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const initialState = {
    usernameValue: '',
    emailValue: '',
    passwordValue: '',
    password2Value: '',
    sendRequest: 0,
    openSnack: false,
    disabledBtn: false,
    usernameErrors: {
      hasErrors: false,
      errorMessage: '',
    },
    emailErrors: {
      hasErrors: false,
      errorMessage: '',
    },
    passwordErrors: {
      hasErrors: false,
      errorMessage: '',
    },
    password2HelperText: '',
    serverMessageUsername: '',
    serverMessageEmail: '',
    serverMessageSimilarPassword: '',
    serverMessageCommonPassword: '',
    serverMessageNumericPassword: '',
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'catchUsernameChange':
        draft.usernameValue = action.usernameChosen;
        draft.usernameErrors.hasErrors = false;
        draft.usernameErrors.errorMessage = '';
        draft.serverMessageUsername = '';
        break;
      case 'catchEmailChange':
        draft.emailValue = action.emailChosen;
        draft.emailErrors.hasErrors = false;
        draft.emailErrors.errorMessage = '';
        draft.serverMessageEmail = '';
        break;
      case 'catchPasswordChange':
        draft.passwordValue = action.passwordChosen;
        draft.passwordErrors.hasErrors = false;
        draft.passwordErrors.errorMessage = '';
        draft.serverMessageSimilarPassword = '';
        draft.serverMessageCommonPassword = '';
        draft.serverMessageNumericPassword = '';
        break;
      case 'catchPassword2Change':
        draft.password2Value = action.password2Chosen;
        if (action.password2Chosen !== draft.passwordValue) {
          draft.password2HelperText = 'The Passwords must match';
        } else if (action.password2Chosen === draft.passwordValue) {
          draft.password2HelperText = '';
        }
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

      case 'catchUsernameErrors':
        if (action.usernameChosen.length === 0) {
          draft.usernameErrors.hasErrors = true;
          draft.usernameErrors.errorMessage = 'This Field must not be empty';
        } else if (action.usernameChosen.length < 5) {
          draft.usernameErrors.hasErrors = true;
          draft.usernameErrors.errorMessage =
            'The username must have at least 5 characters';
        } else if (!/^([a-zA-Z0-9]+)$/.test(action.usernameChosen)) {
          draft.usernameErrors.hasErrors = true;
          draft.usernameErrors.errorMessage =
            'This Field must not have special characters';
        }
        break;

      case 'catchEmailErrors':
        if (
          !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            action.emailChosen
          )
        ) {
          draft.emailErrors.hasErrors = true;
          draft.emailErrors.errorMessage = 'This Field must be a valid email';
        }
        break;

      case 'catchPasswordErrors':
        if (action.passwordChosen.length < 8) {
          draft.passwordErrors.hasErrors = true;
          draft.passwordErrors.errorMessage =
            'The password must have at least 8 characters';
        }
        break;

      case 'usernameExists':
        draft.serverMessageUsername = 'This username already exists';
        break;
      case 'emailExists':
        draft.serverMessageEmail = 'This email already exists';
        break;
      case 'similarPassword':
        draft.serverMessageSimilarPassword =
          'The password is too similar to the username!';
        break;
      case 'commonPassword':
        draft.serverMessageCommonPassword = 'The password is too common!';
        break;
      case 'numericPassword':
        draft.serverMessageNumericPassword =
          'This password must not contain only numbers!';
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  function formSubmitHandler(e) {
    e.preventDefault();
    console.log('The form has been submitted');
    if (
      !state.usernameErrors.hasErrors &&
      !state.emailErrors.hasErrors &&
      !state.passwordErrors.hasErrors &&
      state.password2HelperText === ''
    ) {
      dispatch({ type: 'changeSendRequest' });
      dispatch({ type: 'disableTheBtn' });
    }
  }

  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
      async function signUp() {
        try {
          const response = await Axios.post(
            'http://localhost:8000/api-auth-djoser/users/',
            {
              username: state.usernameValue,
              email: state.emailValue,
              password: state.passwordValue,
              re_password: state.password2Value,
            },
            {
              cancelToken: source.token,
            }
          );
          console.log(response);
          dispatch({ type: 'openTheSnack' });
        } catch (error) {
          dispatch({ type: 'allowTheButton' });
          console.log(error.response);
          if (error.response.data.username) {
            dispatch({
              type: 'usernameExists',
            });
          } else if (error.response.data.email) {
            dispatch({
              type: 'emailExists',
            });
          } else if (
            error.response.data.password[0] ===
            'The password is too similar to the username.'
          ) {
            dispatch({
              type: 'similarPassword',
            });
          } else if (
            error.response.data.password[0] === 'This password is too common.'
          ) {
            dispatch({
              type: 'commonPassword',
            });
          } else if (
            error.response.data.password[0] ===
            'This password is entirely numeric.'
          ) {
            dispatch({
              type: 'numericPassword',
            });
          }
        }
      }
      signUp();

      return () => source.cancel();
    }
  }, [state.sendRequest]);

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
          <Typography variant='h4'>CREATE AN ACCOUNT</Typography>
        </Grid>
        {state.serverMessageUsername ? (
          <Alert severity='error'>{state.serverMessageUsername}</Alert>
        ) : (
          ''
        )}
        {state.serverMessageEmail ? (
          <Alert severity='error'>{state.serverMessageEmail}</Alert>
        ) : (
          ''
        )}
        {state.serverMessageSimilarPassword ? (
          <Alert severity='error'>{state.serverMessageSimilarPassword}</Alert>
        ) : (
          ''
        )}
        {state.serverMessageCommonPassword ? (
          <Alert severity='error'>{state.serverMessageCommonPassword}</Alert>
        ) : (
          ''
        )}
        {state.serverMessageNumericPassword ? (
          <Alert severity='error'>{state.serverMessageNumericPassword}</Alert>
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
            onBlur={(e) =>
              dispatch({
                type: 'catchUsernameErrors',
                usernameChosen: e.target.value,
              })
            }
            error={state.usernameErrors.hasErrors}
            helperText={state.usernameErrors.errorMessage}
          />
        </Grid>
        <Grid item container className='containerItem'>
          <TextField
            id='email'
            label='Email'
            variant='outlined'
            fullWidth
            value={state.emailValue}
            onChange={(e) =>
              dispatch({
                type: 'catchEmailChange',
                emailChosen: e.target.value,
              })
            }
            onBlur={(e) =>
              dispatch({
                type: 'catchEmailErrors',
                emailChosen: e.target.value,
              })
            }
            error={state.emailErrors.hasErrors}
            helperText={state.emailErrors.errorMessage}
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
            onBlur={(e) =>
              dispatch({
                type: 'catchPasswordErrors',
                passwordChosen: e.target.value,
              })
            }
            error={state.passwordErrors.hasErrors}
            helperText={state.passwordErrors.errorMessage}
          />
        </Grid>
        <Grid item container className='containerItem'>
          <TextField
            id='password2'
            label='Confirm Password'
            variant='outlined'
            fullWidth
            type='password'
            value={state.password2Value}
            onChange={(e) =>
              dispatch({
                type: 'catchPassword2Change',
                password2Chosen: e.target.value,
              })
            }
            helperText={state.password2HelperText}
          />
        </Grid>
        <Grid item container xs={8} className='register-btn-container'>
          <Button
            variant='contained'
            fullWidth
            type='submit'
            className='register-btn'
            disabled={state.disabledBtn}
          >
            SIGN UP
          </Button>
        </Grid>
      </form>
      <Grid item container className='sign-in-container'>
        <Typography variant='small'>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className='sign-in-text'>
            SIGN IN
          </span>
        </Typography>
      </Grid>
      <Snackbar
        open={state.openSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <CustomAlert severity='success'>
          you have successfully created an account{' '}
        </CustomAlert>
      </Snackbar>
    </div>
  );
}

export default Register;
