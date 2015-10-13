"use strict";

var L = global.L || require('leaflet');

/**
 * @class  L.Map.SelectArea
 * @extends {L.Map.BoxZoom}
 */
export default class SelectArea extends L.Map.BoxZoom {

  /**
   * @static
   * @type {String}
   */
  static get AREA_SELECTED () {
    return 'areaselected';
  }

  static get AREA_SELECTION_TOGGLED () {
    return 'areaselecttoggled';
  }

  /**
   * @param  {L.Map} map
   * @constructor
   */
  constructor(map, shiftKey = false, validate, autoDisable) {
    super(map);

    /**
     * @type {Boolean}
     */
    this.shiftKey = shiftKey;

    /**
     * @type {Function}
     */
    this._validate = null;

    /**
     * @type {Boolean}
     */
    this._moved = false;

    /**
     * @type {Boolean}
     */
    this._autoDisable = false;

    /**
     * @type {L.Point}
     */
    this._lastLayerPoint = null;

    this.setValidate(validate);
    this.setAutoDisable(autoDisable);
  }

  /**
   * @param  {Function=} validate
   * @return {SelectArea}
   */
  setValidate (validate = (layerPoint) => true) {
    var handler = this;
    this._validate = (layerPoint) => {
      return validate.call(handler, layerPoint);
    }
    return this;
  }

  /**
   * @param {Boolean} autoDisable
   */
  setAutoDisable (autoDisable = false) {
    this._autoDisable = autoDisable;
  }

  /**
   * Disable dragging or zoombox
   * @param {Function=} validate
   * @param {Boolean=}  autoDisable
   */
  enable (validate, autoDisable) {
    if (this.shiftKey) {
      if (this._map.boxZoom) {
        this._map.boxZoom.disable();
      }
    } else {
      this._map.dragging.disable();
    }
    super.enable();
    this._beforeCrosshair = this._container.style.cursor;
    this._container.style.cursor = 'crosshair';

    this.setValidate(validate);
    this.setAutoDisable(autoDisable);

    this._map.fire(L.Map.SelectArea.AREA_SELECTION_TOGGLED);
  }

  /**
   * Also listen to ESC to cancel interaction
   * @override
   */
  addHooks () {
    super.addHooks();
    L.DomEvent.on(document, 'keyup', this._onKeyUp, this);
  }

  /**
   * @override
   */
  removeHooks () {
    super.removeHooks();
    L.DomEvent.off(document, 'keyup', this._onKeyUp, this);
  }

  /**
   * Re-enable box zoom or dragging
   */
  disable () {
    super.disable(this);
    this._container.style.cursor = this._beforeCrosshair;
    if (this.shiftKey) {
      if (this._map.boxZoom) {
        this._map.boxZoom.enable();
      }
    } else {
      this._map.dragging.enable();
    }

    this._map.fire(L.Map.SelectArea.AREA_SELECTION_TOGGLED);
  }

  /**
   * @override
   */
  _onMouseDown (e) {
    this._moved = false;
    this._lastLayerPoint = null;

    if ((this.shiftKey && !e.shiftKey) ||
      ((e.which !== 1) && (e.button !== 1))) {
      return false;
    }

    let layerPoint = this._map.mouseEventToLayerPoint(e);
    if(!this._validate(layerPoint)) {
      return false;
    }

    L.DomUtil.disableTextSelection();
    L.DomUtil.disableImageDrag();

    this._startLayerPoint = layerPoint;

    L.DomEvent
      .on(document, 'mousemove', this._onMouseMove, this)
      .on(document, 'mouseup', this._onMouseUp, this)
      .on(document, 'keydown', this._onKeyDown, this);
  }

  /**
   * @override
   */
  _onMouseMove (e) {
    if (!this._moved) {
      this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._pane);
      L.DomUtil.setPosition(this._box, this._startLayerPoint);

      //TODO refactor: move cursor to styles
      this._container.style.cursor = 'crosshair';
    }

    const startPoint = this._startLayerPoint;
    let box = this._box;

    const layerPoint = this._map.mouseEventToLayerPoint(e);
    const offset = layerPoint.subtract(startPoint);

    if (!this._validate(layerPoint)) return;
    this._lastLayerPoint = layerPoint;

    let newPos = new L.Point(
        Math.min(layerPoint.x, startPoint.x),
        Math.min(layerPoint.y, startPoint.y)
    );

    L.DomUtil.setPosition(box, newPos);

    this._moved = true;

    // TODO refactor: remove hardcoded 4 pixels
    box.style.width = (Math.max(0, Math.abs(offset.x) - 4)) + 'px';
    box.style.height = (Math.max(0, Math.abs(offset.y) - 4)) + 'px';
  }

  /**
   * General on/off toggle
   * @param  {KeyboardEvent} e
   */
  _onKeyUp (e) {
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
  _onMouseUp (e) {

    this._finish();

    const map = this._map;
    const layerPoint = this._lastLayerPoint; // map.mouseEventToLayerPoint(e);

    if (this._startLayerPoint.equals(layerPoint)) return;
    L.DomEvent.stop(e);

    let bounds = new L.LatLngBounds(
      map.layerPointToLatLng(this._startLayerPoint),
      map.layerPointToLatLng(layerPoint));

    //map.fitBounds(bounds);

    map.fire(L.Map.SelectArea.AREA_SELECTED, {
      bounds: bounds
    });

    if (this._autoDisable) this.disable();

    this._moved = false;
  }

}

// expose setting
L.Map.mergeOptions({
  'selectArea': false
});

// register hook
L.Map.addInitHook('addHandler', 'selectArea', SelectArea);

// expose
L.Map.SelectArea = SelectArea;
