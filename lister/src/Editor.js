import React, { useState, useRef, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ClearAllOutlinedIcon from "@material-ui/icons/ClearAllOutlined";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  listBox: {
    height: "500px",
    width: "1300px",
    padding: "13px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column-reverse",
    borderTop: "1px white solid",
    borderRight: "1px white solid",
    borderBottom: "1px white solid",
  },
  text: {
    color: "white",
  },
  item: {
    borderBottom: "2px white dashed",
  },
  leftIcon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    width: "40px",
    height: "40px",
  },
  rightIcon: {
    color: theme.palette.secondary.contrastText,
  },
  formBox: {
    margin: "30px",
    width: "1300px",
  },
  formField: {
    marginRight: "20px",
    width: "900px",
  },
  formButton: {
    marginTop: "5.69px",
  },
}));

const CustomListItem = (props) => {
  const classes = useStyles();
  const editFieldRef = useRef(null);
  const [editedText, setEditedText] = useState(props.text);
  useEffect(() => {
    if (props.inEditing === props.id) {
      editFieldRef.current.focus();
    }
  }, [props.inEditing, props.id]);
  const getActive = () => {
    if (props.inEditing === props.id) {
      return (
        <TextField
          style={{ width: "1100px" }}
          inputRef={editFieldRef}
          value={editedText}
          multiline
          onChange={(e) => setEditedText(e.target.value)}
        />
      );
    }
    if (editedText !== props.text) {
      props.handleEdit(editedText, props.index);
    }
    return (
      <Typography color="textPrimary" style={{ width: "1100px" }}>
        {props.text}
      </Typography>
    );
  };
  return (
    <ListItem className={classes.item}>
      <ListItemIcon>
        <IconButton
          edge="start"
          className={classes.leftIcon}
          disabled={props.view}
        >
          <ClearAllOutlinedIcon />
        </IconButton>
      </ListItemIcon>
      {getActive()}
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          className={classes.rightIcon}
          disabled={
            props.view ||
            (props.inEditing !== props.id && props.inEditing !== -1)
          }
          onClick={(e) =>
            props.setInEditing(props.inEditing === props.id ? -1 : props.id)
          }
        >
          <EditOutlinedIcon />
        </IconButton>
        <IconButton
          edge="end"
          className={classes.rightIcon}
          onClick={(e) => {
            if (props.id === props.inEditing) {
              props.setInEditing(-1);
            }
            props.handleDelete(props.index);
          }}
          disabled={props.view}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const Editor = (props) => {
  const classes = useStyles();
  const [inEditing, setInEditing] = useState(-1);
  const handleEdit = (text, index) => {
    props.setListData([
      ...props.listData.slice(0, index),
      { text: text, key: props.listData[index].key },
      ...props.listData.slice(index + 1),
    ]);
  };
  const handleDelete = (index) => {
    props.setListData([
      ...props.listData.slice(0, index),
      ...props.listData.slice(index + 1),
    ]);
  };
  const [insertText, setInsertText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    props.setListData((oldData) => {
      return [
        ...oldData,
        {
          text: insertText,
          key: oldData.length === 0 ? 0 : oldData[oldData.length - 1].key + 1,
        },
      ];
    });
    setInsertText("");
  };
  return (
    <Box>
      <Box className={classes.listBox}>
        <List className={classes.text}>
          {props.listData.map((item, index) => {
            return (
              <CustomListItem
                key={item.key}
                id={item.key}
                index={index}
                text={item.text}
                inEditing={inEditing}
                setInEditing={(newState) => setInEditing(newState)}
                handleEdit={(text, index) => handleEdit(text, index)}
                handleDelete={(index) => handleDelete(index)}
                view={props.listInfo.password === ""}
              />
            );
          })}
        </List>
      </Box>
      <Box className={classes.formBox}>
        <form onSubmit={handleSubmit}>
          <TextField
            value={insertText}
            onChange={(e) => setInsertText(e.target.value)}
            variant="outlined"
            color="secondary"
            label="Type text to insert"
            multiline
            className={classes.formField}
            disabled={props.listInfo.password === ""}
          ></TextField>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            className={classes.formButton}
            disabled={props.listInfo.password === ""}
          >
            Insert
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Editor;
