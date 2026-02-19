const LOCATION = {
    lat: 6.1759,
    long: -75.5917,
    name: "Envigado, Antioquia"
};

// RA is in Hours (0-24), Dec is in Degrees. 
// We will convert RA to degrees (RA * 15) in the app or pre-calculate.
// Here we use RA in decimal hours for easier reading/editing.
const STARS = [
    // Orion
    { name: "Betelgeuse", ra: 5.919, dec: 7.407, mag: 0.45, color: "#ffccaa", dist: "642.5 años luz", desc: "Una supergigante roja al borde de convertirse en supernova. Es una de las estrellas más grandes visibles a simple vista." },
    { name: "Rigel", ra: 5.242, dec: -8.201, mag: 0.12, color: "#aaccff", dist: "860 años luz", desc: "Una supergigante azul muy luminosa. Es la estrella más brillante de la constelación de Orión." },
    { name: "Bellatrix", ra: 5.418, dec: 6.349, mag: 1.64, color: "#bbccff", dist: "250 años luz", desc: "La tercera estrella más brillante de Orión, conocida como la 'Estrella Amazona'." },
    { name: "Mintaka", ra: 5.533, dec: -0.299, mag: 2.25, color: "#ccccff", dist: "1200 años luz", desc: "Una de las tres estrellas del Cinturón de Orión. Es un sistema estelar múltiple complejos." },
    { name: "Alnilam", ra: 5.603, dec: -1.201, mag: 1.69, color: "#ccccff", dist: "2000 años luz", desc: "La estrella central del Cinturón de Orión. Es una supergigante azul distante y masiva." },
    { name: "Alnitak", ra: 5.679, dec: -1.942, mag: 1.74, color: "#ccccff", dist: "1260 años luz", desc: "La estrella oriental del Cinturón de Orión. Cerca de ella se encuentra la famosa Nebulosa Cabeza de Caballo." },
    { name: "Saiph", ra: 5.795, dec: -9.669, mag: 2.07, color: "#ccccff", dist: "650 años luz", desc: "La sexta estrella más brillante de Orión. Es una supergigante azul similar a Rigel pero parece menos brillante por la distancia." },

    // Canis Major
    { name: "Sirio", ra: 6.75, dec: -16.716, mag: -1.46, color: "#ffffff", dist: "8.6 años luz", desc: "La estrella más brillante del cielo nocturno. Es un sistema binario con una compañera enana blanca." },

    // Crux (Southern Cross)
    { name: "Acrux", ra: 12.443, dec: -63.099, mag: 0.77, color: "#aaccff", dist: "320 años luz", desc: "La estrella más brillante de la Cruz del Sur. Apunta aproximadamente hacia el Polo Sur Celeste." },
    { name: "Mimosa", ra: 12.796, dec: -59.688, mag: 1.25, color: "#aaccff", dist: "280 años luz", desc: "La segunda estrella más brillante de la Cruz del Sur, una gigante azul variable." },
    { name: "Gacrux", ra: 12.519, dec: -57.113, mag: 1.63, color: "#ffccaa", dist: "88 años luz", desc: "La gigante roja en la parte superior de la Cruz del Sur. Es la estrella gigante roja más cercana al Sol." },
    { name: "Delta Crucis", ra: 12.250, dec: -58.748, mag: 2.79, color: "#ccccff", dist: "345 años luz", desc: "Una subgigante azul-blanca que completa la forma de cruz." },

    // Scorpius
    { name: "Antares", ra: 16.490, dec: -26.432, mag: 1.06, color: "#ffaa88", dist: "550 años luz", desc: "El 'Corazón del Escorpión'. Una supergigante roja que rivaliza con Marte en color rojo intenso." },
    { name: "Shaula", ra: 17.561, dec: -37.103, mag: 1.62, color: "#ccccff", dist: "570 años luz", desc: "Representa el aguijón del escorpión. Su nombre significa 'la elevada' en árabe." },

    // Ursa Major (Big Dipper asterism mainly)
    { name: "Dubhe", ra: 11.062, dec: 61.751, mag: 1.79, color: "#ffccaa", dist: "123 años luz", desc: "Una de las estrellas puntero de la Osa Mayor que ayudan a encontrar la Estrella Polar." },
    { name: "Merak", ra: 11.030, dec: 56.382, mag: 2.37, color: "#ffffff", dist: "79 años luz", desc: "La otra estrella puntero. Junto con Dubhe, apunta hacia Polaris." },
    { name: "Phecda", ra: 11.896, dec: 53.694, mag: 2.44, color: "#ffffff", dist: "83 años luz", desc: "Su nombre significa 'muslo' del oso. Es una estrella de la secuencia principal blanca." },
    { name: "Megrez", ra: 12.257, dec: 57.032, mag: 3.31, color: "#ffffff", dist: "58 años luz", desc: "La estrella más tenue del Gran Carro, conectando el cuenco con el mango." },
    { name: "Alioth", ra: 12.900, dec: 55.959, mag: 1.77, color: "#ffffff", dist: "82 años luz", desc: "La estrella más brillante de la Osa Mayor. Es una estrella peculiar por sus fuertes campos magnéticos." },
    { name: "Mizar", ra: 13.398, dec: 54.925, mag: 2.27, color: "#ffffff", dist: "83 años luz", desc: "Famosa por formar una estrella doble visual con Alcor, visible a simple vista." },
    { name: "Alkaid", ra: 13.792, dec: 49.313, mag: 1.86, color: "#ccccff", dist: "103 años luz", desc: "El final de la cola de la Osa Mayor. Una estrella joven y azul caliente." },

    // Taurus
    { name: "Aldebaran", ra: 4.598, dec: 16.509, mag: 0.85, color: "#ffccaa", dist: "65 años luz", desc: "El 'Ojo del Toro'. Una gigante naranja que parece pertenecer al cúmulo de las Híades pero está más cerca." },

    // Gemini
    { name: "Pollux", ra: 7.755, dec: 28.026, mag: 1.14, color: "#ffccaa", dist: "34 años luz", desc: "La estrella más brillante de Géminis. Se sabe que tiene un planeta extrasolar orbitándola." },
    { name: "Castor", ra: 7.576, dec: 31.888, mag: 1.58, color: "#ffffff", dist: "51 años luz", desc: "Aunque parece una sola estrella, es un sistema séxtuple increíblemente complejo." },

    // Leo
    { name: "Regulus", ra: 10.139, dec: 11.967, mag: 1.35, color: "#ccccff", dist: "79 años luz", desc: "El 'Pequeño Rey'. Gira tan rápido sobre sí misma que tiene forma de huevo." },

    // Lyra
    { name: "Vega", ra: 18.615, dec: 38.783, mag: 0.03, color: "#ffffff", dist: "25 años luz", desc: "Fue la Estrella Polar hace 12,000 años y lo volverá a ser. Muy brillante y cercana." },

    // Aquila
    { name: "Altair", ra: 19.846, dec: 8.868, mag: 0.77, color: "#ffffff", dist: "16.7 años luz", desc: "Una de las estrellas más cercanas visibles a simple vista. También gira muy rápidamente." },

    // Cygnus
    { name: "Deneb", ra: 20.690, dec: 45.280, mag: 1.25, color: "#ffffff", dist: "2600 años luz", desc: "Una de las estrellas más luminosas conocidas. Forma parte del Triángulo de Verano." },

    // Centaurus
    { name: "Rigil Kentaurus", ra: 14.660, dec: -60.833, mag: -0.01, color: "#ffeeaa", dist: "4.37 años luz", desc: "Alfa Centauri. El sistema estelar más cercano a nuestro Sol." },
    { name: "Hadar", ra: 14.063, dec: -60.373, mag: 0.61, color: "#ccccff", dist: "390 años luz", desc: "Beta Centauri. Una gigante azul compañera aparente de Alfa Centauri en el cielo del sur." },

    // Southern Fish
    { name: "Fomalhaut", ra: 22.960, dec: -29.622, mag: 1.16, color: "#ffffff", dist: "25 años luz", desc: "La estrella solitaria del otoño. Tiene un gran disco de polvo y un planeta confirmado, Dagon." },

    // Carina
    { name: "Canopus", ra: 6.399, dec: -52.695, mag: -0.72, color: "#ffffff", dist: "310 años luz", desc: "La segunda estrella más brillante del cielo. Usada frecuentemente por naves espaciales para orientación." },

    // Sagittarius (The Teapot)
    { name: "Kaus Australis", ra: 18.402, dec: -34.384, mag: 1.85, color: "#ccccff", dist: "140 años luz", desc: "La estrella más brillante de Sagitario, parte de la tetera." },
    { name: "Nunki", ra: 18.918, dec: -26.296, mag: 2.05, color: "#aaccff", dist: "220 años luz", desc: "Una estrella caliente azul-blanca en el mango de la tetera." },
    { name: "Ascella", ra: 19.006, dec: -29.880, mag: 2.59, color: "#ffffff", dist: "89 años luz", desc: "Parte del mango de la tetera de Sagitario." },
    { name: "Kaus Media", ra: 18.347, dec: -29.828, mag: 2.70, color: "#ffccaa", dist: "300 años luz", desc: "Parte del pico de la tetera." },

    // Cassiopeia (M or W shape)
    { name: "Schedar", ra: 0.675, dec: 56.537, mag: 2.24, color: "#ffccaa", dist: "230 años luz", desc: "Una gigante naranja que marca el corazón de la reina Casiopea." },
    { name: "Caph", ra: 0.152, dec: 59.150, mag: 2.28, color: "#ffeeaa", dist: "54 años luz", desc: "Una estrella variable Delta Scuti." },
    { name: "Ruchbah", ra: 1.430, dec: 60.235, mag: 2.68, color: "#ccccff", dist: "99 años luz", desc: "La rodilla de la reina Casiopea." },

    // Bootes
    { name: "Arcturus", ra: 14.261, dec: 19.182, mag: -0.05, color: "#ffaa88", dist: "37 años luz", desc: "El guardián del oso. La cuarta estrella más brillante del cielo." },

    // Virgo
    { name: "Spica", ra: 13.419, dec: -11.161, mag: 0.98, color: "#aaccff", dist: "260 años luz", desc: "La espiga de trigo de la Virgen. Una binaria espectroscópica." },
];

