import React, { useState, useEffect } from 'react';
import './settings.css';

// A function to apply theme and save to localStorage
const setTheme = (theme) => {
  document.body.className = theme;
  localStorage.setItem('theme', theme);
};

// A function to save settings to localStorage
const saveSettingsToLocalStorage = (settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

// A simple Settings Component with theme toggle
const Settings = () => {
  const [theme, setThemeState] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedSettings) {
      const { theme, notifications, language } = JSON.parse(savedSettings);
      setThemeState(theme || 'light');
      setNotifications(notifications ?? true);
      setLanguage(language || 'en');
      setTheme(theme || 'light');
    } else {
      setThemeState(savedTheme || 'light');
      setTheme(savedTheme || 'light');
    }
  }, []);

  // Handle theme change
  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    setTheme(newTheme);
  };

  // Handle notification toggle
  const handleNotificationsChange = () => {
    setNotifications(!notifications);
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Handle save settings
  const handleSaveSettings = () => {
    const settings = {
      theme,
      notifications,
      language
    };
    saveSettingsToLocalStorage(settings);
    alert("Settings Saved!");
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <div className="setting-item">
        <label htmlFor="theme-toggle">Theme</label>
        <div
          id="theme-toggle"
          onClick={handleThemeChange}
          className="theme-toggle-icons"
        >
          {theme === 'light' ? (
            <i className="fas fa-sun light-icon"></i> // Sun icon for light theme
          ) : (
            <i className="fas fa-moon dark-icon"></i> // Moon icon for dark theme
          )}
        </div>
      </div>

      <div className="setting-item">
        <label htmlFor="notifications-toggle">Notifications</label>
        <input
          type="checkbox"
          id="notifications-toggle"
          checked={notifications}
          onChange={handleNotificationsChange}
        />
        <span>{notifications ? 'Enabled' : 'Disabled'}</span>
      </div>

      <div className="setting-item">
        <label htmlFor="language-select">Language</label>
        <select
          id="language-select"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          {/* Add more language options as needed */}
        </select>
      </div>

      <div className="setting-item">
        <button className="save-button" onClick={handleSaveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
