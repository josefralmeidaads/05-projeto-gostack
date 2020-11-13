import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GLobalStyles from './styles/global';
import Routes from './routes';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes />  
      </BrowserRouter>
      <GLobalStyles />
    </>
  );
}

export default App;
