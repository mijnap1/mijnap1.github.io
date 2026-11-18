"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { WEATHER_REFRESH_MS, fallbackWeather, fetchTorontoWeather, type WeatherState } from "@/lib/weather";

const INITIAL_WEATHER: WeatherState = {
  condition: "clear",
  isDay: true,
  icon: "sunny-outline",
};

const WeatherContext = createContext<WeatherState>(INITIAL_WEATHER);

export function useWeather(): WeatherState {
  return useContext(WeatherContext);
}

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState(INITIAL_WEATHER);

  useEffect(() => {
    let cancelled = false;
    function refresh() {
      fetchTorontoWeather()
        .catch(fallbackWeather)
        .then((next) => {
          if (!cancelled) {
            setWeather(next);
          }
        });
    }
    refresh();
    const interval = window.setInterval(refresh, WEATHER_REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return <WeatherContext.Provider value={weather}>{children}</WeatherContext.Provider>;
}
