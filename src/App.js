import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';

// MUI imports
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

//Components
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Listings from './components/Listings';
import Register from './components/Register';
import AddProperty from './components/AddProperty';
import Profile from './components/Profile';
import Agencies from './components/Agencies';
import AgencyDetail from './components/AgencyDetail';

//Contexts
import DispatchContext from './Contexts/DispatchContext';
import StateContext from './Contexts/StateContext';

function App() {
  const initialState = {
    userUserName: localStorage.getItem('theUserUserName'),
    userEmail: localStorage.getItem('theUserEmail'),
    userId: localStorage.getItem('theUserId'),
    userToken: localStorage.getItem('theUserToken'),
    userIsLogged: localStorage.getItem('theUserUserName') ? true : false,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'catchToken':
        draft.userToken = action.tokenValue;
        break;
      case 'userSignsIn':
        draft.userUserName = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId = action.IdInfo;
        draft.userIsLogged = true;
        break;

      case 'logout':
        draft.userIsLogged = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  useEffect(() => {
    if (state.userIsLogged) {
      localStorage.setItem('theUserUserName', state.userUserName);
      localStorage.setItem('theUserEmail', state.userEmail);
      localStorage.setItem('theUserId', state.userId);
      localStorage.setItem('theUserToken', state.userToken);
    } else {
      localStorage.removeItem('theUserUserName');
      localStorage.removeItem('theUserEmail');
      localStorage.removeItem('theUserId');
      localStorage.removeItem('theUserToken');
    }
  }, [state.userIsLogged]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
            <CssBaseline />
            <Header />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/addProperty' element={<AddProperty />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/agencies/:id' element={<AgencyDetail />} />
              <Route path='/agencies' element={<Agencies />} />
              <Route path='/listings' element={<Listings />} />
            </Routes>
          </BrowserRouter>
        </StyledEngineProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
