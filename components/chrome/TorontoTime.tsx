"use client";

import type { Locale } from "@/lib/i18n";
import { TORONTO_TIME_ZONE } from "@/lib/weather";
import { useNow } from "../weather/clock";
import { useWeather } from "../weather/WeatherProvider";

const englishFormatter = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "shortOffset",
  });

const frenchDateFormatter = () =>
  new Intl.DateTimeFormat("fr-CA", { timeZone: TORONTO_TIME_ZONE, year: "numeric", month: "long", day: "numeric" });

const frenchTimeFormatter = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "shortOffset",
  });

function formatTorontoTime(now: number, locale: Locale): string {
  const date = new Date(now);
  if (locale === "fr") {
    return `${frenchDateFormatter().format(date)} à ${frenchTimeFormatter().format(date)}`;
  }
  let text = "";
  let zone = "";
  for (const part of englishFormatter().formatToParts(date)) {
    if (part.type === "timeZoneName") {
      zone = part.value;
    } else {
      text += part.value;
    }
  }
  return `${text.trimEnd()} ${zone}`;
}

/** Live Toronto date/time with the current weather icon, shown in the menu. */
export function TorontoTime({ locale }: { locale: Locale }) {
  const now = useNow();
  const { icon } = useWeather();
  return (
    <div className="data noanimation tz-single">
      <div className="tz-row">
        <ion-icon className="tz-weather-icon" name={icon}></ion-icon>
        <span className="tz-text">{now === null ? "" : formatTorontoTime(now, locale)}</span>
      </div>
    </div>
  );
}
