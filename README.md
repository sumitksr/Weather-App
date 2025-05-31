# Weather App 🌤️

A modern, responsive weather application that provides real-time weather information for any location. Built with HTML, CSS, and JavaScript, this app offers a clean and intuitive user interface with smooth animations, dynamic backgrounds, and a rain‐effect overlay when it's raining. Mobile‐friendly and visually engaging, it adjusts its theme to reflect current conditions: sunny, cloudy, rainy, or night.

---

## Features ✨

- **Real‐time weather data** using OpenWeatherMap API  
- **Current weather conditions** display (city name, temperature, description, icon)  
- **Temperature in Celsius**  
- **Wind speed**, **humidity**, and **cloud coverage**  
- **Location‐based weather** (using the Geolocation API)  
- **Search weather for any city**  
- **Dynamic background** that changes based on weather codes:  
  - Clear → Sunny gradient  
  - Clouds/Mist/Snow → Cloudy gradient  
  - Rain/Drizzle/Thunderstorm → Rainy gradient + rain animation overlay  
  - Nighttime (before sunrise/after sunset) → Night gradient overlay (still shows rain if applicable)  
- **Rain animation overlay**: dozens of falling raindrops whenever the condition is "rainy"  
- **Smooth transitions** between themes (0.5s ease‐in‐out)  
- **Error handling** for invalid city names, API failures, or denied location access  
- **Responsive design** for all screen sizes (desktop, tablet, mobile)  

---

## Live Demo 🚀

