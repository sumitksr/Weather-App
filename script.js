// ─── Your OpenWeatherMap API Key ─────────────────────────────────────────────
const API_KEY = "3ead8920ad761e54c2c1a9434e95a4bd";

// ─── Element References ───────────────────────────────────────────────────────
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchForm = document.querySelector("[data-searchForm]");
const userInfoContainer = document.querySelector(".userInfoContainer");
const grantAccessContainer = document.querySelector(".grantLocationContainer");
const loadingContainer = document.querySelector(".loadingContainer");
const notFound = document.querySelector(".errorContainer");
const errorBtn = document.querySelector("[data-errorButton]");
const errorText = document.querySelector("[data-errorText]");
const errorImage = document.querySelector("[data-errorImg]");

let currentTab = userTab;
currentTab.classList.add("currentTab");

// On page load, try reading coordinates from sessionStorage:
getFromSessionStorage();

// ─── Tab Switching Logic ─────────────────────────────────────────────────────
function switchTab(newTab) {
  notFound.classList.remove("active");

  if (currentTab !== newTab) {
    currentTab.classList.remove("currentTab");
    currentTab = newTab;
    currentTab.classList.add("currentTab");

    // If we switched to Search Tab:
    if (!searchForm.classList.contains("active")) {
      searchForm.classList.add("active");
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
    }
    // If we switched back to "Your Weather" Tab:
    else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => switchTab(userTab));
searchTab.addEventListener("click", () => switchTab(searchTab));

// ─── Session Storage / Geolocation ────────────────────────────────────────────
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("userCoordinates");
  if (!localCoordinates) {
    // No coords in sessionStorage → ask for grant access
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchWeatherInfo(coordinates);
  }
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // If browser doesn’t support geolocation:
    grantAccessButton.style.display = "none";
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
  fetchWeatherInfo(userCoordinates);
}

// ─── Fetch Current (Geolocation) Weather ─────────────────────────────────────
async function fetchWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;

  // Hide grant access UI, show loading
  grantAccessContainer.classList.remove("active");
  loadingContainer.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (!data.sys) {
      throw data;
    }

    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingContainer.classList.remove("active");
    notFound.classList.add("active");
    errorImage.style.display = "none";
    errorText.innerText = `Error: ${err?.message}`;
    errorBtn.style.display = "block";
    errorBtn.addEventListener("click", () => fetchWeatherInfo(coordinates));
  }
}

// ─── Fetch Searched City Weather ──────────────────────────────────────────────
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value.trim() === "") return;
  fetchSearchWeatherInfo(searchInput.value.trim());
  searchInput.value = "";
});

async function fetchSearchWeatherInfo(city) {
  loadingContainer.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  notFound.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    if (!data.sys) {
      throw data;
    }
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    notFound.classList.add("active");
    errorText.innerText = `${err?.message}`;
    errorBtn.style.display = "none";
  }
}

// ─── Render Fetched Weather into UI ──────────────────────────────────────────
function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityName]");
  const countryFlag = document.querySelector("[data-countryFlag]");
  const description = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-clouds]");

  cityName.innerText = weatherInfo?.name;
  countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  description.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
  clouds.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;

  // Update theme + rain animation based on condition
  updateTheme(weatherInfo);
}

// ─── Update Theme (and trigger Rain) ─────────────────────────────────────────
function updateTheme(weatherInfo) {
  const wrapper = document.querySelector(".wrapper");
  const rainContainer = document.querySelector(".rain-container");
  const weatherCode = weatherInfo?.weather?.[0]?.id;
  const isNight = isNightTime(weatherInfo);

  // Remove all weather‐related classes & clear old raindrops
  wrapper.classList.remove("rainy", "sunny", "cloudy", "night");
  rainContainer.innerHTML = "";

  // 1) If code is 200–599 → Rain/Drizzle/Thunderstorm → always show rain
  if (weatherCode >= 200 && weatherCode < 600) {
    // 1a) Add the rainy palette
    wrapper.classList.add("rainy");

    // 1b) Generate raindrops
    generateRainDrops(rainContainer, 100);

    // 1c) If it’s also night, add the night tint on top of rainy
    if (isNight) {
      wrapper.classList.add("night");
    }
    return;
  }

  // 2) Not raining: if it’s purely night, show night theme
  if (isNight) {
    wrapper.classList.add("night");
    return;
  }

  // 3) Daytime, not rain:
  if (weatherCode >= 600 && weatherCode < 700) {
    // Snow → use “cloudy” palette (you could swap for a snowy palette)
    wrapper.classList.add("cloudy");
  } else if (weatherCode >= 700 && weatherCode < 800) {
    // Atmosphere (mist, haze) → cloudy
    wrapper.classList.add("cloudy");
  } else if (weatherCode === 800) {
    // Clear Sky → sunny
    wrapper.classList.add("sunny");
  } else if (weatherCode > 800) {
    // Clouds → cloudy
    wrapper.classList.add("cloudy");
  }
}

// Determines if it’s currently night (before sunrise or after sunset)
function isNightTime(weatherInfo) {
  const now = Date.now() / 1000;
  const sunrise = weatherInfo?.sys?.sunrise;
  const sunset = weatherInfo?.sys?.sunset;
  return now < sunrise || now > sunset;
}

// Create multiple raindrops inside .rain-container
function generateRainDrops(container, count) {
  for (let i = 0; i < count; i++) {
    const drop = document.createElement("div");
    drop.classList.add("raindrop");
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${0.5 + Math.random()}s`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
    drop.style.opacity = `${0.3 + Math.random() * 0.7}`;
    container.appendChild(drop);
  }
}