// Pairs of star names to connect
const CONSTELLATIONS = [
    ["Betelgeuse", "Bellatrix"], ["Betelgeuse", "Alnitak"], ["Rigel", "Saiph"], ["Rigel", "Alnilam"],
    ["Bellatrix", "Mintaka"], ["Mintaka", "Alnilam"], ["Alnilam", "Alnitak"], ["Alnitak", "Saiph"], // Orion
    ["Acrux", "Mimosa"], ["Mimosa", "Delta Crucis"], ["Delta Crucis", "Gacrux"], ["Gacrux", "Acrux"], // Crux
    ["Dubhe", "Merak"], ["Merak", "Phecda"], ["Phecda", "Megrez"], ["Megrez", "Alioth"], ["Alioth", "Mizar"], ["Mizar", "Alkaid"], // Big Dipper
    ["Antares", "Shaula"], // Part of Scorpius
    ["Pollux", "Castor"], // Gemini
    ["Kaus Australis", "Nunki"], ["Nunki", "Ascella"], ["Ascella", "Kaus Media"], ["Kaus Media", "Kaus Australis"], // Sagittarius Teapot
    ["Schedar", "Caph"], ["Caph", "Ruchbah"], // Cassiopeia
    ["Arcturus", "Spica"], // Connection line (not real constellation but helps orientation)
];

