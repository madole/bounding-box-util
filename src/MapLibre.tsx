import React, { useEffect, useRef, useState } from "react";
import * as maplibre from "maplibre-gl";
import { LngLatLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box } from "@mui/material";

const MapContext = React.createContext<maplibre.Map | null>(null);

export const useMaplibreMap = () => {
  const maplibreMap = React.useContext(MapContext);
  if (!maplibreMap) {
    throw new Error("useMapLibreMap must be used within a MapLibreMapProvider");
  }
  return maplibreMap;
};

export interface MapLibreProps {
  center?: [number, number];
  children?: React.ReactNode;
  style?: typeof maplibre.Style | string;
  zoom?: number;
}

const defaultCenter: LngLatLike = [131.0369, -25.3444];
const defaultZoom = 2;

const MapLibreMap: React.FC<MapLibreProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { center = defaultCenter, zoom = defaultZoom, children, style } = props;
  const mapRef = useRef<maplibre.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    mapRef.current = new maplibre.Map({
      container: ref.current,
      style:
        "https://api.maptiler.com/maps/streets-v2/style.json?key=" +
        import.meta.env.VITE_MAP_TILER_API_KEY,
      center: [148.593018, -32.808904],
      zoom: 3, // starting zoom
    }).on("load", () => {
      setLoaded(true);
      if (window.location.search.includes("test-mode")) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.maplibre = mapRef.current;
        mapRef.current?.addControl(new maplibre.NavigationControl());
      }
    });
  }, [center, style, zoom]);

  return (
    <Box sx={{ height: "93vh", width: "100vw" }} ref={ref}>
      {loaded && (
        <MapContext.Provider value={mapRef.current}>
          {children}
        </MapContext.Provider>
      )}
    </Box>
  );
};

export default MapLibreMap;
