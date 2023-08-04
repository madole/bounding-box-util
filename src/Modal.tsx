import { useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import useStore from "./store.ts";

const Modal = () => {
  const [modalOpen, setModalOpen, setBbox] = useStore((state) => [
    state.modalOpen,
    state.setModalOpen,
    state.setBbox,
  ]);
  const handleClose = () => setModalOpen(false);
  const handleCreateBoundingBox = () => {
    setModalOpen(false);
  };
  const handleViewBbox = () => {
    const bbox = ref.current?.value;
    setModalOpen(false);
    if (typeof bbox === "string" && bbox.length > 0) {
      setBbox(bbox);
    }
  };
  const ref = useRef<HTMLInputElement>();

  return (
    <Dialog open={modalOpen} onClose={handleClose}>
      <DialogTitle>Create or Display bounding box</DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding="1em"
        >
          <Button onClick={handleCreateBoundingBox} variant={"contained"}>
            Create a bounding box
          </Button>
        </Box>
        <Divider variant="inset" />
        <Box padding="1em">
          <DialogContentText>
            Pop in a comma separated list of coordinates to create a bounding
            box
          </DialogContentText>
          <TextField
            inputRef={ref}
            autoFocus
            margin="dense"
            id="name"
            label="Bounding Box"
            type="string"
            fullWidth
            variant="standard"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleViewBbox}>View Bounding Box</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
