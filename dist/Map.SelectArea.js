(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.L||(g.L = {}));g=(g.Control||(g.Control = {}));g.Select = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _srcMapSelectArea = require('./src/Map.SelectArea');

_defaults(exports, _interopExportWildcard(_srcMapSelectArea, _defaults));

},{"./src/Map.SelectArea":2}],2:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var L = global.L || require('leaflet');

/**
 * @class  L.Map.SelectArea
 * @extends {L.Map.BoxZoom}
 */

var SelectArea = (function (_L$Map$BoxZoom) {
  _inherits(SelectArea, _L$Map$BoxZoom);

  _createClass(SelectArea, null, [{
    key: 'AREA_SELECTED',

    /**
     * @static
     * @type {String}
     */
    get: function get() {
      return 'areaselected';
    }
  }, {
    key: 'AREA_SELECTION_TOGGLED',
    get: function get() {
      return 'areaselecttoggled';
    }

    /**
     * @param  {L.Map} map
     * @constructor
     */
  }]);

  function SelectArea(map, shiftKey, validate, autoDisable) {
    if (shiftKey === undefined) shiftKey = false;

    _classCallCheck(this, SelectArea);

    _get(Object.getPrototypeOf(SelectArea.prototype), 'constructor', this).call(this, map);

    this.shiftKey = shiftKey;

    this._moved = false;

    this.setValidate(validate);
    this.setAutoDisable(autoDisable);
  }

  // expose setting

  /**
   * @param  {Function=} validate
   * @return {SelectArea}
   */

  _createClass(SelectArea, [{
    key: 'setValidate',
    value: function setValidate() {
      var validate = arguments.length <= 0 || arguments[0] === undefined ? function (layerPoint) {
        return true;
      } : arguments[0];

      var handler = this;
      this._validate = function (layerPoint) {
        return validate.call(handler, layerPoint);
      };
      return this;
    }

    /**
     * @param {Boolean} autoDisable
     */
  }, {
    key: 'setAutoDisable',
    value: function setAutoDisable() {
      var autoDisable = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.autoDisable = autoDisable;
    }

    /**
     * Disable dragging or zoombox
     */
  }, {
    key: 'enable',
    value: function enable(validate, autoDisable) {
      if (this.shiftKey) {
        if (this._map.boxZoom) {
          this._map.boxZoom.disable();
        }
      } else {
        this._map.dragging.disable();
      }
      _get(Object.getPrototypeOf(SelectArea.prototype), 'enable', this).call(this);
      this._beforeCrosshair = this._container.style.cursor;
      this._container.style.cursor = 'crosshair';

      L.DomEvent.on(document, 'keydown', this._onKeyUp, this);
      this._map.fire(L.Map.SelectArea.AREA_SELECTION_TOGGLED);
    }

    /**
     * Re-enable box zoom or dragging
     */
  }, {
    key: 'disable',
    value: function disable() {
      _get(Object.getPrototypeOf(SelectArea.prototype), 'disable', this).call(this, this);
      this._container.style.cursor = this._beforeCrosshair;
      if (this.shiftKey) {
        if (this._map.boxZoom) {
          this._map.boxZoom.enable();
        }
      } else {
        this._map.dragging.enable();
      }
      L.DomEvent.on(document, 'keydown', this._onKeyUp, this);
      this._map.fire(L.Map.SelectArea.AREA_SELECTION_TOGGLED);
    }

    /**
     * @override
     */
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(e) {
      this._moved = false;

      if (this.shiftKey && !e.shiftKey || e.which !== 1 && e.button !== 1) {
        return false;
      }

      var layerPoint = this._map.mouseEventToLayerPoint(e);
      if (!this._validate(layerPoint)) {
        return false;
      }

      L.DomUtil.disableTextSelection();
      L.DomUtil.disableImageDrag();

      this._startLayerPoint = layerPoint;

      L.DomEvent.on(document, 'mousemove', this._onMouseMove, this).on(document, 'mouseup', this._onMouseUp, this).on(document, 'keydown', this._onKeyDown, this);
    }

    /**
     * @override
     */
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(e) {
      if (!this._moved) {
        this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._pane);
        L.DomUtil.setPosition(this._box, this._startLayerPoint);

        //TODO refactor: move cursor to styles
        this._container.style.cursor = 'crosshair';
      }

      var startPoint = this._startLayerPoint;
      var box = this._box;

      var layerPoint = this._map.mouseEventToLayerPoint(e);
      var offset = layerPoint.subtract(startPoint);

      if (!this._validate(layerPoint)) return;

      var newPos = new L.Point(Math.min(layerPoint.x, startPoint.x), Math.min(layerPoint.y, startPoint.y));

      L.DomUtil.setPosition(box, newPos);

      this._moved = true;

      // TODO refactor: remove hardcoded 4 pixels
      box.style.width = Math.max(0, Math.abs(offset.x) - 4) + 'px';
      box.style.height = Math.max(0, Math.abs(offset.y) - 4) + 'px';
    }

    /**
     * General on/off toggle
     * @param  {KeyboardEvent} e
     */
  }, {
    key: '_onKeyUp',
    value: function _onKeyUp(e) {
      if (e.keyCode === 27) {
        if (this._moved) {
          this._finish();
        }
        this.disable();
      }
    }

    /**
     * @override
     */
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(e) {

      this._finish();

      var map = this._map;
      var layerPoint = map.mouseEventToLayerPoint(e);

      if (this._startLayerPoint.equals(layerPoint)) {
        return;
      }

      L.DomEvent.stop(e);

      var bounds = new L.LatLngBounds(map.layerPointToLatLng(this._startLayerPoint), map.layerPointToLatLng(layerPoint));

      //map.fitBounds(bounds);

      map.fire(L.Map.SelectArea.AREA_SELECTED, {
        bounds: bounds
      });

      if (this.autoDisable) this.disable();

      this._moved = false;
    }
  }]);

  return SelectArea;
})(L.Map.BoxZoom);

exports['default'] = SelectArea;
L.Map.mergeOptions({
  'selectArea': false
});

// register hook
L.Map.addInitHook('addHandler', 'selectArea', SelectArea);

// expose
L.Map.SelectArea = SelectArea;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"leaflet":undefined}]},{},[1])(1)
});