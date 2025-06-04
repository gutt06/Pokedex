let idAtual = 1;
let isEditing = false;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isEditing) {
        event.preventDefault();
        editId();
    }
});

function editId() {
    if (isEditing) return;
    isEditing = true;
    const display = document.getElementById('pokemon-id-display');
    const input = document.getElementById('pokemon-id-edit');
    
    input.value = display.textContent.replace('#', '').padStart(4, '0');
    display.classList.add('hidden');
    input.classList.remove('hidden');
    input.focus();
    input.select();
}

function saveId() {
    if (!isEditing) return;
    isEditing = false;
    
    const display = document.getElementById('pokemon-id-display');
    const input = document.getElementById('pokemon-id-edit');
    const newId = parseInt(input.value) || 1;
    
    if (newId >= 1 && newId <= 1025) {
        fetchPokemon(newId);
    }
    
    input.classList.add('hidden');
    display.classList.remove('hidden');
}

function editName() {
    if (isEditing) return;
    isEditing = true;
    const display = document.getElementById('pokemon-name');
    const input = document.getElementById('pokemon-name-edit');
    
    input.value = display.textContent;
    display.classList.add('hidden');
    input.classList.remove('hidden');
    input.focus();
    input.select();
}

function saveName() {
    if (!isEditing) return;
    isEditing = false;
    
    const display = document.getElementById('pokemon-name');
    const input = document.getElementById('pokemon-name-edit');
    const newName = input.value.trim().toLowerCase();
    
    if (newName) {
        fetchPokemon(newName);
    }
    
    input.classList.add('hidden');
    display.classList.remove('hidden');
}

function checkEnter(event, type) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (type === 'id') {
            saveId();
        } else if (type === 'name') {
            saveName();
        }
    }
}

const fetchPokemon = async (identificadorPokemon) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identificadorPokemon}`);
        
        if (!response.ok) throw new Error('Pokemon não encontrado');
        
        const pokemon = await response.json();
        
        const descResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${identificadorPokemon}`);
        if (!descResponse.ok) throw new Error('Descrição não encontrada');
        
        const pokemonSpecies = await descResponse.json();
        
        preencherPokemonInfo(pokemon, pokemonSpecies);
        
        document.getElementById('msg-erro').classList.add('hidden');
        
    } catch (error) {
        exibirErro();
    }
};

const preencherPokemonInfo = (pokemon, pokemonSpecies) => {
    const sprite = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    document.getElementById('pokemon-img').src = sprite;
    
    document.getElementById('pokemon-name').textContent = pokemon.name.toUpperCase();
    document.getElementById('pokemon-id-display').textContent = `#${pokemon.id.toString().padStart(4, '0')}`;
    
    document.getElementById('pokemon-height').textContent = `${pokemon.height / 10}M`;
    document.getElementById('pokemon-weight').textContent = `${pokemon.weight / 10}KG`;
    document.getElementById('pokemon-type').textContent = pokemon.types.map(typeInfo => typeInfo.type.name.toUpperCase()).join(', ');
    
    const flavorEntry = pokemonSpecies.flavor_text_entries.find(
        entry => entry.language.name === "en"
    );
    
    document.getElementById('pokemon-description').textContent = flavorEntry
        ? flavorEntry.flavor_text.replace(/[\n\f]/g, ' ').toUpperCase()
        : "DESCRIÇÃO NÃO ENCONTRADA.";
    
    idAtual = pokemon.id;
    
    const primaryType = pokemon.types[0].type.name;
    updateBackgroundColor(primaryType);
};

function updateBackgroundColor(type) {
    const colors = {
        grass: 'bg-green-500',
        fire: 'bg-red-500',
        water: 'bg-blue-500',
        electric: 'bg-yellow-500',
        psychic: 'bg-pink-500',
        ice: 'bg-cyan-400',
        dragon: 'bg-purple-600',
        dark: 'bg-gray-800',
        fairy: 'bg-pink-300',
        normal: 'bg-gray-400',
        fighting: 'bg-red-700',
        poison: 'bg-purple-500',
        ground: 'bg-yellow-600',
        flying: 'bg-indigo-400',
        bug: 'bg-green-400',
        rock: 'bg-yellow-800',
        ghost: 'bg-purple-800',
        steel: 'bg-gray-500'
    };
    
    const body = document.body;
    Object.values(colors).forEach(color => body.classList.remove(color));
    body.classList.add(colors[type] || 'bg-green-500');
}

const exibirErro = () => {
    document.getElementById('msg-erro').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('msg-erro').classList.add('hidden');
    }, 3000);
};

document.getElementById('btn-previous').addEventListener('click', () => {
    const newId = idAtual > 1 ? idAtual - 1 : 1025;
    fetchPokemon(newId);
});

document.getElementById('btn-next').addEventListener('click', () => {
    const newId = idAtual < 1025 ? idAtual + 1 : 1;
    fetchPokemon(newId);
});

fetchPokemon(1);
