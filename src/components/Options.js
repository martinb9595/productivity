import React, { useEffect, useState } from 'react';

const Options = () => {
    const [blockedSites, setBlockedSites] = useState([]);
    const [newSite, setNewSite] = useState('');
    const [defaultFocusDuration, setDefaultFocusDuration] = useState(25);

    useEffect(() => {
        const fetchSettings = async () => {
            const result = await chrome.storage.sync.get(['blockedSites', 'defaultFocusDuration']);
            setBlockedSites(result.blockedSites || []);
            setDefaultFocusDuration(result.defaultFocusDuration || 25);
        };
        fetchSettings();
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
        <div className="p-4">
            <h2 className="text-xl font-semibold">Blocked Websites</h2>
            <ul className="list-disc pl-5 mb-4">
                {blockedSites.map((site, index) => (
                    <li key={index} className="flex justify-between items-center">
                        {site} <button onClick={() => handleRemoveSite(site)} className="ml-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">Remove</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                placeholder="Enter website to block"
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />
            <button onClick={handleAddSite} className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Add Site</button>
            <h2 className="text-xl font-semibold mt-4">Default Focus Duration</h2>
            <input
                type="number"
                value={defaultFocusDuration}
                onChange={(e) => setDefaultFocusDuration(parseInt(e.target.value, 10))}
                min="1"
                max="180"
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />
            <button onClick={handleSaveSettings} className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">Save Settings</button>
        </div>
    );
};

export default Options;
