import { BrowserRouter, Route, Routes } from 'react-router-dom';

//Components
import Home from './components/Home';
import Login from './components/Login';
import Listings from './components/Listings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/login' element={<Login />} />

        <Route path='/listings' element={<Listings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
