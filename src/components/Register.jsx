import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';

// MUI
import { Grid, Typography, Button, TextField } from '@mui/material';

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
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'catchUsernameChange':
        draft.usernameValue = action.usernameChosen;
        break;
      case 'catchEmailChange':
        draft.emailValue = action.emailChosen;
        break;
      case 'catchPasswordChange':
        draft.passwordValue = action.passwordChosen;
        break;
      case 'catchPassword2Change':
        draft.password2Value = action.password2Chosen;
        break;
      case 'changeSendRequest':
        draft.sendRequest = draft.sendRequest + 1;
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
          navigate('/');
        } catch (error) {
          console.log(error.response);
        }
      }
      signUp();

      return () => source.cancel();
    }
  }, [state.sendRequest]);
  return (
    <div className='formContainer'>
      <form onSubmit={formSubmitHandler}>
        <Grid item container className='formHeader'>
          <Typography variant='h4'>CREATE AN ACCOUNT</Typography>
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
          />
        </Grid>
        <Grid item container xs={8} className='register-btn-container'>
          <Button
            variant='contained'
            fullWidth
            type='submit'
            className='register-btn'
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
    </div>
  );
}

export default Register;
