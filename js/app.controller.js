import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { utils } from './services/utils-service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onRemovePlace = onRemovePlace;
window.onUserLocation = onUserLocation;
window.onSearch = onSearch;
window.onCopy = onCopy;

function onInit() {
  mapService
    .initMap()
    .then(onPlace)
    .then(renderPlaces)
    .then(renderMarkers)
    .then(setMapCenter)
    .catch(() => console.log('Error: cannot init map'));
}

function getWeather(lat = 3.1, lng = 3.1) {
  return axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${3.1}&lon=${3.1}&appid=7f39afb3e8f5aa7214049415f30eabb1`
    )
    .then(res => res.data.weather[0].description)
    .then(onGetWeather)
    .catch(err => console.log(err));
}

console.log(getWeather());
function onGetWeather(weather) {
  return weather;
}

function setMapCenter() {
  var link = location.href;
  var str = link.substring(link.indexOf('?') + 1);
  var usp = new URLSearchParams(str);
  var pos = {
    lat: +usp.get('lat'),
    lng: +usp.get('lng'),
  };
  if (pos.lat === 0 && pos.lng === 0) return;

  mapService.panTo(pos.lat, pos.lng);
}

function onRemovePlace(id) {
  mapService.removePlace(id);
  renderPlaces();
}

function onPlace(map) {
  map.addListener('click', mapsMouseEvent => {
    var place = {
      name: prompt('Enter Location Name:'),
      id: utils.makeId(5),
      position: {
        lat: mapsMouseEvent.latLng.lat(),
        lng: mapsMouseEvent.latLng.lng(),
      },
      createdAt: utils.getTime(Date.now()),
      updatedAt: 0,
      wethear: 0,
    };
    mapService.savePlace(place);
    renderPlaces();
    onAddMarker(place.position);
  });
}

function renderPlaces() {
  var places = mapService.getPlaces();
  var strHTMLs = places
    .map(place => {
      return `
    <li>
        <p>${place.name}</p>
        <p>${place.createdAt}</p>
        <div>
        <button onclick="onRemovePlace('${place.id}')">X</button>
        <button onclick="onPanTo('${place.position.lat}','${place.position.lng}')">Go</button>
        </div>
    
        </li>`;
    })
    .join('');
  document.querySelector('.places-table').innerHTML = strHTMLs;
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker(position) {
  console.log('Adding a marker');
  mapService.addMarker(position);
}

function onGetLocs() {
  locService.getLocs().then(locs => {
    console.log('Locations:', locs);
    document.querySelector('.locs').innerText = JSON.stringify(locs);
  });
}

function onGetUserPos() {
  getPosition()
    .then(pos => {
      console.log(pos.coords.latitude);
      console.log('User position is:', pos.coords);
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
    })
    .catch(err => {
      console.log('err!!!', err);
    });
}

function renderMarkers() {
  const places = mapService.getPlaces();
  places.forEach(({ position }) => {
    mapService.addMarker(position);
  });
}

function onPanTo(lat = 35.6895, lng = 139.6917) {
  console.log('Panning the Map');
  mapService.panTo(lat, lng);
}

function onUserLocation() {
  getPosition().then(mapService.showLocation);
}

function geocode(val) {
  axios
    .get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        key: 'AIzaSyCv9mke4qM6dFwfae-VsXNlKlW2Mnk4kBk',
      },
    })
    .then(res => res.data.results[0].geometry.location)
    .then(res => onPanTo(res.lat, res.lng));
}

function onSearch() {
  var val = document.querySelector('input').value;
  geocode(val); // onPlace(map)
}

function onCopy() {
  var { lat, lng } = mapService.getCenter();
  console.log(lat, lng);
  navigator.clipboard.writeText(
    `https://oxyhertz.github.io/travel-trip/index.html?lat=${lat}&lng=${lng}`
  );
}
