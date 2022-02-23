import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { utils } from './services/utils-service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onRemovePlace = onRemovePlace;

function onInit() {
  mapService
    .initMap()
    .then(onPlace)
    .then(renderPlaces)
    .then(renderMarkers)
    .catch(() => console.log('Error: cannot init map'));
}

function onRemovePlace(id) {
  mapService.removePlace(id);
  renderPlaces();
  renderMarkers();
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
    };
    mapService.savePlace(place);
    renderPlaces();
    renderMarkers();
  });
}

function renderPlaces() {
  var places = mapService.getPlaces();
  var strHTMLs = places
    .map(place => {
      //   mapService.addMarker(place.position);
      return `
    <li>
        <p>${place.name}</p>
        <p>${place.createdAt}</p>
        <button onclick="onRemovePlace('${place.id}')">X</button>
        <button onclick="onPanTo('${place.position.lat}','${place.position.lng}')">Go</button>
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

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
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
  console.log('hi');
  const places = mapService.getPlaces();
  places.forEach(({ position }) => {
    mapService.addMarker(position);
  });
}

function onPanTo(lat, lng) {
  console.log('Panning the Map');
  mapService.panTo(lat, lng);
}
