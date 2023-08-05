import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useMaplibreMap } from "./MapLibre.tsx";
import { useEffect } from "react";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import useStore from "./store.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    line_string: true,
  },
  defaultMode: "draw_polygon",
});

const DrawingTools = () => {
  const map = useMaplibreMap();
  const completedDrawing = useStore((state) => state.completedDrawing);
  useEffect(() => {
    if (!map) return;
    // set document cursor to crosshairs
    map.getCanvas().style.cursor = "crosshair";

    const canvasElement = document.querySelector(
      ".maplibregl-canvas.mapboxgl-canvas",
    );
    if (canvasElement) {
      canvasElement.className = "mapboxgl-canvas maplibregl-canvas";
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    map.addControl(draw, "top-left");

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      map.removeControl(draw);
      map.getCanvas().style.cursor = "";
    };
  }, [map]);

  useEffect(() => {
    map.on("draw.create", () => {
      const geojson = draw.getAll();
      completedDrawing(geojson);
    });
  }, []);

  return null;
};

export default DrawingTools;
