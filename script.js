const planetsDiv = document.getElementById('planets')

const apiUrl = 'https://swapi.dev/api/planets/'

let currentPageUrl = 'https://swapi.dev/api/planets/'

const showPlanets = async (url) => {

  try {
    const response = await fetch(url)
    const data = await response.json()

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

showPlanets(currentPageUrl)