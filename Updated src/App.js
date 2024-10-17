import React from 'react';
import Popup from './components/Popup';
import Blocked from './components/Blocked';
import Settings from './components/Settings';
import Options from './components/Options';

const App = () => {
    return (
        <div>
            <Popup />
            <Blocked />
            <Settings />
            <Options />
        </div>
    );
};

export default App;
