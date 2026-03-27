(function () {
    var timeEl = document.getElementById("toronto-time");
    if (!timeEl || !window.Intl) {
        return;
    }

    var WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=43.6532&longitude=-79.3832&current=weather_code,is_day,precipitation,rain,showers,snowfall&minutely_15=precipitation,rain,showers,snowfall,weather_code&past_minutely_15=2&forecast_minutely_15=1&timezone=America%2FToronto";
    var CURRENT_CONDITIONS_URL = "https://api.weather.gc.ca/collections/citypageweather-realtime/items/on-128?f=json";
    var WEATHER_REFRESH_MS = 15 * 60 * 1000;
    var weatherIconName = "sunny-outline";
    var weatherIsDay = true;

    timeEl.classList.add("tz-single");
    timeEl.innerHTML = '<div class="tz-row"><ion-icon class="tz-weather-icon" name="sunny-outline"></ion-icon><span class="tz-text"></span></div>';

    var iconEl = timeEl.querySelector(".tz-weather-icon");
    var timeTextEl = timeEl.querySelector(".tz-text");

    function isFrenchPage() {
        return (document.documentElement.lang || "").toLowerCase().indexOf("fr") === 0;
    }

    function isDayInToronto() {
        var formatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/Toronto",
            hour: "numeric",
            hour12: false
        });
        var hour = Number(formatter.format(new Date()));
        return hour >= 6 && hour < 20;
    }

    function hasCurrentPrecipitation(current) {
        if (!current) {
            return false;
        }
        var precipitation = typeof current.precipitation === "number" ? current.precipitation : 0;
        var rain = typeof current.rain === "number" ? current.rain : 0;
        var showers = typeof current.showers === "number" ? current.showers : 0;
        var snowfall = typeof current.snowfall === "number" ? current.snowfall : 0;
        return precipitation > 0 || rain > 0 || showers > 0 || snowfall > 0;
    }

    function hasRainWeatherCode(weatherCode) {
        return (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
    }

    function hasSnowWeatherCode(weatherCode) {
        return (weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86;
    }

    function hasRecentMinutelyPrecipitation(minutely) {
        if (!minutely) {
            return false;
        }

        var precipitation = Array.isArray(minutely.precipitation) ? minutely.precipitation : [];
        var rain = Array.isArray(minutely.rain) ? minutely.rain : [];
        var showers = Array.isArray(minutely.showers) ? minutely.showers : [];
        var snowfall = Array.isArray(minutely.snowfall) ? minutely.snowfall : [];
        var weatherCodes = Array.isArray(minutely.weather_code) ? minutely.weather_code : [];
        var sampleCount = Math.max(precipitation.length, rain.length, showers.length, snowfall.length, weatherCodes.length);
        var recentSamples = Math.min(sampleCount, 4);

        for (var i = sampleCount - recentSamples; i < sampleCount; i++) {
            if (i < 0) {
                continue;
            }

            var precipValue = typeof precipitation[i] === "number" ? precipitation[i] : 0;
            var rainValue = typeof rain[i] === "number" ? rain[i] : 0;
            var showerValue = typeof showers[i] === "number" ? showers[i] : 0;
            var snowfallValue = typeof snowfall[i] === "number" ? snowfall[i] : 0;
            var weatherCode = typeof weatherCodes[i] === "number" ? weatherCodes[i] : null;

            if (precipValue > 0 || rainValue > 0 || showerValue > 0 || snowfallValue > 0) {
                return true;
            }

            if (weatherCode !== null && (hasRainWeatherCode(weatherCode) || hasSnowWeatherCode(weatherCode))) {
                return true;
            }
        }

        return false;
    }

    function normalizeConditionText(value) {
        return typeof value === "string" ? value.toLowerCase().trim() : "";
    }

    function classifyEnvironmentCanadaCondition(text) {
        var normalized = normalizeConditionText(text);
        if (!normalized) {
            return null;
        }

        if (normalized.indexOf("thunder") !== -1) {
            return "storm";
        }
        if (
            normalized.indexOf("snow") !== -1 ||
            normalized.indexOf("flurr") !== -1 ||
            normalized.indexOf("ice pellet") !== -1 ||
            normalized.indexOf("blizzard") !== -1
        ) {
            return "snow";
        }
        if (
            normalized.indexOf("rain") !== -1 ||
            normalized.indexOf("drizzle") !== -1 ||
            normalized.indexOf("shower") !== -1
        ) {
            return "rain";
        }
        if (
            normalized.indexOf("fog") !== -1 ||
            normalized.indexOf("mist") !== -1 ||
            normalized.indexOf("cloud") !== -1 ||
            normalized.indexOf("overcast") !== -1
        ) {
            return normalized.indexOf("partly") !== -1 ? "partly-cloudy" : "cloud";
        }
        if (
            normalized.indexOf("sun") !== -1 ||
            normalized.indexOf("clear") !== -1
        ) {
            return normalized.indexOf("mainly") !== -1 || normalized.indexOf("partly") !== -1 ? "partly-cloudy" : "clear";
        }

        return null;
    }

    function pickConditionIcon(condition, isDay) {
        if (condition === "rain") {
            return "rainy-outline";
        }
        if (condition === "snow") {
            return "snow-outline";
        }
        if (condition === "storm") {
            return "thunderstorm-outline";
        }
        if (condition === "cloud") {
            return "cloudy-outline";
        }
        if (condition === "partly-cloudy") {
            return isDay ? "partly-sunny-outline" : "cloudy-night-outline";
        }
        return isDay ? "sunny-outline" : "moon-outline";
    }

    function pickWeatherIcon(weatherCode, isDay, current, minutely) {
        if (hasCurrentPrecipitation(current) || hasRecentMinutelyPrecipitation(minutely)) {
            return typeof current.snowfall === "number" && current.snowfall > 0 ? "snow-outline" : "rainy-outline";
        }
        if (weatherCode === 0) {
            return isDay ? "sunny-outline" : "moon-outline";
        }
        if (weatherCode === 1 || weatherCode === 2) {
            return isDay ? "partly-sunny-outline" : "cloudy-night-outline";
        }
        if (weatherCode === 3 || weatherCode === 45 || weatherCode === 48) {
            return "cloudy-outline";
        }
        if (hasRainWeatherCode(weatherCode)) {
            return "rainy-outline";
        }
        if (hasSnowWeatherCode(weatherCode)) {
            return "snow-outline";
        }
        if (weatherCode >= 95 && weatherCode <= 99) {
            return "thunderstorm-outline";
        }
        return isDay ? "sunny-outline" : "moon-outline";
    }

    function classifyWeather(weatherCode, current, minutely) {
        if (hasCurrentPrecipitation(current) || hasRecentMinutelyPrecipitation(minutely)) {
            return typeof current.snowfall === "number" && current.snowfall > 0 ? "snow" : "rain";
        }
        if (hasRainWeatherCode(weatherCode)) {
            return "rain";
        }
        if (hasSnowWeatherCode(weatherCode)) {
            return "snow";
        }
        if (weatherCode >= 95 && weatherCode <= 99) {
            return "storm";
        }
        if (weatherCode === 3 || weatherCode === 45 || weatherCode === 48) {
            return "cloud";
        }
        if (weatherCode === 1 || weatherCode === 2) {
            return "partly-cloudy";
        }
        return "clear";
    }

    function publishWeatherState(condition, isDay, weatherCode, source) {
        document.documentElement.setAttribute("data-toronto-weather", condition);
        document.documentElement.setAttribute("data-toronto-is-day", isDay ? "true" : "false");
        document.dispatchEvent(new CustomEvent("toronto-weather-change", {
            detail: {
                condition: condition,
                isDay: isDay,
                weatherCode: weatherCode,
                source: source || "unknown"
            }
        }));
    }

    function renderTime() {
        var locale = isFrenchPage() ? "fr-CA" : "en-CA";
        var formatter = new Intl.DateTimeFormat(locale, {
            timeZone: "America/Toronto",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZoneName: "shortOffset"
        });
        var parts = formatter.formatToParts(new Date());
        var timeText = "";
        var tzText = "";
        for (var i = 0; i < parts.length; i++) {
            if (parts[i].type === "timeZoneName") {
                tzText = parts[i].value;
            } else {
                timeText += parts[i].value;
            }
        }
        timeText = timeText.replace(/\s+$/, "");
        if (timeTextEl) {
            timeTextEl.textContent = timeText + " " + tzText;
        }
        if (iconEl) {
            iconEl.setAttribute("name", weatherIconName || (weatherIsDay ? "sunny-outline" : "moon-outline"));
        }
    }

    function applyWeather(current, minutely) {
        var weatherCode = current && typeof current.weather_code === "number" ? current.weather_code : current && typeof current.weathercode === "number" ? current.weathercode : null;
        var isDay = current && typeof current.is_day === "number" ? current.is_day === 1 : isDayInToronto();
        var condition = classifyWeather(weatherCode, current, minutely);
        weatherIsDay = isDay;
        weatherIconName = pickWeatherIcon(weatherCode, isDay, current, minutely);
        publishWeatherState(condition, isDay, weatherCode, "open-meteo");
        renderTime();
    }

    function applyCurrentConditions(data) {
        var properties = data && data.properties ? data.properties : null;
        var currentConditions = properties && properties.currentConditions ? properties.currentConditions : null;
        var conditionText = currentConditions && currentConditions.condition ? currentConditions.condition.en || currentConditions.condition.fr : "";
        var condition = classifyEnvironmentCanadaCondition(conditionText);
        var isDay = isDayInToronto();

        if (!condition) {
            return false;
        }

        weatherIsDay = isDay;
        weatherIconName = pickConditionIcon(condition, isDay);
        publishWeatherState(condition, isDay, null, "environment-canada");
        renderTime();
        return true;
    }

    function fetchWeather() {
        if (!window.fetch) {
            renderTime();
            return;
        }
        var currentConditionsRequest = window.fetch(CURRENT_CONDITIONS_URL, {
            cache: "no-store"
        }).then(function (response) {
            return response.ok ? response.json() : null;
        }).catch(function () {
            return null;
        });
        var openMeteoRequest = window.fetch(WEATHER_URL, {
            cache: "no-store"
        }).then(function (response) {
            return response.ok ? response.json() : null;
        }).catch(function () {
            return null;
        });

        window.Promise.all([currentConditionsRequest, openMeteoRequest]).then(function (results) {
            var currentConditionsData = results[0];
            var openMeteoData = results[1];

            if (applyCurrentConditions(currentConditionsData)) {
                return;
            }

            if (openMeteoData) {
                var current = openMeteoData.current || openMeteoData.current_weather || {};
                var minutely = openMeteoData.minutely_15 || {};
                applyWeather(current, minutely);
                return;
            }

            applyWeather({
                is_day: isDayInToronto() ? 1 : 0
            }, null);
        }).catch(function () {
            applyWeather({
                is_day: isDayInToronto() ? 1 : 0
            }, null);
        });
    }

    renderTime();
    fetchWeather();
    window.setInterval(renderTime, 1000);
    window.setInterval(fetchWeather, WEATHER_REFRESH_MS);
})();
