import "./App.css";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider, Typography } from "@material-ui/core";
import Login from "./Login";
import Editor from "./Editor";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <Typography variant="h4" color="secondary">List Name would be here</Typography>
        <Typography variant="h6" color="secondary">Author Name would be here</Typography>
        <Login />
        <Editor />
      </ThemeProvider>
    </div>
  );
}

export default App;
