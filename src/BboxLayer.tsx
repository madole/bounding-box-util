import { useEffect } from "react";
import { useMaplibreMap } from "./MapLibre.tsx";
import useStore from "./store.ts";
import bbox from "@turf/bbox";
import { parseBbox } from "./parseBbox.tsx";

const BboxLayer = () => {
  const map = useMaplibreMap();
  const boundingBox = useStore((state) => state.bbox);
  useEffect(() => {
    if (!map || !boundingBox) return;
    const { bboxGeometry, originalGeometry, newBbox } = parseBbox(boundingBox);

    map.addSource("bbox", {
      type: "geojson",
      data: bboxGeometry,
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
    const fitBbox =
      boundingBox.type === "bbox_string" ? newBbox : bbox(boundingBox.data);
    map.fitBounds(fitBbox, { padding: 50 });

    if (originalGeometry) {
      map.addSource("original", {
        type: "geojson",
        data: originalGeometry,
      });
      map.addLayer({
        id: "original",
        type: "line",
        source: "original",
        paint: {
          "line-color": "#f00",
          "line-width": 4,
        },
      });
    }
    return () => {
      if (map.getLayer("bbox")) {
        map.removeLayer("bbox");
      }
      if (map.getSource("bbox")) {
        map.removeSource("bbox");
      }
      if (map.getLayer("original")) {
        map.removeLayer("original");
      }
      if (map.getSource("original")) {
        map.removeSource("original");
      }
    };
  }, [map, boundingBox]);
  return null;
};

export default BboxLayer;
