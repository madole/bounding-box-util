import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import MapLibre from "./MapLibre.tsx";
import AddIcon from "@mui/icons-material/Add";
import Modal from "./Modal.tsx";
import BboxLayer from "./BboxLayer.tsx";
import useStore from "./store.ts";
import DrawingTools from "./DrawingTools.tsx";
import SpeedDialTooltipOpen from "./SpeedDial.tsx";

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
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Bounding Box
              </Typography>
            </Box>
            <Button color="inherit" onClick={handleNewBoundingBox}>
              <AddIcon />
              <Typography>New Bounding Box</Typography>
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1 }}>
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