[Weather App Live Demo](https://weather-app-alpha-azure.vercel.app/)

---

## Screenshots 📸

<p align="center">
  <img src="https://github.com/user-attachments/assets/b6f1a488-4f0e-422c-8f82-30b17cb43884" alt="Screenshot: Sunny Theme" width="600" /><br /><em>Sunny background with clear‐sky gradient</em>
  <br /><br />
  <img src="https://github.com/user-attachments/assets/7cd17bf5-54b1-4fe5-bcd6-dc93b6c8d1db" alt="Screenshot: Rainy Theme" width="600" /><br /><em>Rainy background + rain overlay animation</em>
</p>

---

## Prerequisites 📋

- A modern web browser (Chrome, Firefox, Safari, Edge, etc.)  
- Internet connection  
- OpenWeatherMap API key (free)  

---

## Getting Started 🏁

### 1. Clone the repository

```bash
git clone https://github.com/sumitksr/weather-app.git
cd weather-app
```

### 2. Get your API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account (if you don't already have one)
3. Obtain your API key from the "API Keys" section of your OpenWeatherMap dashboard

### 3. Configure the API Key

1. Open `script.js` in your code editor.
2. Locate the line:

   ```js
   const API_KEY = "YOUR_API_KEY_HERE";
   ```
3. Replace `"YOUR_API_KEY_HERE"` with your actual OpenWeatherMap API key. For example:

   ```js
   const API_KEY = "3ead8920ad761e54c2c1a9434e95a4bd";
   ```

---

## Running the Application

You can open `index.html` directly in your browser, or serve it via a simple HTTP server:

#### Option A: Directly in Browser

* Double‐click `index.html` to open it (some browsers restrict the Geolocation API on "file://" pages—if you notice location failing, use Option B).

#### Option B: Using a Local Server

* **Python 3**:

  ```bash
  # From inside the project folder:
  python -m http.server 8000
  # Then navigate to http://localhost:8000
  ```
* **Node.js (http-server)**:

  ```bash
  # Install http-server globally (if not installed):
  npm install -g http-server

  # From inside the project folder:
  http-server
  # Then navigate to http://localhost:8080 (or whatever port it prints)
  ```

---

## Usage 📱

1. **Your Weather Tab**

   * On first load, the "Your Weather" tab is active.
   * Click "Grant Access" to allow the browser to share your location.
   * The app will fetch your latitude/longitude and display local weather.
   * If it's raining at your location → you'll see a dark "rainy" gradient + falling raindrops.
   * If it's clear daytime → you'll see a bright "sunny" gradient.
   * If it's cloudy daytime → you'll see a dark‐cloud gradient.
   * If it's night → you'll see a moonlit "night" gradient (rain still overlays if applicable).

2. **Search Weather Tab**

   * Click "Search Weather" to switch to search mode.
   * Enter any valid city name (e.g. "London", "New York", "Tokyo").
   * Press Enter or click the search icon.
   * The app fetches weather for the typed city.
   * Dynamic background + rain animation appear based on that city's weather code.

3. **Error Handling**

   * If you type an invalid city name, an error message will display.
   * If you click "Retry Now," it will let you search again.

---

## Technologies Used 🛠️

* **HTML5**
* **CSS3**

  * CSS Variables (for dynamic theming)
  * Flexbox (layout & centering)
  * Media Queries (responsive breakpoints)
  * CSS Animations (`@keyframes fall`, transition effects)
* **JavaScript (ES6)**

  * Fetch API (for OpenWeatherMap requests)
  * Geolocation API (to detect user's coordinates)
  * Async/Await (for cleaner asynchronous code)
  * DOM Manipulation (to update UI, add/remove classes & raindrops)

---

## File Structure 📂

```
weather-app/
│
├─ index.html          # Main HTML layout
├─ style.css           # Entire stylesheet (themes, layout, rain animation)
├─ script.js           # JS logic (tabs, fetch, render, dynamic backgrounds, rain overlay)
└─ Images/             # Icons & placeholder images
   ├─ search.png
   ├─ location.png
   ├─ loading.gif
   ├─ wind.png
   ├─ humidity.png
   ├─ cloud.png
   └─ not-found.png
```

---

## How It Works (Brief) ⚙️

1. **Initial Load**

   * JavaScript looks for `sessionStorage.userCoordinates`.
   * If missing → show "Grant Location Access" UI.

2. **Grant Location Access**

   * User clicks "Grant Access."
   * Browser prompts for geolocation permission.
   * On success, coordinates are saved to `sessionStorage` and `fetchWeatherInfo()` is called.

3. **fetchWeatherInfo(coordinates)**

   * Calls OpenWeatherMap's "weather" endpoint with `lat`, `lon`, and `units=metric`.
   * Parses JSON → stores result in `weatherInfo`.

4. **renderWeatherInfo(weatherInfo)**

   * Updates city name, flag, description, icon, temperature, windspeed, humidity, and cloud % in the DOM.
   * Invokes `updateTheme(weatherInfo)`.

5. **updateTheme(weatherInfo)**

   * Reads `weatherInfo.weather[0].id` (weather code) and checks `isNightTime(weatherInfo)`.
   * **If 200 ≤ code < 600** → apply `.wrapper.rainy`, generate 100 raindrops in `.rain-container`.

     * If also night → add `.night` on top of `.rainy`.
   * **Else if night** → apply `.wrapper.night` (moonlit gradient).
   * **Else if 600 ≤ code < 700** (snow) → apply `.wrapper.cloudy`.
   * **Else if 700 ≤ code < 800** (mist/fog) → apply `.wrapper.cloudy`.
   * **Else if code == 800** (clear sky) → apply `.wrapper.sunny`.
   * **Else if code > 800** (clouds) → apply `.wrapper.cloudy`.

6. **Rain Animation**

   * Whenever `.wrapper.rainy` is set, `generateRainDrops(container, 100)` spawns 100 `<div class="raindrop">` elements.
   * `.raindrop` uses CSS `@keyframes fall` to animate from top: `transform: translateY(0)` → bottom: `transform: translateY(100vh)` over a random duration (0.5–1.5s) and random delay (0–2s).
   * Each drop's `opacity` is randomized to look more natural.

---

## Customization & Tips 🎨

* **Adjust Rain Intensity**

  * In `script.js`, change `generateRainDrops(container, 100)` → use larger/smaller count (e.g. `200` for heavier rain, `50` for lighter drizzle).
* **Modify Theme Colors**

  * In `style.css`, tweak any `--gradientStart`, `--gradientEnd`, or overlay RGBA values to suit your brand or mood.
* **Add New Weather Effects**

  * For snow: copy the rain‐generation logic, but use a larger white circle with a slower "fall" animation.
  * For thunderstorms: add a quick "flash" overlay (white rectangle with short opacity).

---

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it.

---

> **Enjoy your dynamic, rain‐enabled Weather App!** 🌧️☀️🌙 
