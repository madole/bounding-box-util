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

export default function SpeedDialTooltipOpen() {
  const [open, setOpen] = React.useState(false);
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
  };

  const handleCopyGeojson = () => {
    if (!boundingBox) return;
    const { bboxGeometry } = parseBbox(boundingBox);
    navigator.clipboard.writeText(JSON.stringify(bboxGeometry, null, 2));
    handleClose();
  };

  const handleCopyWKT = () => {
    if (!boundingBox) return;
    const { bboxGeometry } = parseBbox(boundingBox);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const wkt = wellknown.stringify(bboxGeometry);
    navigator.clipboard.writeText(wkt);
    handleClose();
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
      </SpeedDial>
    </Box>
  );
}
