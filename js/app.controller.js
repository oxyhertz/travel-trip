import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { utils } from './services/utils-service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;

function onInit() {
  mapService
    .initMap()
    .then(onPlace)
    .catch(() => console.log('Error: cannot init map'));
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
    };
    mapService.savePlace(place);
    renderPlaces();
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
    </li>


      `;
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
function onPanTo() {
  console.log('Panning the Map');
  mapService.panTo(35.6895, 139.6917);
}
