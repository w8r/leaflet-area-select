const L = global.L;
import Select from '../../';

// map
let map = global.map = new L.Map('map', {
  selectArea: true
})
  .setView([22.42658, 114.1452], 11);

// tiles layer
let tiles = L.tileLayer(
      'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">' +
                   'OpenStreetMap</a> contributors, &copy; ' +
                   '<a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

// geojson layer
let gj = global.gj = L.geoJson(require('../data/data.json'), {
  style: (feature) => {
    return {
      color: '#ff0000',
      radius: 2,
      opacity: 0.7,
      weight: 1.5
    }
  },
  pointToLayer: (feature, latlng) => {
    return L.circleMarker(latlng, {
      radius: 2,
      color: '#0ff',
      opacity: 0.7
    });
  }
}).addTo(map);

// create button
var button = L.DomUtil.create('div',
  'leaflet-control leaflet-bar leaflet-select-control',
  map._controlCorners.topleft);
button.innerHTML = '<div class="icon"></div>';

function areaSelectToggled() {
  if (map.selectArea.enabled()) {
    L.DomUtil.removeClass(button, 'active');
    map.selectArea.disable();
  } else {
    L.DomUtil.addClass(button, 'active');
    map.selectArea.enable();
  }
}

function updateButton() {
  L.DomUtil[map.selectArea.enabled() ? 'addClass' : 'removeClass'](
    button, 'active');
}

// activate
L.DomEvent.on(button, 'click', areaSelectToggled);

let result = document.querySelector('.info .result');
// on select
map.on({
  'areaselected': (evt) => {
    L.Util.requestAnimFrame(() => {
      map.eachLayer((pointLayer) => {
        if (pointLayer instanceof L.CircleMarker) {
          pointLayer.setStyle({
            color: evt.bounds.contains(pointLayer.getLatLng()) ? '#0f0' : '#f00'
          });
        }
      });
    });
    result.innerHTML = `<pre>${evt.bounds.toBBoxString().split(',').join(',\n')}</pre>`;
  },
  'areaselecttoggled': updateButton
});

let restriction = null;
function toggleRestriction() {
  if(restriction) {
    map.removeLayer(restriction);
    map.selectArea.setValidate();
    restriction = null;
  } else {
    const bounds = map.getBounds().pad(-0.25);
    restriction = L.rectangle(bounds, {
      weight: 2,
      color: '#0ff',
      fillOpacity: 0,
      clickable: false,
      opacity: 0.7
    }).addTo(map);
    map.selectArea.setValidate(function (p) {
      return bounds.contains(this._map.layerPointToLatLng(p));
    });
  }
}

function toggleCtrlKey() {
  map.selectArea.setControlKey(document.querySelector('#ctrl-key').checked);
}

function toggleShiftKey() {
  map.selectArea.setShiftKey(document.querySelector('#shift-key').checked);
}

L.DomEvent.on(document.querySelector('#restriction'), 'change', toggleRestriction);
//L.DomEvent.on(document.querySelector('#shift-key'), 'change', toggleShiftKey);
L.DomEvent.on(document.querySelector('#ctrl-key'), 'change', toggleCtrlKey);

// enable
updateButton();
toggleRestriction();
