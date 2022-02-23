import { storage } from './storage-service.js';
export const mapService = {
  initMap,
  addMarker,
  panTo,
  savePlace,
  getPlaces,
  removePlace,
};

const PLACES_KEY = 'placesDB';
var gMap;
var gPlaces = storage.load(PLACES_KEY) || [];

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap');

  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    console.log('Map!', gMap);
    return gMap;
  });
}

function removePlace(id){
  var idx = gPlaces.findIndex(place => place.id === id)
  gPlaces.splice(idx , 1)
  storage.save(PLACES_KEY, gPlaces);
}

// function getPlace(id) {
//   var place = gPlaces.find(place => place.id === id)
//   return {
//     lat: place.lat,
//     lng: place.lan,
//   }
// }

function getPlaces() {
  return gPlaces;
}

function savePlace(place) {
  gPlaces.push(place);
  storage.save(PLACES_KEY, gPlaces);
  console.log(gPlaces);
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });
  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyCXIuYnEwB0nApadyuf5XR1uGXg0RmbQWg';
  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}
