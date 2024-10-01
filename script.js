const planetsDiv = document.getElementById('planets')
const nextBtn = document.getElementById('next')
const prevBtn = document.getElementById('previous')
const form = document.getElementById('search-form')
const planetDetails = document.getElementById('planet-details')
const planetName = document.getElementById('search')

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
      <h2>Nome: ${planet.name}</h2>
      <p>Clima: ${planet.climate}</p>
      <p>População: ${planet.population}</p>
      <p>Terreno: ${planet.terrain}</p>
    `
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
    showPlanets(nextPageUrl)
  }
})

prevBtn.addEventListener('click', () => {
  if (prevPageUrl) {
    currentPage--
    planetDetails.innerHTML = ''
    showPlanets(prevPageUrl)
  }
})

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const data = await getData(`https://swapi.dev/api/planets/?search=${planetName.value}`)
  planetsDiv.innerHTML = ''
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