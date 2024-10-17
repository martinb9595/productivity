import React, { useEffect, useState } from 'react';

const Settings = () => {
  const [blockedSites, setBlockedSites] = useState([]);
  const [newSite, setNewSite] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      if (result.blockedSites) {
        setBlockedSites(result.blockedSites);
      }
    });
  }, []);

  const addSite = () => {
    if (newSite) {
      const updatedSites = [...blockedSites, newSite];
      setBlockedSites(updatedSites);
      chrome.storage.sync.set({ blockedSites: updatedSites });
      setNewSite('');
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      <input
        type="text"
        value={newSite}
        onChange={(e) => setNewSite(e.target.value)}
        placeholder="Enter website to block"
      />
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
