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
        <div className="text-center mt-12">
            <h1 className="text-3xl font-bold mb-4">Greeting App</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input 
                    type="text" 
                    value={name} 
                    onChange={handleChange} 
                    placeholder="Enter your name" 
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-1/2"
                />
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">Greet</button>
            </form>
        </div>
    );
};

export default App;
