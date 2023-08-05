import { useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import useStore from "./store.ts";

type Type = "wkt" | "geojson" | "bbox_string";
const Modal = () => {
  const [modalOpen, setModalOpen, setBbox] = useStore((state) => [
    state.modalOpen,
    state.setModalOpen,
    state.setBbox,
  ]);
  const [type, setType] = useState<Type>("bbox_string");
  const handleClose = () => setModalOpen(false);
  const handleCreateBoundingBox = () => {
    setModalOpen(false);
  };
  const handleViewBbox = () => {
    const geometry = ref.current?.value ?? ref.current?.innerText;
    if (
      type === "bbox_string" &&
      typeof geometry === "string" &&
      geometry.length > 0
    ) {
      setBbox({ type: "bbox_string", data: geometry });
    }
    if (
      type === "geojson" &&
      typeof geometry === "string" &&
      geometry.length > 0
    ) {
      try {
        const parsed = JSON.parse(geometry);
        setBbox({ type: "geojson", data: parsed });
      } catch (error) {
        console.error(error);
      }
    }
    setModalOpen(false);
  };
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>();

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
          <FormControl
            sx={{ paddingBottom: "1em" }}
            variant="outlined"
            fullWidth
          >
            <InputLabel htmlFor="uncontrolled-native" variant={"outlined"}>
              Select an Input Type
            </InputLabel>
            <Select
              label={"Select an Input Type"}
              value={type}
              onChange={(e) => {
                const value = e.target.value as Type;
                setType(value);
              }}
              inputProps={{
                name: "type",
                id: "uncontrolled-native",
              }}
            >
              <MenuItem value={"bbox_string"}>
                Comma Separated Bounding Box
              </MenuItem>
              <MenuItem value={"geojson"}>Geojson</MenuItem>
              {/*<MenuItem value={"wkt"}>Well Known Text</MenuItem>*/}
            </Select>
          </FormControl>
          {type === "bbox_string" && (
            <>
              <DialogContentText>
                Pop in a comma separated list of coordinates to create a
                bounding box
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
            </>
          )}
          {type === "geojson" && (
            <>
              <DialogContentText>
                Paste your geojson in here to get the bounding box
              </DialogContentText>
              <Input
                type={"textarea"}
                style={{ width: "100%", minHeight: "2em" }}
                autoFocus={true}
                inputRef={ref}
                minRows={5}
                multiline
              />
            </>
          )}
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