// Simplified Orbital Elements (J2000 + centuries)
// For a high-fidelity app we'd use NASA JPL/VSOP87, but for this "agent" visualizer, 
// mean elements are sufficient for identification.
const PLANETS = [
    {
        name: "Mercurio",
        N: 48.3313, i: 7.0047, w: 29.1241, a: 0.387098, e: 0.205635, M: 168.6562,
        color: "#aaaaaa", dist: "0.6 UA", desc: "El planeta más pequeño y cercano al Sol. Es difícil de ver por su cercanía al astro rey."
    },
    {
        name: "Venus",
        N: 76.6799, i: 3.3946, w: 54.8910, a: 0.723330, e: 0.006773, M: 48.0052,
        color: "#ffeeaa", dist: "0.7 UA", desc: "El objeto más brillante después del Sol y la Luna. Conocido como el Lucero del Alba o del Atardecer."
    },
    {
        name: "Marte",
        N: 49.5574, i: 1.8497, w: 286.5016, a: 1.523688, e: 0.093405, M: 18.6021,
        color: "#ff8866", dist: "1.5 UA", desc: "El Planeta Rojo. Visible a simple vista con un distintivo color rojizo debido al óxido de hierro."
    },
    {
        name: "Júpiter",
        N: 100.4542, i: 1.3030, w: 273.8777, a: 5.202561, e: 0.048498, M: 19.8950,
        color: "#ffddaa", dist: "5.2 UA", desc: "El rey de los planetas. Es muy brillante y sus cuatro lunas principales son visibles con binoculares."
    },
    {
        name: "Saturno",
        N: 113.6634, i: 2.4886, w: 339.3939, a: 9.55475, e: 0.055546, M: 316.9670,
        color: "#ddccaa", dist: "9.5 UA", desc: "Famoso por sus anillos. Es el objeto más lejano visible fácilmente a simple vista."
    }
];

