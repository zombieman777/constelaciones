const LOCATION = {
    lat: 6.2686,
    long: -75.5658,
    name: "Valle de Aburrá, Medellín"
};

// Eventos Astronómicos Específicos para Febrero 2026 (Fuente: Planetario de Medellín)
const LOCAL_EVENTS = [
    { date: "2026-02-01", desc: "Luna Llena visible toda la noche." },
    { date: "2026-02-03", desc: "La Luna cerca de la estrella Régulo en Leo." },
    { date: "2026-02-07", desc: "La Luna cerca de la estrella Spica en Virgo." },
    { date: "2026-02-16", desc: "El Sol ingresa a la constelación de Acuario." },
    { date: "2026-02-17", desc: "Luna Nueva (ideal para observar estrellas tenues)." },
    { date: "2026-02-18", desc: "Acercamiento de la Luna con Venus y Mercurio al atardecer." },
    { date: "2026-02-19", desc: "La Luna, Saturno y Neptuno en un círculo de 4 grados." },
    { date: "2026-02-23", desc: "La Luna, Urano y las Pléyades (Tauro) en un círculo de 5.4 grados." }
];

const STARS = [
    // Orion
    { name: "Betelgeuse", ra: 5.919, dec: 7.407, mag: 0.45, color: "#ffccaa", dist: "642.5 años luz", desc: "Una supergigante roja al borde de convertirse en supernova." },
    { name: "Rigel", ra: 5.242, dec: -8.201, mag: 0.12, color: "#aaccff", dist: "860 años luz", desc: "Una supergigante azul muy luminosa." },
    { name: "Bellatrix", ra: 5.418, dec: 6.349, mag: 1.64, color: "#bbccff", dist: "250 años luz", desc: "La 'Estrella Amazona'." },
    { name: "Mintaka", ra: 5.533, dec: -0.299, mag: 2.25, color: "#ccccff", dist: "1200 años luz", desc: "Cinturón de Orión." },
    { name: "Alnilam", ra: 5.603, dec: -1.201, mag: 1.69, color: "#ccccff", dist: "2000 años luz", desc: "Cinturón de Orión." },
    { name: "Alnitak", ra: 5.679, dec: -1.942, mag: 1.74, color: "#ccccff", dist: "1260 años luz", desc: "Cinturón de Orión." },
    { name: "Saiph", ra: 5.795, dec: -9.669, mag: 2.07, color: "#ccccff", dist: "650 años luz", desc: "La rodilla de Orión." },

    // Canis Major
    { name: "Sirio", ra: 6.75, dec: -16.716, mag: -1.46, color: "#ffffff", dist: "8.6 años luz", desc: "La estrella más brillante del cielo nocturno." },

    // Crux
    { name: "Acrux", ra: 12.443, dec: -63.099, mag: 0.77, color: "#aaccff", dist: "320 años luz", desc: "Base de la Cruz del Sur." },
    { name: "Mimosa", ra: 12.796, dec: -59.688, mag: 1.25, color: "#aaccff", dist: "280 años luz", desc: "Brazo izquierdo de la Cruz." },
    { name: "Gacrux", ra: 12.519, dec: -57.113, mag: 1.63, color: "#ffccaa", dist: "88 años luz", desc: "Cabeza de la Cruz del Sur." },
    { name: "Delta Crucis", ra: 12.250, dec: -58.748, mag: 2.79, color: "#ccccff", dist: "345 años luz", desc: "Brazo derecho de la Cruz." },

    // Scorpius
    { name: "Antares", ra: 16.490, dec: -26.432, mag: 1.06, color: "#ffaa88", dist: "550 años luz", desc: "El corazón del escorpión (rojo)." },
    { name: "Shaula", ra: 17.561, dec: -37.103, mag: 1.62, color: "#ccccff", dist: "570 años luz", desc: "El aguijón del escorpión." },

    // Ursa Major
    { name: "Dubhe", ra: 11.062, dec: 61.751, mag: 1.79, color: "#ffccaa", dist: "123 años luz", desc: "Apunta a la Estrella Polar." },
    { name: "Merak", ra: 11.030, dec: 56.382, mag: 2.37, color: "#ffffff", dist: "79 años luz", desc: "Apunta a la Estrella Polar." },
    { name: "Alioth", ra: 12.900, dec: 55.959, mag: 1.77, color: "#ffffff", dist: "82 años luz", desc: "La más brillante de la Osa Mayor." },

    // Taurus
    { name: "Aldebaran", ra: 4.598, dec: 16.509, mag: 0.85, color: "#ffccaa", dist: "65 años luz", desc: "El Ojo del Toro." },

    // Gemini
    { name: "Pollux", ra: 7.755, dec: 28.026, mag: 1.14, color: "#ffccaa", dist: "34 años luz", desc: "Gemelo inmortal." },
    { name: "Castor", ra: 7.576, dec: 31.888, mag: 1.58, color: "#ffffff", dist: "51 años luz", desc: "Gemelo mortal." },

    // Leo
    { name: "Regulus", ra: 10.139, dec: 11.967, mag: 1.35, color: "#ccccff", dist: "79 años luz", desc: "El corazón del León." },

    // Lyra
    { name: "Vega", ra: 18.615, dec: 38.783, mag: 0.03, color: "#ffffff", dist: "25 años luz", desc: "Muy brillante, alta en el cielo." },

    // Centaurus
    { name: "Rigil Kentaurus", ra: 14.660, dec: -60.833, mag: -0.01, color: "#ffeeaa", dist: "4.37 años luz", desc: "Alfa Centauri." },
    { name: "Hadar", ra: 14.063, dec: -60.373, mag: 0.61, color: "#ccccff", dist: "390 años luz", desc: "Beta Centauri." },

    // Carina
    { name: "Canopus", ra: 6.399, dec: -52.695, mag: -0.72, color: "#ffffff", dist: "310 años luz", desc: "Segunda estrella más brillante del cielo." }
];

