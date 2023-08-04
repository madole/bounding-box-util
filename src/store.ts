import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Store = {
  bbox: string | null;
  setBbox: (newBbox: string) => void;
  modalOpen: boolean;
  setModalOpen: (newModalOpen: boolean) => void;
  clearState: () => void;
};
const useStore = create(
  devtools<Store>(
    (set) => ({
      bbox: null,
      setBbox: (newBbox: string) => set({ bbox: newBbox }, false, "setBbox"),
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