const FACTS = [
    "La luz de las estrellas que ves hoy salió hace miles de años.",
    "Betelgeuse es tan grande que si la pusieras en el lugar del Sol, llegaría hasta Júpiter.",
    "Envigado tiene una excelente ubicación para ver constelaciones tanto del norte como del sur.",
    "La constelación de Orión es conocida como 'Los Tres Reyes Magos' en muchas culturas por su cinturón.",
    "La estrella Sirio es la más brillante de todo el cielo nocturno.",
    "Una cucharadita de una estrella de neutrones pesaría 6 mil millones de toneladas.",
    "Hay más estrellas en el universo que granos de arena en todas las playas de la Tierra.",
    "Las estrellas tienen colores diferentes debido a su temperatura: las azules son más calientes, las rojas más frías.",
    "La Cruz del Sur es la constelación más pequeña de todas las 88 modernas.",
    "Desde Envigado, puedes ver la Vía Láctea cruzando el cielo en noches muy despejadas.",
    "El Sol es una estrella de tipo G2V, y es solo una de las 100 mil millones en nuestra galaxia.",
    "Un año luz es la distancia que recorre la luz en un año: aproximadamente 9.46 billones de kilómetros.",
    "Las estrellas fugaces no son estrellas, son pequeños fragmentos de roca espacial quemándose en la atmósfera.",
    "Si pudieras volar en un avión a Plutón, el viaje duraría más de 800 años.",
    "En Júpiter y Saturno llueven diamantes debido a la extrema presión atmosférica.",
    "La Gran Mancha Roja de Júpiter es una tormenta que ha durado más de 300 años y es más grande que la Tierra.",
    "El universo observable tiene un diámetro estimado de 93 mil millones de años luz.",
    "Las estrellas de neutrones giran hasta 600 veces por segundo.",
    "El Monte Olimpo en Marte es el volcán más alto del sistema solar, tres veces más alto que el Everest.",
    "Venus es el planeta más caliente del sistema solar, más que Mercurio, debido a su efecto invernadero.",
    "La Luna se aleja de la Tierra aproximadamente 3.8 cm cada año.",
    "Hay planetas errantes que flotan solos en el espacio sin orbitar ninguna estrella.",
    "La galaxia de Andrómeda y la Vía Láctea colisionarán en unos 4.5 mil millones de años."
];

