import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [blockedSites, setBlockedSites] = useState([]);
    const [newSite, setNewSite] = useState('');

    const addSite = () => {
        if (newSite) {
            setBlockedSites([...blockedSites, newSite]);
            setNewSite('');
        }
    };

    return (
        <div>
            <h2>Settings</h2>
            <input value={newSite} onChange={(e) => setNewSite(e.target.value)} placeholder="Enter website to block" />
            <button onClick={addSite}>Add Site</button>
            <ul>
                {blockedSites.map((site, index) => (
                    <li key={index}>{site}</li>
                ))}
            </ul>
        </div>
    );
};

export default Settings;
