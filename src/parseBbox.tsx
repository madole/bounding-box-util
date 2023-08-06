import { LngLatBoundsLike } from "maplibre-gl";
import bboxPolygon from "@turf/bbox-polygon";
import bbox from "@turf/bbox";
import { GeoJSON } from "geojson";
import { BBOXtype } from "./store.ts";

type ReturnType = {
  newBbox: LngLatBoundsLike;
  bboxGeometry: GeoJSON;
  originalGeometry?: GeoJSON;
};

export function parseBbox(boundingBox: BBOXtype): ReturnType {
  if (!boundingBox) {
    throw new Error("Invalid bbox");
  }
  const { type, data } = boundingBox;

  if (type === "bbox_string" && typeof data === "string") {
    const coords = data.split(",").map((coord) => parseFloat(coord));
    return {
      newBbox: coords as LngLatBoundsLike,
      bboxGeometry: bboxPolygon(coords),
    };
  } else if (type === "geojson" && typeof data === "object") {
    return {
      newBbox: bbox(data),
      bboxGeometry: bboxPolygon(bbox(data)),
      originalGeometry: data,
    };
  }
  throw new Error("Invalid type");
}
