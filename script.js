const nextBtn = document.getElementById('next')
const prevBtn = document.getElementById('previous')
const form = document.getElementById('search-form')
const planetSearch = document.getElementById('search')
const planetsTable = document.getElementById('planets')
const planetDetails = document.getElementById('planet-details')
const residentsTable = document.getElementById('residents')
const residentDetails = document.getElementById('residents-details')

const apiUrl = 'https://swapi.dev/api/planets/'

let currentPageUrl = 'https://swapi.dev/api/planets/'
let nextPageUrl = null
let prevPageUrl = null

const getData = async (url) => {
  const response = await fetch(url)
  const data = await response.json()

  return data
}

const createTableCell = (content) => {
  const td = document.createElement('td');
  td.textContent = content;
  return td;
};

const renderPlanetButton = (planet) => {
  const row = document.createElement('tr');

  const name = createTableCell(planet.name);
  name.style.cursor = 'pointer';

  const climate = createTableCell(planet.climate);
  const population = createTableCell(planet.population);
  const terrain = createTableCell(planet.terrain);


  name.addEventListener('click', async () => {
    residentDetails.innerHTML = '';

    try {
      const residents = await Promise.all(
        planet.residents.map((residentUrl) => fetch(residentUrl).then(res => res.json()))
      );

      if (residents.length > 0) {
        residents.forEach((resident) => {
          const row = document.createElement('tr');
  
          const residentElement = createTableCell(resident.name);
  
          row.appendChild(residentElement);
  
          residentDetails.appendChild(row);
        });
      }

    } catch (error) {
      console.error('Erro ao buscar os residentes:', error);
    }
  });

  row.appendChild(name);
  row.appendChild(climate);
  row.appendChild(population);
  row.appendChild(terrain);

  planetDetails.appendChild(row);
};

const showPlanets = async (url) => {

  try {
    const data = await getData(url)

    nextPageUrl = data.next
    prevPageUrl = data.previous
    
    nextBtn.disabled = !nextPageUrl
    prevBtn.disabled = !prevPageUrl

    data.results.forEach(planet => {
      renderPlanetButton(planet)
    })
  } catch (err) {
    console.error(err)
  }
}

nextBtn.addEventListener('click', () => {
  if (nextPageUrl) {
    planetDetails.innerHTML = ''
    residentDetails.innerHTML = ''
    showPlanets(nextPageUrl)
  }
})

prevBtn.addEventListener('click', () => {
  if (prevPageUrl) {
    planetDetails.innerHTML = ''
    residentDetails.innerHTML = ''
    showPlanets(prevPageUrl)
  }
})

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const data = await getData(`https://swapi.dev/api/planets/?search=${planetSearch.value}`)
  planetDetails.innerHTML = ''
  residentDetails.innerHTML = ''
  planetSearch.value = ''
  currentPageUrl = 'https://swapi.dev/api/planets/'

    data.results.forEach(planet => {
      renderPlanetButton(planet)
    })
})

showPlanets(currentPageUrl)