import React, { useEffect, useState } from 'react';
import { formatTimeRemaining } from './utils/timerUtils';

const Settings = () => {
    const [blockedSites, setBlockedSites] = useState([]);
    const [newSite, setNewSite] = useState('');
    const [defaultFocusDuration, setDefaultFocusDuration] = useState(25);
    const [focusStatus, setFocusStatus] = useState('Focus mode is not running.');
    const [timeRemaining, setTimeRemaining] = useState('00:00');

    useEffect(() => {
        chrome.storage.sync.get(['blockedSites', 'defaultFocusDuration'], (result) => {
            setBlockedSites(result.blockedSites || []);
            setDefaultFocusDuration(result.defaultFocusDuration || 25);
        });

        const updateFocusStatus = () => {
            chrome.storage.local.get(["isInFocusMode", "focusEndTime"], ({ isInFocusMode, focusEndTime }) => {
                const timeLeft = isInFocusMode && focusEndTime ? Math.max(0, Math.floor((focusEndTime - Date.now()) / 1000)) : 0;
                setTimeRemaining(formatTimeRemaining(timeLeft));
                setFocusStatus(timeLeft > 0 ? `Focus mode is running... Time left: ${formatTimeRemaining(timeLeft)}` : "Focus mode is not running.");
            });
        };

        const intervalId = setInterval(updateFocusStatus, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleAddSite = () => {
        if (newSite) {
            setBlockedSites([...blockedSites, newSite]);
            setNewSite('');
            saveBlockedSites([...blockedSites, newSite]);
        }
    };

    const saveBlockedSites = (sites) => {
        chrome.storage.sync.set({ blockedSites: sites });
    };

    const handleSaveSettings = () => {
        const settings = {
            defaultFocusDuration,
            blockedSites
        };
        chrome.storage.sync.set(settings, () => {
            alert('Settings saved successfully!');
        });
    };

    return (
        <main className="bg-gray-100 flex justify-center items-center h-screen" style={{ backgroundColor: '#e4eaf1' }}>
            <div className="container rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Focus Mode Options</h1>
                <div id="blockedSites">
                    <h2 className="text-xl font-semibold">Blocked Websites</h2>
                    <ul className="list-disc pl-5 mb-4">
                        {blockedSites.map((site, index) => (
                            <li key={index}>
                                {site} <button onClick={() => {
                                    const updatedSites = blockedSites.filter((s) => s !== site);
                                    setBlockedSites(updatedSites);
                                    saveBlockedSites(updatedSites);
                                }} className="ml-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">Remove</button>
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
                </div>
                <div id="defaultSettings" className="mt-4">
                    <h2 className="text-xl font-semibold">Default Settings</h2>
                    <label htmlFor="defaultFocusDuration" className="block">Default Focus Duration (minutes):</label>
                    <input
                        type="number"
                        value={defaultFocusDuration}
                        onChange={(e) => setDefaultFocusDuration(parseInt(e.target.value, 10))}
                        min="1"
                        max="180"
                        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                    />
                </div>
                <div id="focusStatus" role="status" aria-live="polite" className="mt-4 text-center">
                    <p id="focusModeStatus">{focusStatus} Time left: <span id="timeRemaining">{timeRemaining}</span></p>
                </div>
                <div className="space-y-4 flex justify-center">
                    <button onClick={handleSaveSettings} className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">Save Settings</button>
                    <button onClick={() => {
                        chrome.runtime.sendMessage({ action: "endFocusMode" }, (response) => {
                            if (response && response.success) {
                                setFocusStatus("Focus mode is not running.");
                            }
                        });
                    }} className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">Stop Focus Mode</button>
                </div>
            </div>
        </main>
    );
};

export default Settings;
