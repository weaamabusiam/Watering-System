import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        // Example coordinates (Tel Aviv)
        const latitude = 32.0853;
        const longitude = 34.7818;
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto`
        );
        // The daily forecast data is in response.data.daily.
        setForecast(response.data.daily);
      } catch (error) {
        console.error("Error fetching weather forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  if (loading) {
    return <p>טוען תחזית מזג אוויר...</p>;
  }

  return (
    <div className="weather-widget">
      <h4>תחזית מזג אוויר לשבוע הבא</h4>
      {forecast && forecast.time && (
        <ul>
          {forecast.time.map((date, index) => (
            <li key={index}>
              <strong>{new Date(date).toLocaleDateString("he-IL")}</strong>:{" "}
              {forecast.temperature_2m_max[index]}°C / {forecast.temperature_2m_min[index]}°C , 🌧️ {forecast.precipitation_probability_max[index]}% 🌡️
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeatherWidget;
