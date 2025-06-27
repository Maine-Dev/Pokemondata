// DOM Elements
const searchBtn = document.getElementById('search-btn');
const inputField = document.getElementById('searchBar');
const nameScreen = document.getElementById('name');
const idScreen = document.getElementById('number');
const imageScreen = document.getElementById('main-screen');
const typeScreen = document.getElementById('type');
const typeScreen2 = document.getElementById('type2');
const healthScreen = document.getElementById('health');
const attackScreen = document.getElementById('attack');
const defenseScreen = document.getElementById('defense');
const abilitiesScreen = document.getElementById('abilities');
const abilitiesScreen2 = document.getElementById('abilities2');
const abilitiesScreen3 = document.getElementById('abilities3');
const speedScreen = document.getElementById('speed');
const specialAttackScreen = document.getElementById('specAttack');
const specialDefenseScreen = document.getElementById('specDefense');
const weightScreen = document.getElementById('weight2');
const heightScreen = document.getElementById('height2');
const descriptionScreen = document.getElementById('description');

// Carousel Elements
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const prevPokemon = document.getElementById('prev-pokemon');
const nextPokemon = document.getElementById('next-pokemon');

// Type colors
const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
};

// Utility: text color for type backgrounds
const getContrastColor = (bgColor) => {
  if (!bgColor) return '#000';
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
};

// Carousel state
let currentId = 25; // Default: Pikachu
const MAX_ID = 1010; // Adjust if you want a different Pokédex range

// Helper: Get Pokémon image URL by ID
function getPokemonImageUrl(id) {
  return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id.toString().padStart(3, '0')}.png`;
}

// Update carousel previews (side Pokémon)
function updateCarouselPreviews() {
  let prevId = currentId - 1 < 1 ? MAX_ID : currentId - 1;
  let nextId = currentId + 1 > MAX_ID ? 1 : currentId + 1;
  prevPokemon.style.backgroundImage = `url('${getPokemonImageUrl(prevId)}')`;
  nextPokemon.style.backgroundImage = `url('${getPokemonImageUrl(nextId)}')`;
  prevPokemon.title = `#${prevId}`;
  nextPokemon.title = `#${nextId}`;
}

// Fetch and display Pokémon data
const getPokemonData = async (pokemon) => {
  try {
    // Fetch data (number or name)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon || 'pikachu'}`);
    if (!response.ok) throw new Error('Pokémon not found');
    const data = await response.json();

    // Update currentId for carousel
    currentId = data.id;

    // Main image and name/number
    const id = data.id.toString().padStart(3, '0');
    imageScreen.style.backgroundImage = `url('https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png')`;
    nameScreen.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    idScreen.textContent = `#${data.id}`;

    // Types
    const type1 = data.types[0].type.name;
    const type2 = data.types[1]?.type.name;
    typeScreen.textContent = type1.charAt(0).toUpperCase() + type1.slice(1);
    typeScreen2.textContent = type2 ? type2.charAt(0).toUpperCase() + type2.slice(1) : '';
    typeScreen.style.backgroundColor = typeColors[type1] || '#A8A878';
    typeScreen.style.color = getContrastColor(typeColors[type1]);
    typeScreen2.style.backgroundColor = type2 ? typeColors[type2] : 'transparent';
    typeScreen2.style.color = type2 ? getContrastColor(typeColors[type2]) : '#000';

    // Body background gradient
    const backgroundColor = typeColors[type1];
    const backgroundColor2 = typeColors[type2];
    if (type2) {
      document.body.style.background = `linear-gradient(to right, ${backgroundColor}, ${backgroundColor2})`;
    } else {
      document.body.style.background = backgroundColor;
    }

    // Stats
    healthScreen.textContent = data.stats[0].base_stat;
    attackScreen.textContent = data.stats[1].base_stat;
    defenseScreen.textContent = data.stats[2].base_stat;
    speedScreen.textContent = data.stats[5].base_stat;
    specialAttackScreen.textContent = data.stats[3].base_stat;
    specialDefenseScreen.textContent = data.stats[4].base_stat;
    weightScreen.textContent = `${(data.weight / 10 * 2.20462).toFixed(1)} lbs`;
    heightScreen.textContent = `${(data.height / 10).toFixed(1)} m`;

    // Abilities
    abilitiesScreen.textContent = data.abilities[0]?.ability.name.charAt(0).toUpperCase() + (data.abilities[0]?.ability.name.slice(1) || '');
    abilitiesScreen2.textContent = data.abilities[1]?.ability.name.charAt(0).toUpperCase() + (data.abilities[1]?.ability.name.slice(1) || '');
    abilitiesScreen3.textContent = data.abilities[2]?.ability.name.charAt(0).toUpperCase() + (data.abilities[2]?.ability.name.slice(1) || '');
    if (!data.abilities[1]) abilitiesScreen2.textContent = '';
    if (!data.abilities[2]) abilitiesScreen3.textContent = '';

    // Description (species endpoint)
    const speciesResponse = await fetch(data.species.url);
    if (!speciesResponse.ok) throw new Error('Species data not found');
    const speciesData = await speciesResponse.json();
    const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
    descriptionScreen.textContent = englishEntry?.flavor_text.replace(/\f/g, ' ') || 'No description available.';

    // Update carousel previews every time!
    updateCarouselPreviews();

  } catch (error) {
    alert(error.message);
  }
};

// Search and keyboard events
inputField.addEventListener('keydown', (event) => event.key === 'Enter' && searchBtn.click());
searchBtn.addEventListener('click', () => getPokemonData(inputField.value.toLowerCase().trim()));

// Carousel navigation
prevBtn.addEventListener('click', () => getPokemonData(currentId - 1 < 1 ? MAX_ID : currentId - 1));
nextBtn.addEventListener('click', () => getPokemonData(currentId + 1 > MAX_ID ? 1 : currentId + 1));
prevPokemon.addEventListener('click', () => getPokemonData(currentId - 1 < 1 ? MAX_ID : currentId - 1));
nextPokemon.addEventListener('click', () => getPokemonData(currentId + 1 > MAX_ID ? 1 : currentId + 1));

// Load default Pokémon on page load
getPokemonData('pikachu');
