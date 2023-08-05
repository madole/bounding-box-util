import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { FeatureCollection } from "geojson";

export type BBOXtype =
  | {
      type: "geojson";
      data: FeatureCollection;
    }
  | {
      type: "bbox_string";
      data: string;
    }
  | {
      type: "wkt";
      data: string;
    }
  | null;

type Store = {
  bbox: BBOXtype;
  setBbox: (newBbox: BBOXtype) => void;
  modalOpen: boolean;
  setModalOpen: (newModalOpen: boolean) => void;
  clearState: () => void;
  drawingModeActive: boolean;
  activeDrawingMode: () => void;
  completedDrawing: (boundingBox: FeatureCollection) => void;
};
const useStore = create(
  devtools<Store>(
    (set) => ({
      bbox: null,
      setBbox: (newBbox: BBOXtype) => set({ bbox: newBbox }, false, "setBbox"),
      modalOpen: true,
      setModalOpen: (newModalOpen: boolean) =>
        set({ modalOpen: newModalOpen }, false, "setModalOpen"),
      clearState: () =>
        set({ bbox: null, modalOpen: true }, false, "clearState"),
      drawingModeActive: false,
      setDrawingModeActive: (newDrawingModeActive: boolean) =>
        set(
          { drawingModeActive: newDrawingModeActive },
          false,
          "setDrawingModeActive",
        ),
      completedDrawing: (boundingBox: FeatureCollection) =>
        set(
          {
            bbox: { type: "geojson", data: boundingBox },
            drawingModeActive: false,
          },
          false,
          "completedDrawing",
        ),
      activeDrawingMode: () =>
        set(
          { drawingModeActive: true, modalOpen: false },
          false,
          "activeDrawingMode",
        ),
    }),
    { name: "store", serialize: { options: true } },
  ),
);

export default useStore;
