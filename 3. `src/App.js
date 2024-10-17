import React from 'react';
import Popup from './components/Popup';
import Settings from './components/Settings';
import BlockedPage from './components/BlockedPage';

function App() {
    return (
        <div className="App">
            <Popup />
            <Settings />
            <BlockedPage />
        </div>
    );
}

export default App;
