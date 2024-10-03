const planetsDiv = document.getElementById('planets')
const nextBtn = document.getElementById('next')
const prevBtn = document.getElementById('previous')
const form = document.getElementById('search-form')
const planetName = document.getElementById('search')
const planetDetails = document.getElementById('planet-details')
const residentDetails = document.getElementById('resident-details')

const apiUrl = 'https://swapi.dev/api/planets/'

let currentPageUrl = 'https://swapi.dev/api/planets/'
let nextPageUrl = null
let prevPageUrl = null
let currentPage = 1

const getData = async (url) => {
  const response = await fetch(url)
  const data = await response.json()

  return data
}

const renderPlanetButton = (planet) => {
  const planetButton = document.createElement('button')
  planetButton.textContent = planet.name
  planetButton.id = planet.name
  planetButton.className = 'planet-button'

  planetButton.addEventListener('click', () => {
    planetDetails.innerHTML = ''
    planetDetails.innerHTML = `
      <p>Nome: ${planet.name}</p>
      <p>Clima: ${planet.climate}</p>
      <p>População: ${planet.population}</p>
      <p>Terreno: ${planet.terrain}</p>
    `

    residentDetails.innerHTML = ''
    residentDetails.innerHTML = '<h2>Residentes:</h2>'

    Promise.all(
      planet.residents.map((residentUrl) => {
          return fetch(residentUrl)
              .then(res => res.json());
      })
  )
  .then((residents) => {
      residents.forEach((resident) => {
          residentDetails.innerHTML += `
          <p>Nome: ${resident.name}</p>
          `;
      });
  })
  .catch((error) => {
      console.error('Erro ao buscar os residentes:', error);
  });
  })

  planetsDiv.appendChild(planetButton)
}

const showPlanets = async (url) => {

  try {
    const data = await getData(url)

    nextPageUrl = data.next
    prevPageUrl = data.previous
    
    nextBtn.disabled = !nextPageUrl
    prevBtn.disabled = !prevPageUrl

    planetsDiv.innerHTML = ''

    data.results.forEach(planet => {
      renderPlanetButton(planet)
    })
  } catch (err) {
    console.error(err)
  }
}

nextBtn.addEventListener('click', () => {
  if (nextPageUrl) {
    currentPage++
    planetDetails.innerHTML = ''
    residentDetails.innerHTML = ''
    showPlanets(nextPageUrl)
  }
})

prevBtn.addEventListener('click', () => {
  if (prevPageUrl) {
    currentPage--
    planetDetails.innerHTML = ''
    residentDetails.innerHTML = ''
    showPlanets(prevPageUrl)
  }
})

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const data = await getData(`https://swapi.dev/api/planets/?search=${planetName.value}`)
  planetsDiv.innerHTML = ''
  planetDetails.innerHTML = ''
  residentDetails.innerHTML = ''
  planetName.value = ''

  if (data.results.length > 0) {
    data.results.forEach(planet => {
      renderPlanetButton(planet)
    })
  } else {
    planetsDiv.innerHTML = 'Nenhum planeta encontrado'
  }
})

showPlanets(currentPageUrl)