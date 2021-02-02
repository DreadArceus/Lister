import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider, Typography } from "@material-ui/core";
import Login from "./Login";
import Editor from "./Editor";

const api = axios.create({
  baseURL: "https://lister-restful.herokuapp.com/",
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const initInfo = {
  name: "",
  password: "",
  author: "",
};

const initData = [
  { text: "This is a stock List", key: -11037 },
  {
    text: 'Click "Login" and proceed from there to open another list',
    key: -11428,
  },
];

function App() {
  const [listInfo, setListInfo] = useState(initInfo);
  const [realAuthor, setRealAuthor] = useState("");
  const [error, setError] = useState("");
  const [listData, setListData] = useState(initData);
  useEffect(() => {
    if (listInfo.name !== "") {
      if (listInfo.author === "") {
        api
          .get(
            `/list/${listInfo.name}${
              listInfo.password ? "/" + listInfo.password : ""
            }`
          )
          .then((response) => {
            setListData(response.data.list_items);
            setRealAuthor(response.data.author);
            setError("");
          })
          .catch((error) => {
            setError(error.response.data.error);
            setListInfo(initInfo);
            setRealAuthor("");
            setListData(initData);
          });
      } else {
        api
          .post(
            `/list/${listInfo.name}/${listInfo.password}/${listInfo.author}`
          )
          .then((response) => {
            setListData(response.data.list_items);
            setError("");
          })
          .catch((error) => {
            setError(error.response.data.error);
            setListInfo(initInfo);
            setRealAuthor("");
            setListData(initData);
          });
      }
    }
  }, [listInfo]);
  useEffect(() => {
    if (listInfo.password !== "") {
      api
        .put(`/save/${listInfo.name}/${listInfo.password}`, {
          list_items: listData,
        })
        .catch((error) => {
          setListInfo(initInfo);
          setRealAuthor("");
          setListData([
            {
              key: -99,
              text: `ERROR COULD NOT SAVE LAST CHANGE CONTACT THE DEVELOPER, "${error.message}"`,
            },
          ]);
        });
    }
  }, [listData, listInfo]);
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <Typography variant="h4" color="secondary">
          {listInfo.name || "List name here"}
        </Typography>
        <Typography variant="h6" color="secondary">
          {realAuthor || listInfo.author || "Author name here"}
        </Typography>
        <Login setListInfo={(info) => setListInfo(info)} error={error} />
        <Editor
          listInfo={listInfo}
          listData={listData}
          setListData={setListData}
        />
      </ThemeProvider>
    </div>
  );
}

export default App;
