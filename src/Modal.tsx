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
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import useStore from "./store.ts";
import DrawIcon from "@mui/icons-material/Draw";
import geojsonValidation from "geojson-validation";
import { kml as kmlToGeojson } from "@mapbox/togeojson";
import { arcgisToGeoJSON } from "@esri/arcgis-to-geojson-utils";
import wellknown from "wellknown";
import { Feature } from "geojson";

type Type = "wkt" | "geojson" | "bbox_string" | "kml" | "esri";
const Modal = () => {
  const [modalOpen, setModalOpen, setBbox] = useStore((state) => [
    state.modalOpen,
    state.setModalOpen,
    state.setBbox,
  ]);
  const activeDrawingMode = useStore((state) => state.activeDrawingMode);
  const [type, setType] = useState<Type>("bbox_string");
  const [invalidInput, setInvalidInput] = useState<string | null>(null);
  const handleClose = () => setModalOpen(false);
  const handleCreateBoundingBox = () => {
    activeDrawingMode();
  };
  const handleViewBbox = () => {
    const geometry = ref.current?.value ?? ref.current?.innerText;
    if (
      type === "bbox_string" &&
      typeof geometry === "string" &&
      geometry.length > 0
    ) {
      setBbox({ type: "bbox_string", data: geometry });
    } else if (
      type === "geojson" &&
      typeof geometry === "string" &&
      geometry.length > 0
    ) {
      try {
        debugger;
        const parsed = JSON.parse(geometry);
        const validationErrors = geojsonValidation.valid(parsed, true);
        if (validationErrors.length > 0) {
          throw new Error(validationErrors[0]);
        }
        setBbox({ type: "geojson", data: parsed });
      } catch (error) {
        if (error instanceof Error) {
          setInvalidInput(error.message);
        }
        return;
      }
    } else if (
      type === "kml" &&
      typeof geometry === "string" &&
      geometry.length > 0
    ) {
      try {
        const dom = new DOMParser().parseFromString(geometry, "text/xml");
        const geojson = kmlToGeojson(dom);
        if (geojson.features.length === 0) {
          throw new Error("No features found in KML");
        }
        setBbox({ type: "geojson", data: geojson });
      } catch (error) {
        if (error instanceof Error) {
          setInvalidInput(error.message ?? "Failed to parse KML");
        }
        return;
      }
    } else if (
      type === "esri" &&
      typeof geometry === "string" &&
      geometry.length > 0
    ) {
      try {
        const parsed = arcgisToGeoJSON(JSON.parse(geometry));
        setBbox({ type: "geojson", data: parsed });
      } catch (error) {
        if (error instanceof Error) {
          setInvalidInput(error.message ?? "Failed to parse ESRI JSON");
        }
        return;
      }
    } else if (
      type === "wkt" &&
      typeof geometry === "string" &&
      geometry.length > 0
    ) {
      try {
        const parsed = wellknown.parse(geometry);
        if (!parsed) {
          throw new Error("Failed to parse WKT");
        }
        setBbox({
          type: "geojson",
          data: {
            type: "Feature",
            geometry: parsed,
          } as Feature,
        });
      } catch (error) {
        if (error instanceof Error) {
          setInvalidInput(error.message);
        }
        return;
      }
    }

    setModalOpen(false);
  };
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>();

  return (
    <Dialog open={modalOpen} fullWidth={true}>
      <DialogTitle>Create or Display bounding box</DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding="1em"
        >
          <Button
            onClick={handleCreateBoundingBox}
            variant={"contained"}
            size={"large"}
          >
            <DrawIcon sx={{ marginRight: "0.5em" }} />
            Create a bounding box
          </Button>
        </Box>
        <Divider variant="inset" />
        <Box padding="1em" textAlign={"center"}>
          <Typography variant={"h6"}>OR</Typography>
          <Typography variant={"body1"}>
            Paste a bounding box in the input below
          </Typography>
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
              <MenuItem value={"kml"}>KML</MenuItem>
              <MenuItem value={"esri"}>ESRI JSON</MenuItem>
              <MenuItem value={"wkt"}>Well Known Text</MenuItem>
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
              <OutlinedInput
                type={"textarea"}
                style={{ width: "100%", minHeight: "2em" }}
                inputRef={ref}
                minRows={5}
                multiline
                onChange={() => setInvalidInput(null)}
              />
            </>
          )}
          {type === "kml" && (
            <>
              <DialogContentText>
                Paste your KML in here to get the bounding box
              </DialogContentText>
              <OutlinedInput
                type={"textarea"}
                style={{ width: "100%", minHeight: "2em" }}
                inputRef={ref}
                minRows={5}
                multiline
              />
            </>
          )}
          {type === "esri" && (
            <>
              <DialogContentText>
                Paste your ESRI JSON in here to get the bounding box
              </DialogContentText>
              <OutlinedInput
                type={"textarea"}
                style={{ width: "100%", minHeight: "2em" }}
                inputRef={ref}
                minRows={5}
                multiline
              />
            </>
          )}
          {type === "wkt" && (
            <>
              <DialogContentText>
                Paste your Well Known Text in here to get the bounding box
              </DialogContentText>
              <OutlinedInput
                type={"textarea"}
                style={{ width: "100%", minHeight: "2em" }}
                inputRef={ref}
                minRows={5}
                multiline
              />
            </>
          )}
          {invalidInput && (
            <Typography
              variant={"body1"}
              color={"error"}
              sx={{
                "&:first-letter": {
                  textTransform: "capitalize",
                },
              }}
            >
              {invalidInput}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color={"warning"}>
          Cancel
        </Button>
        <Button onClick={handleViewBbox} color={"primary"} variant={"outlined"}>
          View Bounding Box
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
