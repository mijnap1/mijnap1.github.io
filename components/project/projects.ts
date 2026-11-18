import type { Locale } from "@/lib/i18n";

export type Project = {
  /** Identifier used in links (`/project/#utkcc`, `?project=UTKCC`). */
  alias: string;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  description: Record<Locale, string>;
  href: string;
  linkLabel: Record<Locale, string>;
  image: string;
  imageAlt: string;
  /** Every carousel image has a `-dark.png` twin for dark mode. */
  darkImage: string;
  grid: { image: string; position?: string; size?: string };
};

export const PROJECTS: Project[] = [
  {
    alias: "Mysemester",
    title: { en: "My Semester", fr: "MySemester" },
    intro: { en: "grade planner", fr: "planificateur de notes" },
    description: {
      en: "MySemester is a web application designed to help university students track their academic life in one place. It lets you manage courses, monitor grades, and stay on top of your semester without relying on scattered spreadsheets or portals.",
      fr: "MySemester est une application web conçue pour aider les étudiants universitaires à suivre leur vie académique en un seul endroit. Elle vous permet de gérer les cours, surveiller les notes et rester au top de votre semestre sans dépendre de feuilles de calcul éparpillées ou de portails.",
    },
    href: "https://mysemester.org",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/mysemester.png",
    imageAlt: "Mysemester",
    darkImage: "/ico/projects/mysemester-dark.png",
    grid: { image: "/ico/projects/grid/mysemester.png" },
  },
  {
    alias: "Detector",
    title: { en: "AI SLOP Detector", fr: "AI SLOP Detector" },
    intro: { en: "AI writing analysis tool", fr: "outil d'analyse de texte IA" },
    description: {
      en: "AI Slop Detector is a tool that estimates whether a passage reads more like AI-generated prose or human writing using transformer scoring, phrase heuristics, and sentence-level analysis. It is designed to give an evidence-weighted signal rather than a simple binary verdict.",
      fr: "AI Slop Detector est un outil qui estime si un passage ressemble davantage à une prose générée par IA ou à une écriture humaine à l'aide d'un score par transformeur, d'heuristiques de phrases et d'une analyse au niveau des phrases. Il produit un signal fondé sur des preuves plutôt qu'un simple verdict binaire.",
    },
    href: "https://jamieryu.com/ai-slop-detector/",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/detector.png",
    imageAlt: "Detector",
    darkImage: "/ico/projects/detector-dark.png",
    grid: { image: "/ico/projects/grid/detector.png", position: "center -70px", size: "133% auto" },
  },
  {
    alias: "Scratch",
    title: { en: "Scratch 3.0", fr: "Scratch 3.0" },
    intro: { en: "visual programming language", fr: "langage de programmation visuel" },
    description: {
      en: "Scratch is a visual programming language made by the Lifelong Kindergarten Group at the MIT Media Lab. It helps teens create interactive stories, games, and animations. On this page, I’m sharing some of my Scratch projects that I created throughout my teenage years, including games and animations.",
      fr: "Scratch est un langage de programmation visuel créé par le Lifelong Kindergarten Group du MIT Media Lab. Il aide les adolescents à créer des histoires interactives, des jeux et des animations. Sur cette page, je partage certains de mes projets Scratch que j'ai créés pendant mes années d'adolescence, incluant des jeux et des animations.",
    },
    href: "https://scratch.mit.edu/users/Jamie3128/",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/scratch.png",
    imageAlt: "Scratch",
    darkImage: "/ico/projects/scratch-dark.png",
    grid: { image: "/ico/projects/grid/scratch.png" },
  },
  {
    alias: "langswitch",
    title: { en: "LangSwitch", fr: "LangSwitch" },
    intro: { en: "Chrome Extension", fr: "Extension Chrome" },
    description: {
      en: "LangSwitch is a Chrome extension that detects mistyped keyboard-layout input and converts it on the fly. Type Korean, Chinese, or Japanese using your existing keyboard and let LangSwitch handle the rest. Fully local, no internet required.",
      fr: "LangSwitch est une extension Chrome qui détecte les saisies incorrectes dues à une mauvaise disposition du clavier et les convertit à la volée. Tapez en coréen, chinois ou japonais avec votre clavier habituel et laissez LangSwitch s'occuper du reste. Entièrement en local, sans connexion internet.",
    },
    href: "https://jamieryu.com/langswitch/demo",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/langswitch.png",
    imageAlt: "langswitch",
    darkImage: "/ico/projects/langswitch-dark.png",
    grid: { image: "/ico/projects/grid/langswitch.png" },
  },
  {
    alias: "UTKCC",
    title: { en: "UTKCC", fr: "UTKCC" },
    intro: { en: "University of Toronto Korean Commerce Community", fr: "Communauté de Commerce Coréen de l'Université de Toronto" },
    description: {
      en: "The UTKCC website is a student-run platform for the Korean Commerce Community at the University of Toronto. As Programming Director, I help lead the development of the UTKCC website, making sure the experience feels more intuitive, polished, and useful for the community it serves.",
      fr: "Le site web UTKCC est une plateforme gérée par les étudiants pour la Communauté de Commerce Coréen de l'Université de Toronto. En tant que directeur de la programmation, je dirige une partie du développement du site, en contribuant au frontend, à l'utilisabilité et à l'amélioration de la qualité et du polissage général de l'expérience.",
    },
    href: "https://utkcc.org",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/utkcc.png",
    imageAlt: "UTKCC",
    darkImage: "/ico/projects/utkcc-dark.png",
    grid: { image: "/ico/projects/grid/utkcc.png" },
  },
  {
    alias: "Team Tomorrow",
    title: { en: "TT(Team Tomorrow)", fr: "TT(Team Tomorrow)" },
    intro: { en: "AI Camp", fr: "Camp IA" },
    description: {
      en: "The Team Tomorrow website is a dynamic platform that AI Camp's Team Tomorrow developers can use to showcase their skills, projects, and workforce readiness, while also allowing companies to easily discover top talent and find their ideal candidates to take their initiatives to the next level.",
      fr: "Le site web Team Tomorrow est une plateforme dynamique que les développeurs de Team Tomorrow d'AI Camp peuvent utiliser pour présenter leurs compétences, projets et préparation à la main-d'œuvre, tout en permettant aux entreprises de découvrir facilement les meilleurs talents et de trouver leurs candidats idéaux pour porter leurs initiatives au niveau supérieur.",
    },
    href: "https://teamtomorrow.com/",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/tt.png",
    imageAlt: "Team tomorrow",
    darkImage: "/ico/projects/tt-dark.png",
    grid: { image: "/ico/projects/grid/tt.png" },
  },
  {
    alias: "LFTimes",
    title: { en: "LFTimes", fr: "LFTimes" },
    intro: { en: "School Newsletter", fr: "Bulletin Scolaire" },
    description: {
      en: "LFTimes, derived from the initials of my high school name \"Lycée Français de Toronto\", is a monthly newsletter that offers a concise look into our school community. It features student achievements, articles, and updates on upcoming events. Visit LFTimes to stay connected with life at Lycée Français de Toronto.",
      fr: "LFTimes, dérivé des initiales de mon lycée \"Lycée Français de Toronto\", est un bulletin mensuel qui offre un aperçu concis de notre communauté scolaire. Il présente les réalisations des étudiants, des articles et des mises à jour sur les événements à venir. Visitez LFTimes pour rester connecté à la vie au Lycée Français de Toronto.",
    },
    href: "https://lftimes.com",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/lftimes.png",
    imageAlt: "LFTimes",
    darkImage: "/ico/projects/lftimes-dark.png",
    grid: { image: "/ico/projects/grid/lftimes.png" },
  },
  {
    alias: "myskincare",
    title: { en: "My Self Care", fr: "My Self Care" },
    intro: { en: "self-care journal", fr: "journal de soins personnels" },
    description: {
      en: "My Self Care is a personal wellness tracker concept for organizing skin care, body care, and style routines in one calm dashboard. It is designed as a lightweight daily journal for progress notes, habit tracking, and simple self-care planning.",
      fr: "My Self Care est un concept de suivi bien-être personnel pour organiser les routines de soin de la peau, du corps et du style dans un tableau de bord calme. Il est pensé comme un journal quotidien léger pour les notes de progrès, les habitudes et la planification simple des soins personnels.",
    },
    href: "https://jamieryu.com/myselfcare/",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/myskincare.png",
    imageAlt: "My Self Care",
    darkImage: "/ico/projects/myskincare-dark.png",
    grid: { image: "/ico/projects/grid/myskincare.png" },
  },
  {
    alias: "3dvoxelizer",
    title: { en: "3D Voxelizer", fr: "3D Voxelizer" },
    intro: { en: "3D Voxelization Tool", fr: "outil de voxelisation 3D" },
    description: {
      en: "3D Voxelizer transforms any photo into a stylized, interactive 3D voxel diorama in seconds. Upload an image, explore the generated model in real time, and export your creation as a .glb file. (Powered by gemini pro 3)",
      fr: "3D Voxelizer transforme n'importe quelle photo en un diorama voxel 3D stylisé et interactif en quelques secondes. Téléversez une image, explorez le modèle généré en temps réel et exportez votre création au format .glb. (Propulsé par Gemini Pro 3)",
    },
    href: "https://3dvoxelizer.vercel.app/",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/dog.png",
    imageAlt: "3D Voxelizer",
    darkImage: "/ico/projects/dog-dark.png",
    grid: { image: "/ico/projects/grid/dog.png" },
  },
  {
    alias: "pascal-mystery-hexagon",
    title: { en: "Pascal's Theorem", fr: "Pascal's Theorem" },
    intro: { en: "interactive mathematical visualization", fr: "interactive mathematical visualization" },
    description: {
      en: "This project is an interactive mathematical visualization of Pascal-style patterns and hexagonal symmetry, built to make number patterns feel more intuitive and a bit more fun to explore.",
      fr: "This project is an interactive mathematical visualization of Pascal-style patterns and hexagonal symmetry, built to make number patterns feel more intuitive and a bit more fun to explore.",
    },
    href: "https://jamieryu.com/pascal-mystery-hexagon/",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/pascal.png",
    imageAlt: "Pascal's Mystery Hexagon",
    darkImage: "/ico/projects/pascal-dark.png",
    grid: { image: "/ico/projects/grid/pascal.png" },
  },
  {
    alias: "hand-detector-lab",
    title: { en: "Hand Detector", fr: "Hand Detector" },
    intro: { en: "hand tracking project", fr: "projet de suivi de la main" },
    description: {
      en: "Hand Detector is a simple project that tracks your hand through the camera and recognizes gestures in real time. It is built for interactive experiments like rock-paper-scissors and other hand-based controls.",
      fr: "Hand Detector est un projet simple qui suit votre main avec la caméra et reconnaît les gestes en temps réel. Il est conçu pour des expériences interactives comme pierre-feuille-ciseaux et d'autres contrôles basés sur la main.",
    },
    href: "https://jamieryu.com/hand-detector-lab",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/hand.png",
    imageAlt: "Hand Detector",
    darkImage: "/ico/projects/hand-dark.png",
    grid: { image: "/ico/projects/grid/hand.png", size: "130% auto" },
  },
  {
    alias: "Notion-timer",
    title: { en: "Notion Timer", fr: "Notion Timer" },
    intro: { en: "productivity tool", fr: "outil de productivité" },
    description: {
      en: "Notion Timer is a lightweight productivity tool that lets you track focused work sessions and log them directly into Notion. It’s built for students and developers who want a simple timer without breaking their workflow or switching apps constantly.",
      fr: "Notion Timer est un outil de productivité léger qui vous permet de suivre les sessions de travail concentré et de les enregistrer directement dans Notion. Il est conçu pour les étudiants et les développeurs qui veulent un minuteur simple sans interrompre leur flux de travail ou changer d'applications constamment.",
    },
    href: "https://github.com/mijnap1/notion-timer",
    linkLabel: { en: "View Project", fr: "Voir le Projet" },
    image: "/ico/projects/notion-timer.png",
    imageAlt: "notion-timer",
    darkImage: "/ico/projects/notion-timer-dark.png",
    grid: { image: "/ico/projects/grid/notion-timer.png", position: "42% center" },
  },
  {
    alias: "yourname",
    title: { en: "Your Name", fr: "Your Name" },
    intro: { en: "Japanese Animated Film", fr: "Film d'Animation Japonais" },
    description: {
      en: "Your name is a website project dedicated to the Japanese animated film Your Name, directed by Makoto Shinkai. The site is designed to showcase the beauty of the film through visuals, interactive elements, and information about the movie and its creator, offering fans an immersive browsing experience.",
      fr: "Your Name est un projet de site web dédié au film d'animation japonais Your Name, réalisé par Makoto Shinkai. Le site est conçu pour présenter la beauté du film à travers des visuels, des éléments interactifs et des informations sur le film et son créateur, offrant aux fans une expérience de navigation immersive.",
    },
    href: "https://jamieryu.com/yourname",
    linkLabel: { en: "Visit Site", fr: "Visiter le Site" },
    image: "/ico/projects/yourname.png",
    imageAlt: "Your Name",
    darkImage: "/ico/projects/yourname-dark.png",
    grid: { image: "/ico/projects/grid/yourname.png" },
  },
  {
    alias: "Chess Game",
    title: { en: "Chess Game", fr: "Jeu d'Échecs" },
    intro: { en: "Mobile/PC Game", fr: "Jeu Mobile/PC" },
    description: {
      en: "This is a simple chess game built with Python, designed for both mobile and PC. It focuses on strategy while remaining easy to use, with clean controls and challenging AI opponents. Whether you’re a beginner or an experienced player, it offers a fun way to play and improve your skills.",
      fr: "C'est un jeu d'échecs simple construit avec Python, conçu pour mobile et PC. Il se concentre sur la stratégie tout en restant facile à utiliser, avec des contrôles propres et des adversaires IA stimulants. Que vous soyez débutant ou joueur expérimenté, il offre un moyen amusant de jouer et d'améliorer vos compétences.",
    },
    href: "https://github.com/mijnap1/Chess_Game",
    linkLabel: { en: "View project", fr: "Voir le projet" },
    image: "/ico/projects/chess.png",
    imageAlt: "Chess Game",
    darkImage: "/ico/projects/chess-dark.png",
    grid: { image: "/ico/projects/grid/chess.png" },
  },
];
