//orders to pokeApi
const URL = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const isResOk = (res) => {
    if (!res.ok)
        throw new Error(res.status);
    return res.json()
};

//search pokemons with input
const search_pokemons = document.getElementById('search-pokemons')
const allPokemonContainer = document.getElementById('cards-content')
const redirectionLogin = document.getElementById('redirect_login')

//modal
const pokeContainerModal = document.getElementById('pokeBlock')
const pokeClose = document.getElementById('closeSpan')
//info Card
const poke_Img = document.getElementById('pokeImgs')
const modal_names = document.getElementById('pokemon-name')
const poke_Damage = document.getElementById('pokeDamage')
const poke_xp = document.getElementById('pokeXp')
const poke_hab = document.getElementById('pokeAbility')
const btn_choose = document.getElementById('color-target')
const poke_weight = document.getElementById('poke-weight')
const poke_color = document.getElementById('poke-color')
const poke_types = document.getElementById('pokeTypes')
const poke_description = document.getElementById('pokeDescription')
const poke_bio = document.getElementById('pokeBio')
const htmlScroll = document.getElementsByTagName('html')[0];
const user_profile = document.getElementById('user_profile')
const btn_ty = document.getElementsByClassName('btn_type')
const mtm_evolution = document.getElementById('mtm_evolution')
const poke_skill = document.getElementById('poke_skill')
const pokeAb = document.getElementsByClassName('list_deleted')
// user profile
const user_name = document.getElementById('user-name--cards')
const img_user = document.getElementById('profile-img--cards')
const getName = JSON.parse(localStorage.getItem('user-nick'))
const getPic = JSON.parse(localStorage.getItem('UserImg'))
const btn_select = document.getElementById('select-pokemon')
const preload_cards = document.getElementById('preload')
const poke_arr = []
const notEvolution = document.getElementById('notEv')

//img evolution
const getClassImg = document.getElementsByClassName("mtm")

function fetchDataPokemon() {
    fetch(URL)
        .then(res => isResOk(res))
        .then(data => {
            data.results.forEach(function (pokemon) {
                pokemonInformation(pokemon);
            });

        })
}

function pokemonInformation(pokemon) {
    let URL_INF = pokemon.url
    fetch(URL_INF)
        .then(res => res.json())
        .then(pokeData => {
            renderPokemon(pokeData);
        })
}

function createTypes(types, parent) {
    types.forEach(e => {
        let btn_type = document.createElement('p')
        btn_type.innerHTML = firstLetter(e.type.name)
        btn_type.classList.add('btn_type')
        parent.appendChild(btn_type)
    })
}

function createAbility(hab, parent) {
    hab.forEach(a => {
        let hability = document.createElement('p')
        hability.innerHTML = firstLetter(a.ability.name)
        hability.classList.add('list_deleted')
        parent.appendChild(hability)
    })
}

function poke_species(spc) {
    let spc_inf = spc.url
    fetch(spc_inf)
        .then(res => res.json())
        .then(b => {
            let bio_ifn = b.flavor_text_entries[1].flavor_text
            poke_bio.innerHTML = firstLetter(bio_ifn.toLowerCase())

            poke_evolution(b.evolution_chain)
        })
}

function poke_evolution(ev) {
    let infEvolution = ev.url
    fetch(infEvolution)
        .then(res => res.json())
        .then(v => {
            (v.chain.evolves_to[0] === undefined) ? notEvolution.style.display = "flex" : notEvolution.style.display = "none"
            getEvolution(v.chain.evolves_to, v.chain.evolves_to[0].evolves_to, v.chain.species.url)
        })
}

function getEvolution(v1, v2, v3) {
    fetchDataEvolution(v3)
    v1.forEach(x => fetchDataEvolution(x.species.url))
    v2.forEach(x => fetchDataEvolution(x.species.url))
}

function removeDuplicates(arr) {
    const poke = []
    arr.forEach((e) => {
        if (!poke.includes(e)) poke.push(e)
        if (poke.length >= 6) poke[4] = e, poke.pop()
    })

    localStorage.setItem('poke_inf', JSON.stringify(poke))
}

function removeElements(obj) { for (let i = obj.length - 1; i >= 0; --i) obj[i].remove() }

function renderPokemon(pokeData) {
    let countAbility = pokeData.abilities
    let countTypes = pokeData.types

    let id = pokeData.id

    if (id <= 9) {
        id = (`00${id}`);
    } else if (id <= 99) {
        id = (`0${id}`)
    } else {
        id = id
    }

    let pokeImg = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`

    let infCards = cards_generator(pokeData, id)
    
    allPokemonContainer.appendChild(infCards);

    search_pokemons.addEventListener('keyup', () => {
        let text = search_pokemons.value.toLowerCase()
        let pokenames = pokeData.name
        if (pokenames.indexOf(text) !== -1) {
            infCards.style.display = "flex";
        } else {
            infCards.style.display = "none";
        }
    })

    infCards.addEventListener('click', () => {
        (pokeAb.length === 1) ? poke_skill.innerHTML = "Skill" : poke_skill.innerHTML = "Skills"

        pokeContainerModal.style.display = 'flex'
        htmlScroll.style.overflow = 'hidden'
        poke_Img.src = pokeImg
        poke_Img.alt = pokeData.name
        modal_names.innerHTML = firstLetter(pokeData.name)
        poke_xp.innerHTML = `Experience: ${pokeData.base_experience} xp`
        poke_weight.innerHTML = `Weight: ${pokeData.weight} kg`
        btn_select.innerHTML = `Choose ${pokeData.name}`
        createTypes(countTypes, poke_types)
        createAbility(countAbility, poke_hab)
        poke_species(pokeData.species)

        btn_select.addEventListener("click", () => {
            poke_arr.push(pokeData.id)
            btn_select.innerHTML = `You have chosen ${pokeData.name} <span class="iconCheck"></span>`
            removeDuplicates(poke_arr)
        })
    })
}

pokeClose.addEventListener("click", () => {
    pokeContainerModal.style.display = 'none';
    htmlScroll.style.overflow = 'auto';
    poke_types.innerHTML = ""
    poke_hab.innerHTML = ""
    removeElements(getClassImg)
})

window.addEventListener("click", e => {
    if (e.target == pokeContainerModal) {
        pokeContainerModal.style.display = 'none';
        htmlScroll.style.overflow = 'auto';
        poke_types.innerHTML = ""
        poke_hab.innerHTML = ""
        removeElements(getClassImg)
    }
})

user_profile.addEventListener("click", () => location.href = "/pages/User-Profile/index.html")
redirectionLogin.addEventListener("click", () => location.href = "/#")

if (getPic === null) img_user.src = "/assets/img/Pokemon_Trainer_Boy.png"
if (img_user.src === "") img_user.src = getPic

user_name.innerText = getName

let preload = document.createElement('div')
preload.classList.add('preloader')
preload_cards.appendChild(preload)

fetchDataPokemon()

setTimeout(() => {
    allPokemonContainer.style.display = "flex"
    preload_cards.style.display = "none"
}, 2000);