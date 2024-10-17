import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('Welcome to My React App!');

  const handleChangeMessage = () => {
    setMessage('You clicked the button!');
  };

  return (
    <div className="App">
      <h1>{message}</h1>
      <button onClick={handleChangeMessage}>Click Me</button>
    </div>
  );
}

export default App;
