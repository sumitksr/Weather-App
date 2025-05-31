 # Weather App 🌤️

A modern, responsive weather application that provides real-time weather information for any location. Built with HTML, CSS, and JavaScript, this app offers a clean and intuitive user interface with smooth animations and mobile responsiveness.

## Features ✨

- Real-time weather data using OpenWeatherMap API
- Current weather conditions display
- Temperature in Celsius
- Wind speed
- Humidity levels
- Cloud coverage
- Location-based weather (using geolocation)
- Search weather for any city
- Responsive design for all devices
- Beautiful UI with smooth animations
- Error handling for invalid locations

## Live Demo 🚀

[Add your deployed site link here]

## Screenshots 📸

[Add your screenshots here]

## Prerequisites 📋

- A modern web browser
- Internet connection
- OpenWeatherMap API key

## Getting Started 🏁

### Clone the repository

```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

### Get your API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Get your API key from your account dashboard

### Setup

1. Open `script.js`
2. Replace the API_KEY constant with your OpenWeatherMap API key:
```javascript
const API_KEY = "your_api_key_here";
```

### Running the Application

1. Open `index.html` in your web browser
2. Or use a local server:
   - Using Python:
     ```bash
     # Python 3
     python -m http.server 8000
     ```
   - Using Node.js:
     ```bash
     # Install http-server globally
     npm install -g http-server
     # Run server
     http-server
     ```
3. Visit `http://localhost:8000` in your browser

## Usage 📱

1. **Your Weather Tab**
   - Click "Grant Access" to allow location access
   - View weather for your current location

2. **Search Weather Tab**
   - Enter any city name
   - Press search or hit enter
   - View weather details for the searched location

## Technologies Used 🛠️

- HTML5
- CSS3
  - Flexbox
  - CSS Variables
  - Media Queries
  - CSS Animations
- JavaScript
  - Fetch API
  - Geolocation API
  - Async/Await
  - DOM Manipulation

