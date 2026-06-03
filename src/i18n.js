const translations = {
  nl: {
    nav: {
      home: 'Home',
      info: 'Info',
      lineup: 'Line-up',
      map: 'Map',
      cms: 'CMS',
    },
    theme: {
      light: 'Light mode',
      dark: 'Dark mode',
      toggle: 'Thema wisselen',
    },
    language: {
      switch: 'English',
    },
    home: {
      title: 'Welkom bij U Festival',
      subtitle: 'Ontdek het festival, de line-up en het terrein in één app.',
      featuredTitle: 'Hoofdprogramma',
      featuredDate: '15-16 juni 2024',
      highlight1: 'Stage highlights',
      highlight1Text: 'Ontdek muziekzones, food spots en chill areas.',
      highlight2: 'Festival vibes',
      highlight2Text: 'Heldere kleuren, sterke momenten en onvergetelijke avonden.',
    },
    info: {
      heading: 'Algemeen & contact',
      description: 'Snelle informatie over bereikbaarheid, fietsenstalling en tickets.',
      sections: [
        {
          title: 'Festival informatie',
          content: 'Alle festivalinformatie is nu beschikbaar en futureproof door onze beheerde API-structuur.',
        },
        {
          title: 'Bereikbaarheid',
          content: 'Reis met de trein naar Utrecht Centraal en neem vervolgens bus of tram richting het festivalterrein.',
        },
        {
          title: 'Route & parking',
          content: 'Parkeren kan op P+R Papendorp. Volg de festivalborden naar de ingang.',
        },
      ],
    },
    schedule: {
      heading: 'Line-up',
      description: 'Kies een dag en bekijk de blokken per podium.',
      saturday: 'Zaterdag',
      sunday: 'Zondag',
      noData: 'Geen optredens beschikbaar',
      stageLabel: 'Podium',
    },
    map: {
      heading: 'Festival map',
      subtitle: 'Vind snel je route en bekijk alle festivalzones op de kaart.',
      locations: 'Locaties',
      spots: 'spots',
      findMe: 'Vind mij',
      userLocation: 'Jouw locatie',
      locationError: 'Kon locatie niet vinden',
    },
  },
  en: {
    nav: {
      home: 'Home',
      info: 'Info',
      lineup: 'Line-up',
      map: 'Map',
      cms: 'CMS',
    },
    theme: {
      light: 'Light mode',
      dark: 'Dark mode',
      toggle: 'Toggle theme',
    },
    language: {
      switch: 'Nederlands',
    },
    home: {
      title: 'Welcome to U Festival',
      subtitle: 'Explore the festival, lineup and grounds in one app.',
      featuredTitle: 'Main program',
      featuredDate: 'June 15-16, 2024',
      highlight1: 'Stage highlights',
      highlight1Text: 'Discover music zones, food spots and chill areas.',
      highlight2: 'Festival vibes',
      highlight2Text: 'Bright colors, bold moments and unforgettable nights.',
    },
    info: {
      heading: 'General & contact',
      description: 'Fast information about access, bike parking and tickets.',
      sections: [
        {
          title: 'Festival information',
          content: 'All festival information is available and future proof via our managed API structure.',
        },
        {
          title: 'Accessibility',
          content: 'Travel by train to Utrecht Central and then take a direct bus or tram to the festival site.',
        },
        {
          title: 'Route & parking',
          content: 'Parking is available at P+R Papendorp. Follow festival signs to the entrance.',
        },
      ],
    },
    schedule: {
      heading: 'Line-up',
      description: 'Select a day and view the program blocks per stage.',
      saturday: 'Saturday',
      sunday: 'Sunday',
      noData: 'No performances available',
      stageLabel: 'Stage',
    },
    map: {
      heading: 'Festival map',
      subtitle: 'Quickly find your route and see all festival zones on the map.',
      locations: 'Locations',
      spots: 'spots',
      findMe: 'Find me',
      userLocation: 'Your location',
      locationError: 'Could not find location',
    },
  },
}

export const t = (lang, path) => {
  const keys = path.split('.')
  return keys.reduce((obj, key) => obj?.[key], translations[lang]) || ''
}

export const getTranslations = (lang) => translations[lang] || translations.en
