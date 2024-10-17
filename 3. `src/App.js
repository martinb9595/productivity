import React from 'react';
import Popup from './components/Popup';
import Settings from './components/Settings';
import BlockedPage from './components/BlockedPage';

function App() {
  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <Popup />
      <Settings />
      <BlockedPage />
    </div>
  );
}

export default App;
