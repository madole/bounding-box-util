import * as React from "react";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useStore from "./store.ts";
import { parseBbox } from "./parseBbox.tsx";
import { LngLatBounds } from "maplibre-gl";
import wellknown from "wellknown";
import tokml from "tokml";
import { geojsonToArcGIS } from "@esri/arcgis-to-geojson-utils";
import { Alert, Slide, Snackbar } from "@mui/material";

export default function SpeedDialTooltipOpen() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const boundingBox = useStore((state) => state.bbox);

  const handleCopyBbox = () => {
    if (!boundingBox) return;
    const { newBbox } = parseBbox(boundingBox);
    if (!(newBbox instanceof LngLatBounds)) {
      const bboxString = newBbox.join(",");
      navigator.clipboard.writeText(bboxString);
    }
    handleClose();
    setCopied(true);
  };

  const handleCopyGeojson = () => {
    if (!boundingBox) return;
    const { bboxGeometry } = parseBbox(boundingBox);
    navigator.clipboard.writeText(JSON.stringify(bboxGeometry, null, 2));
    handleClose();
    setCopied(true);
  };

  const handleCopyWKT = () => {
    if (!boundingBox) return;
    const { bboxGeometry } = parseBbox(boundingBox);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const wkt = wellknown.stringify(bboxGeometry);
    navigator.clipboard.writeText(wkt);
    handleClose();
    setCopied(true);
  };

  const handleCopyKML = () => {
    if (!boundingBox) return;
    const { bboxGeometry } = parseBbox(boundingBox);
    const kml = tokml(bboxGeometry);
    navigator.clipboard.writeText(kml);
    handleClose();
    setCopied(true);
  };

  const handleCopyEsriJSON = () => {
    if (!boundingBox) return;
    const { bboxGeometry } = parseBbox(boundingBox);
    const esriJSON = geojsonToArcGIS(bboxGeometry);
    navigator.clipboard.writeText(JSON.stringify(esriJSON, null, 2));
    handleClose();
    setCopied(true);
  };

  return (
    <Box
      sx={{
        height: 330,
        position: "fixed",
        bottom: 20,
        right: 20,
        flexGrow: 1,
      }}
    >
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="Download Bounding Box"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<ContentCopyIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        hidden={boundingBox === null}
      >
        <SpeedDialAction
          icon={<FileCopyIcon />}
          tooltipTitle="Geojson"
          tooltipOpen
          onClick={handleCopyGeojson}
        />
        <SpeedDialAction
          icon={<FileCopyIcon />}
          tooltipTitle="BBOX"
          tooltipOpen
          onClick={handleCopyBbox}
        />
        <SpeedDialAction
          icon={<FileCopyIcon />}
          tooltipTitle="WKT"
          tooltipOpen
          onClick={handleCopyWKT}
        />
        <SpeedDialAction
          icon={<FileCopyIcon />}
          tooltipTitle="KML"
          tooltipOpen
          onClick={handleCopyKML}
        />
        <SpeedDialAction
          icon={<FileCopyIcon />}
          tooltipTitle="ESRI"
          tooltipOpen
          onClick={handleCopyEsriJSON}
        />
      </SpeedDial>
      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => {
          setCopied(false);
        }}
        message="Bbox copied."
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => {
            setCopied(false);
          }}
          severity="success"
          variant="filled"
        >
          Bbox copied.
        </Alert>
      </Snackbar>
    </Box>
  );
}
