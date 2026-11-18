export type WeatherCondition = "clear" | "partly-cloudy" | "cloud" | "rain" | "snow" | "storm";

export type WeatherState = {
  condition: WeatherCondition;
  isDay: boolean;
  icon: string;
};

type OpenMeteoCurrent = {
  weather_code?: number;
  weathercode?: number;
  is_day?: number;
  precipitation?: number;
  rain?: number;
  showers?: number;
  snowfall?: number;
};

type OpenMeteoMinutely = Partial<Record<"precipitation" | "rain" | "showers" | "snowfall" | "weather_code", number[]>>;

type OpenMeteoResponse = {
  current?: OpenMeteoCurrent;
  current_weather?: OpenMeteoCurrent;
  minutely_15?: OpenMeteoMinutely;
};

type EnvironmentCanadaResponse = {
  properties?: {
    currentConditions?: {
      condition?: { en?: string; fr?: string };
    };
  };
};

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=43.6532&longitude=-79.3832&current=weather_code,is_day,precipitation,rain,showers,snowfall&minutely_15=precipitation,rain,showers,snowfall,weather_code&past_minutely_15=2&forecast_minutely_15=1&timezone=America%2FToronto";
const ENVIRONMENT_CANADA_URL =
  "https://api.weather.gc.ca/collections/citypageweather-realtime/items/on-128?f=json";

export const WEATHER_REFRESH_MS = 15 * 60 * 1000;
export const TORONTO_TIME_ZONE = "America/Toronto";

export function isDayInToronto(date = new Date()): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("en-CA", { timeZone: TORONTO_TIME_ZONE, hour: "numeric", hour12: false }).format(date),
  );
  return hour >= 6 && hour < 20;
}

function num(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

function hasCurrentPrecipitation(current: OpenMeteoCurrent): boolean {
  return num(current.precipitation) > 0 || num(current.rain) > 0 || num(current.showers) > 0 || num(current.snowfall) > 0;
}

function hasRainWeatherCode(code: number | null): boolean {
  return code !== null && ((code >= 51 && code <= 67) || (code >= 80 && code <= 82));
}

function hasSnowWeatherCode(code: number | null): boolean {
  return code !== null && ((code >= 71 && code <= 77) || code === 85 || code === 86);
}

function hasRecentMinutelyPrecipitation(minutely: OpenMeteoMinutely | undefined): boolean {
  if (!minutely) {
    return false;
  }
  const series = [minutely.precipitation, minutely.rain, minutely.showers, minutely.snowfall, minutely.weather_code].map(
    (values) => (Array.isArray(values) ? values : []),
  );
  const [precipitation, rain, showers, snowfall, codes] = series;
  const sampleCount = Math.max(...series.map((values) => values.length));
  for (let i = Math.max(0, sampleCount - 4); i < sampleCount; i++) {
    if (num(precipitation[i]) > 0 || num(rain[i]) > 0 || num(showers[i]) > 0 || num(snowfall[i]) > 0) {
      return true;
    }
    const code = typeof codes[i] === "number" ? codes[i] : null;
    if (hasRainWeatherCode(code) || hasSnowWeatherCode(code)) {
      return true;
    }
  }
  return false;
}

function classifyOpenMeteo(code: number | null, current: OpenMeteoCurrent, minutely?: OpenMeteoMinutely): WeatherCondition {
  if (hasCurrentPrecipitation(current) || hasRecentMinutelyPrecipitation(minutely)) {
    return num(current.snowfall) > 0 ? "snow" : "rain";
  }
  if (hasRainWeatherCode(code)) return "rain";
  if (hasSnowWeatherCode(code)) return "snow";
  if (code !== null && code >= 95 && code <= 99) return "storm";
  if (code === 3 || code === 45 || code === 48) return "cloud";
  if (code === 1 || code === 2) return "partly-cloudy";
  return "clear";
}

function classifyEnvironmentCanada(text: string): WeatherCondition | null {
  const normalized = text.toLowerCase().trim();
  if (!normalized) return null;
  const has = (...needles: string[]) => needles.some((needle) => normalized.includes(needle));
  if (has("thunder")) return "storm";
  if (has("snow", "flurr", "ice pellet", "blizzard")) return "snow";
  if (has("rain", "drizzle", "shower")) return "rain";
  if (has("fog", "mist", "cloud", "overcast")) return has("partly") ? "partly-cloudy" : "cloud";
  if (has("sun", "clear")) return has("mainly", "partly") ? "partly-cloudy" : "clear";
  return null;
}

export function iconFor(condition: WeatherCondition, isDay: boolean): string {
  switch (condition) {
    case "rain":
      return "rainy-outline";
    case "snow":
      return "snow-outline";
    case "storm":
      return "thunderstorm-outline";
    case "cloud":
      return "cloudy-outline";
    case "partly-cloudy":
      return isDay ? "partly-sunny-outline" : "cloudy-night-outline";
    default:
      return isDay ? "sunny-outline" : "moon-outline";
  }
}

export function fallbackWeather(): WeatherState {
  const isDay = isDayInToronto();
  return {
    condition: "clear",
    isDay,
    icon: iconFor("clear", isDay),
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Environment Canada's observed condition wins when available (it is what is
 * actually happening in Toronto); Open-Meteo is the fallback classifier.
 */
export async function fetchTorontoWeather(): Promise<WeatherState> {
  const [canada, openMeteo] = await Promise.all([
    fetchJson<EnvironmentCanadaResponse>(ENVIRONMENT_CANADA_URL),
    fetchJson<OpenMeteoResponse>(OPEN_METEO_URL),
  ]);

  const canadaCondition = canada?.properties?.currentConditions?.condition;
  const classified = classifyEnvironmentCanada(canadaCondition?.en || canadaCondition?.fr || "");
  if (classified) {
    const isDay = isDayInToronto();
    return { condition: classified, isDay, icon: iconFor(classified, isDay) };
  }

  const current = openMeteo ? (openMeteo.current ?? openMeteo.current_weather ?? {}) : null;
  if (current) {
    const code =
      typeof current.weather_code === "number"
        ? current.weather_code
        : typeof current.weathercode === "number"
          ? current.weathercode
          : null;
    const isDay = typeof current.is_day === "number" ? current.is_day === 1 : isDayInToronto();
    const condition = classifyOpenMeteo(code, current, openMeteo?.minutely_15);
    return { condition, isDay, icon: iconFor(condition, isDay) };
  }

  return fallbackWeather();
}
