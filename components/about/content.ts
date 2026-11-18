import type { Locale } from "@/lib/i18n";


export type ExperienceFolder = {
  location: string;
  label: Record<Locale, string>;
  /** Short name used in image alt text. */
  shortName: Record<Locale, string>;
  tilt: "tilt-left" | "tilt-center" | "tilt-right";
  photos: string[];
};

export const EXPERIENCE_FOLDERS: ExperienceFolder[] = [
  {
    location: "la",
    label: { en: "Los Angeles", fr: "Los Angeles" },
    shortName: { en: "LA", fr: "LA" },
    tilt: "tilt-left",
    photos: ["la1.jpg", "la2.jpg", "la3.png", "la4.png", "la5.jpg", "la6.jpg", "la7.jpg"],
  },
  {
    location: "cn",
    label: { en: "Canada", fr: "Canada" },
    shortName: { en: "Canada", fr: "Canada" },
    tilt: "tilt-center",
    photos: ["cn1.jpg", "cn2.jpg", "cn3.jpg", "cn4.jpg", "cn5.jpg", "cn6.jpg", "cn7.jpg", "cn8.jpg", "cn9.jpg"],
  },
  {
    location: "sg",
    label: { en: "Singapore", fr: "Singapour" },
    shortName: { en: "Singapore", fr: "Singapour" },
    tilt: "tilt-right",
    photos: [
      "sg1.jpg",
      "sg2.jpg",
      "sg3.jpg",
      "sg4.png",
      "sg5.png",
      "sg6.png",
      "sg7.jpg",
      "sg8.jpg",
      "sg9.jpg",
      "sg10.jpg",
      "sg11.png",
    ],
  },
];

export const STICKERS = [
  { src: "/ico/sticker/sticker1.png", top: "-50px", left: "38%", tilt: "6deg" },
  { src: "/ico/sticker/sticker2.png", top: "66%", left: "72%", tilt: "-10deg" },
  { src: "/ico/sticker/sticker 3.png", top: "64%", left: "-6%", tilt: "9deg" },
  { src: "/ico/sticker/sticker4.png", top: "-220px", left: "88%", tilt: "-10deg" },
];

/** Skill badges in display order; the class names place each badge in the "awards" layout. */
export const SKILLS = [
  { position: "one", src: "/ico/language/python.png", name: "python" },
  { position: "two", src: "/ico/language/js.png", name: "javascript" },
  { position: "ten", src: "/ico/language/html.png", name: "html" },
  { position: "three", src: "/ico/language/css.png", name: "css" },
  { position: "nine", src: "/ico/language/react.png", name: "react" },
  { position: "eight", src: "/ico/language/typescript.png", name: "typescript" },
  { position: "four", src: "/ico/language/docker.webp", name: "docker" },
  { position: "five", src: "/ico/language/nodejs.webp", name: "nodejs" },
  { position: "seven", src: "/ico/language/github.png", name: "github" },
  { position: "six", src: "/ico/language/csharp.png", name: "csharp" },
];

export const ABOUT_COPY: Record<
  Locale,
  {
    navLabel: string;
    /** Headline lines; each word is kept from breaking across lines. */
    quote: string[];
    clover: string;
    portraits: [string, string];
    portraitAlts: [string, string];
    scrollHint: string;
    whoIAm: string;
    storyLead: string;
    lifeExperience: string;
    experienceLead: { before: string; emphasis: string; after: string };
    folderAlt: (name: string) => string;
    photoAlt: (name: string, index: number) => string;
    viewMore: string;
    showLess: string;
    previewLabel: string;
    closePreview: string;
    skills: string;
    doNotClick: [string, string];
    toldYou: string;
    noRotation: string;
  }
> = {
  en: {
    navLabel: "about me",
    quote: ["What seems to", "us as bitter trials", "are often blessings", "in disguise."],
    clover: "Clover",
    portraits: ["/ico/about-me/jamie3.png", "/ico/about-me/jamie2.png"],
    portraitAlts: ["Jamie portrait 1", "Jamie portrait 2"],
    scrollHint: "Scroll to explore",
    whoIAm: "who i am",
    storyLead:
      "Hey, I’m Jamie, a junior web developer based between Seoul, Montreal, and Toronto. I’m currently a second-year student at the University of Toronto, studying math and computer science.",
    lifeExperience: "life experience",
    experienceLead: { before: "A ", emphasis: "selection of experiences", after: " that reflect my growth over the years." },
    folderAlt: (name) => `${name} folder`,
    photoAlt: (name, index) => `${name} photo ${index}`,
    viewMore: "View more",
    showLess: "Show less",
    previewLabel: "Photo preview",
    closePreview: "Close preview",
    skills: "skills",
    doNotClick: ["Do not", "click!"],
    toldYou: "told you!",
    noRotation: "Turn your phone back on!",
  },
  fr: {
    navLabel: "à propos de moi",
    quote: ["Ce qui nous", "semble être", "des épreuves", "amères sont", "souvent des", "bénédictions", "déguisées."],
    clover: "Trèfle",
    portraits: ["/ico/about-me/jamie1.png", "/ico/about-me/jamie2.png"],
    portraitAlts: ["Portrait de Jamie 1", "Portrait de Jamie 2"],
    scrollHint: "Faites défiler pour explorer",
    whoIAm: "qui je suis",
    storyLead:
      "Salut, Jamie ici ! Je suis un développeur web junior en ascension basé entre Séoul, Montréal et Toronto. Je suis actuellement étudiant en deuxième année à l'Université de Toronto, étudiant les mathématiques et l'informatique.",
    lifeExperience: "expérience de vie",
    experienceLead: { before: "Une ", emphasis: "sélection d'expériences", after: " qui reflètent ma croissance au fil des ans." },
    folderAlt: (name) => `Dossier ${name}`,
    photoAlt: (name, index) => `Photo ${name} ${index}`,
    viewMore: "Voir plus",
    showLess: "Voir moins",
    previewLabel: "Aperçu photo",
    closePreview: "Fermer l'aperçu",
    skills: "compétences",
    doNotClick: ["Ne pas", "cliquer !"],
    toldYou: "je te l'avais dit !",
    noRotation: "Remettez votre téléphone à l'endroit !",
  },
};
