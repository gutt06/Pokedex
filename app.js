document.addEventListener('DOMContentLoaded', ()=>{
    const pesquisar = document.getElementById('pesquisar');
    const btnPesquisar = document.getElementById('btn-pesquisar');
    const btnAnterior = document.getElementById('btn-previous');
    const btnProximo = document.getElementById('btn-next');
    const pokemonInfo = document.getElementById('pokemon-info');
    const btnsNav = document.querySelector('.btns-nav');
    const pokemonImg = document.getElementById('pokemon-img');
    const pokemonNome = document.getElementById('pokemon-name');
    const pokemonDesc = document.getElementById('pokemon-desc');
    const msgErro = document.getElementById('msg-erro');
    let idAtual = 1;

    const fetchPokemon = async (identificadorPokemon) => {
        try{
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identificadorPokemon}`);

            if(!response.ok) throw new Error('Pokemon não encontrado');

            const pokemon = await response.json();
            preencherPokemonInfo(pokemon);
            msgErro.classList.add('hidden');
            pokemonInfo.classList.remove('hidden');
            btnsNav.classList.remove('hidden');
        } catch(error){
            exibirErro();
        } finally{

        }
    };

    const preencherPokemonInfo = (pokemon) => {
        const sprite = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
        pokemonImg.src = sprite;
        pokemonNome.textContent = `${pokemon.name} (#${pokemon.id})`;
        pokemonDesc.textContent = `
        Altura: ${pokemon.height / 10}m
        | Peso: ${pokemon.weight / 10}kg
        | Tipo: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}
        `;
        idAtual = pokemon.id; // atualiza o id do pokemon atual
        atualizarNavBtns(); // atualiza o estado dos botoes de navegação
    };

    const exibirErro = () => {
        pokemonNome.textContent = '';
        pokemonDesc.textContent = '';
        pokemonImg.src = '';
        msgErro.classList.remove('hidden');
        pokemonInfo.classList.add('hidden');
        btnsNav.classList.add('hidden');
    };
    
    const atualizarNavBtns = () => {
        //btnAnterior.disabled = (idAtual <= 1); // true ou false
    };

    const atualizarBtnPesquisar = () => {
        btnPesquisar.disabled = !pesquisar.value.trim();
    };

    btnPesquisar.addEventListener('click', () => {
        const query = pesquisar.value.trim().toLowerCase();
        if(query){
            fetchPokemon(query);
        }
    });

    pesquisar.addEventListener('input', atualizarBtnPesquisar);

    pesquisar.addEventListener('keypress', (event) => {
        if(event.key === 'Enter') {
            btnPesquisar.click();
        }
    });

    btnAnterior.addEventListener('click', () => {
        if(idAtual > 1) {
            fetchPokemon(idAtual - 1);
        } else {
            fetchPokemon(1025); // volta para o pokemon de id 1025
        }
    });

    btnProximo.addEventListener('click', () => {
       if (idAtual < 1025) {
        fetchPokemon(idAtual + 1);
        } else {
        fetchPokemon(1); // volta para o pokemon de id 1
        }
    });

    fetchPokemon(idAtual); // carregando o primeiro pokemon de id = 1 por padrão
    atualizarBtnPesquisar(); // desabilita o btn de busca inicialmente
});