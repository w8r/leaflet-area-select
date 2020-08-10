# leaflet-area-select [![npm version](https://badge.fury.io/js/leaflet-area-select.svg)](https://badge.fury.io/js/leaflet-area-select) [![CircleCI](https://circleci.com/gh/w8r/leaflet-area-select/tree/leaflet-1.0.svg?style=svg)](https://circleci.com/gh/w8r/leaflet-area-select/tree/leaflet-1.0)

Control to just select an area and provide bbox for it

## [Demo](http://w8r.github.io/leaflet-area-select/)

## Include

### Browserify, Webpack

```shell
npm install --save leaflet-area-select
```

```javascript
var SelectArea = require('leaflet-area-select');
// or
import SelectArea from 'leaflet-area-select';
```

### Browser
```html
<script type="text/javascript" src="path/to/Map.SelectArea.min.js"></script>
```

## Usage

Including the handler into the project will automatically add it to the `L.Map`,
so to enable/disable it you can use methods:

```javascript
let map = new L.Map('map', {
  selectArea: true // will enable it by default
});

// or
map.selectArea.enable();

map.on('areaselected', (e) => {
  console.log(e.bounds.toBBoxString()); // lon, lat, lon, lat
});

// You can restrict selection area like this:
const bounds = map.getBounds().pad(-0.25); // save current map bounds as restriction area
// check restricted area on start and move
map.selectArea.setValidate((layerPoint) => {
  return bounds.contains(
    this._map.layerPointToLatLng(layerPoint)
  );
});

// now switch it off
map.selectArea.setValidate();

```

### Key-strokes

```javascript
// dragging will be enabled and you can
// start selecting with Ctrl key pressed
map.selectArea.setCtrlKey(true);

// box-zoom will be disabled and you can
// start selecting with Shift key pressed
map.selectArea.setCtrlKey(true);

```

## License

MIT
