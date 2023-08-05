import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GeoJSONFeature } from "maplibre-gl";

type BBOXtype =
  | {
      type: "geojson";
      data: GeoJSONFeature;
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
    }),
    { name: "store", serialize: { options: true } },
  ),
);

export default useStore;
