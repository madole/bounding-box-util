import CssBaseline from "@mui/material/CssBaseline";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import MapLibre from "./MapLibre.tsx";
import AddIcon from "@mui/icons-material/Add";
import Modal from "./Modal.tsx";
import BboxLayer from "./BboxLayer.tsx";
import useStore from "./store.ts";
import DrawingTools from "./DrawingTools.tsx";
import SpeedDialTooltipOpen from "./SpeedDial.tsx";
import MapIcon from "@mui/icons-material/Map";

function App() {
  const clearState = useStore((state) => state.clearState);
  const modalOpen = useStore((state) => state.modalOpen);
  const drawingModeActive = useStore((state) => state.drawingModeActive);
  const handleNewBoundingBox = () => {
    clearState();
  };
  return (
    <>
      <CssBaseline />

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                gap: "0.5em",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <MapIcon />
              <Typography
                sx={{
                  typography: {
                    xs: "body2",
                    sm: "body2",
                    md: "h6",
                  },
                }}
                component="h1"
                textTransform={"uppercase"}
              >
                Bounding Box Utility
              </Typography>
            </Box>
            <Button
              color="inherit"
              onClick={handleNewBoundingBox}
              variant={"outlined"}
            >
              <AddIcon />
              <Typography>New Bbox</Typography>
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1 }}>
          <Snackbar open={drawingModeActive}>
            <Alert severity="info">
              Click on the map to start drawing a bounding box
            </Alert>
          </Snackbar>
          <MapLibre>
            <BboxLayer />
            {drawingModeActive && <DrawingTools />}
          </MapLibre>
        </Box>
        {modalOpen && <Modal></Modal>}
        <SpeedDialTooltipOpen />
      </Box>
    </>
  );
}

export default App;
