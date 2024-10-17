import React, { useState } from 'react';

const App = () => {
    const [name, setName] = useState('');

    const handleChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`Hey ${name}`);
    };

    return (
        <div>
            <h1>Greeting App</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={name} 
                    onChange={handleChange} 
                    placeholder="Enter your name" 
                />
                <button type="submit">Greet</button>
            </form>
        </div>
    );
};

export default App;
