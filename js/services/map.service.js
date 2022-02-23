import { storage } from './storage-service.js';
export const mapService = {
  initMap,
  addMarker,
  panTo,
  savePlace,
  getPlaces,
  removePlace,
  showLocation,
  getCenter,
  // getWeather,
};

const PLACES_KEY = 'placesDB';
const MARKERS_KEY = 'markersDB';
var gMap;
var gPlaces = storage.load(PLACES_KEY) || [];
var gMarkers = [];

function initMap(lat = 32.0749831, lng = 34.9120554) {
  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    return gMap;
  });
}
// function getWeather(lat = 3.1, lng=3.1) {
//   axios.get(`api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=7f39afb3e8f5aa7214049415f30eabb1`)
//   .then(res => console.log(res.data))
//   .catch(err => console.log(err))
// }

function getCenter() {
  //   console.log(gMap.getCenter().lat());
  return {
    lat: gMap.getCenter().lat(),
    lng: gMap.getCenter().lng(),
  };
}

function removePlace(id) {
  var idx = gPlaces.findIndex(place => {
    return place.id === id;
  });
  gPlaces.splice(idx, 1);
  storage.save(PLACES_KEY, gPlaces);
  removeMarker(idx);
}

function removeMarker(idx) {
  console.log(idx);
  gMarkers[idx].setMap(null);
  gMarkers.splice(idx, 1);
  console.log(gMarkers);
}

function showLocation(position) {
  gMap.setCenter({
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  });
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
    animation: google.maps.Animation.DROP,
  });
  gMarkers.push(marker);
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
