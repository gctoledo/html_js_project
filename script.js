const planetsDiv = document.getElementById('planets')
const nextBtn = document.getElementById('next')
const prevBtn = document.getElementById('previous')

const apiUrl = 'https://swapi.dev/api/planets/'

let currentPageUrl = 'https://swapi.dev/api/planets/'
let nextPageUrl = null
let prevPageUrl = null
let currentPage = 1

const showPlanets = async (url) => {

  try {
    const response = await fetch(url)
    const data = await response.json()

    nextPageUrl = data.next
    prevPageUrl = data.previous
    
    nextBtn.disabled = !nextPageUrl
    prevBtn.disabled = !prevPageUrl

    planetsDiv.innerHTML = ''

    data.results.forEach(planet => {
      const planetButton = document.createElement('button')
      planetButton.textContent = planet.name
      planetButton.id = planet.name
      planetButton.className = 'planet-button'

      planetsDiv.appendChild(planetButton)
    })
  } catch (err) {
    console.error(err)
  }
}

nextBtn.addEventListener('click', () => {
  if (nextPageUrl) {
    currentPage++
    showPlanets(nextPageUrl)
  }
})

prevBtn.addEventListener('click', () => {
  if (prevPageUrl) {
    currentPage--
    showPlanets(prevPageUrl)
  }
})

showPlanets(currentPageUrl)