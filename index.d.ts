import * as Leaflet from "leaflet";

declare module "leaflet" {
  /*
   * Leaflet.selectArea add options and events to the `L.Map` object.
   * See `SelectArea` events for the list of events fired on the Map.
   */
  interface Map {
    /**
     * Whether to create a L.selectArea instance at map init or not.
     */
    selectArea: boolean;

    /**
     * Options to pass to L.selectArea when instanciating.
     */
    selectAreaOptions: SelectAreaOptions;

    /**
     * Select tools instance.
     */
    selectAreaTools: SelectArea;
  }

  /**
   * Add to the MapOptions.
   */
  interface MapOptions {
    /**
     * Whether to create a L.selectArea instance at map init or not.
     */
    selectArea: boolean;

    /**
     * Options to pass to L.selectArea when instanciating.
     */
    selectOptions: SelectAreaOptions;

    /**
     * Select tools instance.
     */
    selectTools: SelectArea;
  }

  /**
   * Make areas selectable in Leaflet.
   */
  interface SelectAreaStatic {
    new (map: Map, options: SelectAreaOptions): SelectArea;
  }

  /**
   * Options to pass to L.selectArea when instanciating.
   */
  interface SelectAreaOptions {
    /**
     * Whether the control key has to be pressed to start a selection
     */
    cntlKey?: boolean;
    
    /**
     * Whether the shift key has to be pressed to start a selection
     */
    shiftKey?: boolean;

    /**
     * Whether the alt key has to be pressed to start a selection
     */
    altKey?: boolean;

    /**
     * Whether to validate the selection before ending it
     */
    validate?: boolean;
  }

  /**
   * Make areas selectable in Leaflet.
   *
  */
  interface SelectArea extends Evented {
    /**
     * Enable selection, by creating if not existing, and then calling enable on it.
     */
    enable(map?: Map): void;

    /**
     * Disable selection, also remove the property reference.
     */
    disable(): void;

    /**
     * Enable or disable selection, according to current status.
     */
    toggle(): void;

    /**
     * Return true if current instance has an selector attached, and this selector is enabled.
     */
    enabled(): boolean;
  }

  /**
   * Extend the existing event handler function map,
   * to include
   */
  interface LeafletEventHandlerFnMap {
    /**
     * Fired when a selection is started.
     */
    "select:start"?: LeafletMouseEvent | undefined;
    /**
     * Fired when a selection is ended.
     */
    "select:end"?: LeafletMouseEvent | undefined;
    /**
     * Fired when the the bbox is available
     */
    "select:bbox"?: LeafletEventHandlerFn | undefined;
  }

  /*
   * Extend Evented to add new events.
   */
  interface Evented {
    on(
      type: "select:start" | "select:end",
      fn: LeafletMouseEvent,
      context?: any,
    ): this;
    on(
      type: "select:area",
      fn: (event: LeafletEventHandlerFn) => void,
      context?: any,
    ): this;
  }
}