const CONSTELLATIONS = [
    ["Betelgeuse", "Bellatrix"], ["Betelgeuse", "Alnitak"], ["Rigel", "Saiph"], ["Rigel", "Alnilam"],
    ["Bellatrix", "Mintaka"], ["Mintaka", "Alnilam"], ["Alnilam", "Alnitak"], ["Alnitak", "Saiph"], // Orion
    ["Acrux", "Mimosa"], ["Mimosa", "Delta Crucis"], ["Delta Crucis", "Gacrux"], ["Gacrux", "Acrux"], // Crux
    ["Antares", "Shaula"], // Scorpius
    ["Pollux", "Castor"], // Gemini
    ["Dubhe", "Merak"], ["Merak", "Alioth"], // Big Dipper part
    ["Rigil Kentaurus", "Hadar"] // Centaurus Pointers
];

const PLANETS = [
    { name: "Mercurio", N: 48.3313, i: 7.0047, w: 29.1241, a: 0.387098, e: 0.205635, M: 168.6562, color: "#aaaaaa", dist: "0.6 UA", desc: "Cercano al Sol." },
    { name: "Venus", N: 76.6799, i: 3.3946, w: 54.8910, a: 0.723330, e: 0.006773, M: 48.0052, color: "#ffeeaa", dist: "0.7 UA", desc: "Muy brillante." },
    { name: "Marte", N: 49.5574, i: 1.8497, w: 286.5016, a: 1.523688, e: 0.093405, M: 18.6021, color: "#ff8866", dist: "1.5 UA", desc: "El Planeta Rojo." },
    { name: "Júpiter", N: 100.4542, i: 1.3030, w: 273.8777, a: 5.202561, e: 0.048498, M: 19.8950, color: "#ffddaa", dist: "5.2 UA", desc: "El gigante gaseoso." },
    { name: "Saturno", N: 113.6634, i: 2.4886, w: 339.3939, a: 9.55475, e: 0.055546, M: 316.9670, color: "#ddccaa", dist: "9.5 UA", desc: "El señor de los anillos." }
];

const FACTS = [
    "Medellín es excelente para ver constelaciones del sur.",
    "Orión es muy visible desde el Valle de Aburrá.",
    "La Cruz del Sur apunta al polo sur celeste.",
    "Sirio es la estrella más brillante."
];

const OBSERVABLE_PLACES = [
    { name: "Nebulosa de Orión", desc: "Visible en la espada de Orión.", ra: 5.588, dec: -5.391 },
    { name: "Pléyades", desc: "Cúmulo en Tauro.", ra: 3.783, dec: 24.116 }
];

const CONSTELLATION_INFO = [
    { name: "Orión", ra: 5.5, dec: 0, desc: "El Cazador. Visible al este al anochecer." },
    { name: "Escorpión", ra: 16.5, dec: -26, desc: "Visible en la madrugada o mitad de año." },
    { name: "Cruz del Sur", ra: 12.5, dec: -60, desc: "Fundamental para el hemisferio sur." },
    { name: "Can Mayor", ra: 6.8, dec: -20, desc: "Contiene a Sirio." }
];
