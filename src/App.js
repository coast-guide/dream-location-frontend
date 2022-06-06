import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

//Components
import Home from './components/Home';
import Login from './components/Login';
import Listings from './components/Listings';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='/login' element={<Login />} />

          <Route path='/listings' element={<Listings />} />
        </Routes>
      </BrowserRouter>
    </StyledEngineProvider>
  );
}

export default App;
