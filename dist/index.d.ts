import * as Leaflet from "leaflet";

declare module "leaflet" {
  interface Map {
    /**
     * SelectArea options to pass when instantiating.
     */
    selectAreaOptions: SelectAreaOptions;

    /**
     * SelectArea instance.
     */
    selectArea: SelectArea;
  }

  interface MapOptions {
    /**
     * Whether to create a SelectArea instance at map init or not.
     */
    selectArea?: boolean | undefined;

    /**
     * Options to pass to SelectArea when instantiating.
     */
    selectAreaOptions?: SelectAreaOptions | undefined;
  }

  /**
   * Options to pass to SelectArea when instantiating.
   */
  interface SelectAreaOptions {
    /**
     * Enable selection with the shift key.
     */
    shiftKey?: boolean | undefined;

    /**
     * Enable selection with the ctrl key.
     */
    ctrlKey?: boolean | undefined;

    /**
     * Function to validate if the selection should proceed.
     */
    validate?: (layerPoint: Point) => boolean | undefined;

    /**
     * Automatically disable selection after a selection is made.
     */
    autoDisable?: boolean | undefined;

    /**
     * CSS cursor to use when the selection tool is active.
     */
    cursor?: string | undefined;
  }

  /**
   * SelectArea class definition.
   */
  interface SelectAreaStatic {
    new (map: Map, options: SelectAreaOptions): SelectArea;
  }

  /**
   * SelectArea instance methods and properties.
   */
  interface SelectArea extends Handler {
    /**
     * Options for the SelectArea instance.
     */
    options: SelectAreaOptions;

    /**
     * Set the validation function.
     * @param validate The validation function.
     * @returns The SelectArea instance.
     */
    setValidate(validate: (layerPoint: Point) => boolean): SelectArea;

    /**
     * Set whether to auto-disable the selection tool.
     * @param autoDisable Auto-disable setting.
     */
    setAutoDisable(autoDisable: boolean): void;

    /**
     * Enable or disable the control key for selection.
     * @param on Whether to enable the control key.
     */
    setControlKey(on: boolean): void;

    /**
     * Enable or disable the shift key for selection.
     * @param on Whether to enable the shift key.
     */
    setShiftKey(on: boolean): void;

    /**
     * Enable the selection tool.
     * @param validate Optional validation function.
     * @param autoDisable Optional auto-disable setting.
     */
    enable(
      validate?: (layerPoint: Point) => boolean,
      autoDisable?: boolean
    ): void;

    /**
     * Disable the selection tool.
     */
    disable(): void;
  }

  let SelectArea: SelectAreaStatic;

  interface SelectAreaEvent extends LeafletEvent {
    /**
     * The selected area bounds.
     */
    bounds: LatLngBounds;

    /**
     * The starting point of the selection.
     */
    start: Point;

    /**
     * The ending point of the selection.
     */
    end: Point;
  }

  interface LeafletEventHandlerFnMap {
    /**
     * Fired when the area selection is completed.
     */
    selectareaselected?: (event: SelectAreaEvent) => void | undefined;
    /**
     * Fired when the area selection starts.
     */
    selectareastart?: LeafletEventHandlerFn | undefined;

    /**
     * Fired when the area selection toggles on or off.
     */
    selectareatoggled?: LeafletEventHandlerFn | undefined;
  }
}
