var $container = document.querySelector(".container");
var $canvas;

async function loadData(){
    const listPokemon = await getPokemon();
    renderResponse(listPokemon);
}

async function getPokemon(){
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=6&offset=${((Math.random() * (200 - 1)) + 1)}`);
    const listPokemon = await response.json();
    return listPokemon;
}

async function renderResponse(listPokemon){
    for(let i = 0; i < listPokemon.results.length; i++){
        let pokemonData = await getPokemonByUrl(listPokemon.results[i].url);
        //crearElementos(pokemonData);
        createElements(pokemonData);
    }
}

async function getPokemonByUrl(url){
    const response = await fetch(url);
    const pokemonData = await response.json();
    return pokemonData;
}

function createElements(pokemonData){
    // Creamos el div contenerdor
    let container = document.createElement('div');
    container.className = 'card';

    // Creamos el contenedor de la imagen
    let canvasContainer = document.createElement('div');
    canvasContainer.style.height = '65%';
    
    // Creamos el canvas
    let canvas = document.createElement('canvas');
    canvas.width = '150';
    canvas.height = '150';
    let ctx = canvas.getContext('2d');

    // Creamos la imagen
    let image = new Image();
    image.setAttribute('src', `${pokemonData.sprites.front_default}`);
    image.setAttribute('crossOrigin', 'anonymous');
    

    image.addEventListener('load', () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        let listColor = getColor(ctx, canvas);
        if(listColor.length > 0){
            canvasContainer.style.backgroundColor = `rgba(${listColor[0].red}, ${listColor[0].green}, ${listColor[0].blue})`; 
            container.style.borderBottom = `5px solid rgba(${listColor[0].red}, ${listColor[0].green}, ${listColor[0].blue})`; 
        } else{
            let red = (((Math.random() * (255- 1)) + 1));
            let green = (((Math.random() * (255- 1)) + 1));
            let blue = (((Math.random() * (255- 1)) + 1));
            canvasContainer.style.backgroundColor = `rgba(${red}, ${green}, ${blue})`; 
            container.style.borderBottom = `5px solid rgba(${red}, ${green}, ${blue})`; 
        }
    });

    // Creamos el contenedor del nombre
    let name = document.createElement('p');
    name.innerHTML = `${pokemonData.name}`;
    name.className = 'font-bold';

    // Creamos el tipo
    let type = document.createElement('p');
    type.innerHTML = `Tipo: ${pokemonData.types[0].type.name}`;

    // Insertamos todo en el div contenedors
    canvasContainer.appendChild(canvas);
    container.appendChild(canvasContainer);
    container.appendChild(name);
    container.appendChild(type);
    $container.appendChild(container);   
}

function getColor(ctx, canvas){
    let imgColor = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    //console.log(imgColor);
    const quality = 95;
    let colors = [];
    for(let i = 0; i < (canvas.width * canvas.height); i = i + quality){
        const offset = i + 4;
        const alpha = imgColor[offset + 3];
        if(alpha > 0){
            const red = imgColor[offset];
            const green = imgColor[offset + 1];
            const blue = imgColor[offset + 2];
            colors.push({red, green, blue});
        }
        if(colors.length > 3){
            break;
        }
    }
    return colors;
}