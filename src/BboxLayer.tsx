import { useEffect } from "react";
import { useMaplibreMap } from "./MapLibre.tsx";
import useStore from "./store.ts";
import { LngLatBoundsLike } from "maplibre-gl";
import bboxPolygon from "@turf/bbox-polygon";

const BboxLayer = () => {
  const map = useMaplibreMap();
  const bbox = useStore((state) => state.bbox);
  useEffect(() => {
    if (!map || !bbox) return;
    const coords = bbox.split(",").map((coord) => parseFloat(coord));
    const geojson = bboxPolygon(coords);
    map.addSource("bbox", {
      type: "geojson",
      data: geojson,
    });
    map.addLayer({
      id: "bbox",
      type: "line",
      source: "bbox",
      paint: {
        "line-color": "#088",
        "line-width": 4,
      },
    });
    map.fitBounds(coords as LngLatBoundsLike, { padding: 50 });
    return () => {
      if (map.getLayer("bbox")) {
        map.removeLayer("bbox");
      }
      if (map.getSource("bbox")) {
        map.removeSource("bbox");
      }
    };
  }, [map, bbox]);
  return null;
};

export default BboxLayer;
