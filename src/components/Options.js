import React, { useEffect, useState } from 'react';

const Options = () => {
    const [blockedSites, setBlockedSites] = useState([]);
    const [newSite, setNewSite] = useState('');
    const [defaultFocusDuration, setDefaultFocusDuration] = useState(25);

    useEffect(() => {
        chrome.storage.sync.get(['blockedSites', 'defaultFocusDuration'], (result) => {
            setBlockedSites(result.blockedSites || []);
            setDefaultFocusDuration(result.defaultFocusDuration || 25);
        });
    }, []);

    const handleAddSite = () => {
        if (newSite) {
            const updatedSites = [...blockedSites, newSite];
            setBlockedSites(updatedSites);
            setNewSite('');
            chrome.storage.sync.set({ blockedSites: updatedSites });
        }
    };

    const handleRemoveSite = (site) => {
        const updatedSites = blockedSites.filter((s) => s !== site);
        setBlockedSites(updatedSites);
        chrome.storage.sync.set({ blockedSites: updatedSites });
    };

    const handleSaveSettings = () => {
        chrome.storage.sync.set({ defaultFocusDuration }, () => {
            alert('Settings saved successfully!');
        });
    };

    return (
        <div>
            <h2>Blocked Websites</h2>
            <ul>
                {blockedSites.map((site, index) => (
                    <li key={index}>
                        {site} <button onClick={() => handleRemoveSite(site)}>Remove</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                placeholder="Enter website to block"
            />
            <button onClick={handleAddSite}>Add Site</button>
            <h2>Default Focus Duration</h2>
            <input
                type="number"
                value={defaultFocusDuration}
                onChange={(e) => setDefaultFocusDuration(parseInt(e.target.value, 10))}
                min="1"
                max="180"
            />
            <button onClick={handleSaveSettings}>Save Settings</button>
        </div>
    );
};

export default Options;
