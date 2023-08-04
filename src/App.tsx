import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import MapLibre from "./MapLibre.tsx";
import AddIcon from "@mui/icons-material/Add";
import Modal from "./Modal.tsx";
import BboxLayer from "./BboxLayer.tsx";
import useStore from "./store.ts";

function App() {
  const clearState = useStore((state) => state.clearState);
  const handleNewBoundingBox = () => {
    clearState();
  };
  return (
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
        </MapLibre>
      </Box>
      <Modal></Modal>
    </Box>
  );
}

export default App;