const OBSERVABLE_PLACES = [
    { name: "Nebulosa de Orión (M42)", desc: "Visible a simple vista como una mancha borrosa en la espada de Orión.", ra: 5.588, dec: -5.391 },
    { name: "Pléyades (M45)", desc: "Un cúmulo abierto de estrellas azules jóvenes, visible en Tauro.", ra: 3.783, dec: 24.116 },
    { name: "Omega Centauri", desc: "El cúmulo globular más grande y brillante, visible desde el hemisferio sur.", ra: 13.448, dec: -47.479 },
    { name: "Galaxia de Andrómeda (M31)", desc: "El objeto más lejano visible a simple vista.", ra: 0.712, dec: 41.269 },
    { name: "Nebulosa de la Laguna (M8)", desc: "Una nube interestelar gigante en Sagitario, visible con binoculares.", ra: 18.060, dec: -24.380 },
    { name: "Cúmulo de Ptolomeo (M7)", desc: "Un hermoso cúmulo abierto en la cola del Escorpión.", ra: 17.898, dec: -34.793 },
    { name: "Eta Carinae", desc: "Un sistema estelar masivo e inestable rodeado por la Nebulosa del Homúnculo.", ra: 10.750, dec: -59.684 },
    { name: "47 Tucanae", desc: "El segundo cúmulo globular más brillante, cerca de la Pequeña Nube de Magallanes.", ra: 0.400, dec: -72.081 }
];

const CONSTELLATION_INFO = [
    {
        name: "Orión",
        ra: 5.5, dec: 0,
        desc: "El Cazador. Visible en ambos hemisferios. Su cinturón (Las Tres Marías) es inconfundible. Contiene famosas nebulosas y gigantes rojas y azules."
    },
    {
        name: "Escorpión",
        ra: 16.5, dec: -26,
        desc: "Una de las pocas constelaciones que realmente se parece a lo que representa. Antares, su corazón rojo, marca el cuerpo del escorpión."
    },
    {
        name: "Sagitario",
        ra: 19, dec: -25,
        desc: "El Arquero, aunque es más fácil ver su asterismo 'La Tetera'. Marca la dirección hacia el centro de nuestra galaxia, la Vía Láctea."
    },
    {
        name: "Cruz del Sur",
        ra: 12.5, dec: -60,
        desc: "La constelación más pequeña pero una de las más famosas del hemisferio sur. Señala el camino hacia el Polo Sur Celeste."
    },
    {
        name: "Can Mayor",
        ra: 6.8, dec: -20,
        desc: "Hogar de Sirio, la estrella más brillante de todo el cielo nocturno. Representa a uno de los perros de caza de Orión."
    },
    {
        name: "Casiopea",
        ra: 1, dec: 60,
        desc: "La Reina. Fácil de reconocer por su forma de 'W' o 'M'. Se encuentra en el lado opuesto a la Osa Mayor respecto a la Estrella Polar."
    },
    {
        name: "Leo",
        ra: 10.5, dec: 15,
        desc: "El León. Su cabeza tiene forma de signo de interrogación invertido (La Hoz). Regulus, su corazón, es una de las estrellas más brillantes."
    },
    {
        name: "Géminis",
        ra: 7, dec: 20,
        desc: "Los Gemelos Cástor y Pólux. Dos estrellas brillantes marcan sus cabezas. Es una constelación del zodiaco visible en invierno."
    }
];
