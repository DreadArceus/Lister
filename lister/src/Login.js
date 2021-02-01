import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import "fontsource-roboto";
import Drawer from "@material-ui/core/Drawer";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { motion } from "framer-motion";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  tab: {
    width: "100px",
    minWidth: "100px",
  },
  page: {
    backgroundColor: "black",
    borderLeft: "1px white solid",
  },
});

const CustomForm = (props) => {
  const [formValues, setFormValues] = useState(["", "", ""]);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
    setFormValues(["", "", ""]);
    // setVisibility(false);
  };
  const formComponents = [
    <TextField
      key={0}
      value={formValues[0]}
      onChange={(e) =>
        setFormValues([e.target.value, formValues[1], formValues[2]])
      }
      type="text"
      label="List Name"
      variant="outlined"
      required
      style={{ margin: "5px" }}
    ></TextField>,
    <TextField
      key={1}
      value={formValues[1]}
      onChange={(e) =>
        setFormValues([formValues[0], e.target.value, formValues[2]])
      }
      type="text"
      label="Password"
      variant="outlined"
      required
      style={{ margin: "5px" }}
    ></TextField>,
    <TextField
      key={2}
      value={formValues[2]}
      onChange={(e) =>
        setFormValues([formValues[0], formValues[1], e.target.value])
      }
      type="text"
      label="Author Name"
      variant="outlined"
      style={{ margin: "5px" }}
    ></TextField>,
    <Button key={3} variant="contained" color="secondary" type="submit">
      View List
    </Button>,
    <Button key={4} variant="contained" color="secondary" type="submit">
      Modify List
    </Button>,
    <Button key={5} variant="contained" color="secondary" type="submit">
      Create List
    </Button>,
  ];
  return (
    <form onSubmit={handleSubmit}>
      <Box textAlign="center" width="270px" paddingTop="50px">
        {formComponents.map((item, index) => {
          if (index <= props.index || index === props.index + 3) {
            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                }}
                animate={{ opacity: 1 }}
                transition={{ duration: index > 2 ? 1 : 0.5 }}
              >
                {item}
              </motion.div>
            );
          }
          return <div />;
        })}
      </Box>
    </form>
  );
};

const Login = () => {
  const classes = useStyles();
  const [tabIndex, setIndex] = useState(0);
  const [loginVisible, setVisibility] = useState(false);
  return (
    <React.Fragment key={"right"}>
      <Box textAlign="right" margin="-41px 7px 0px 0px">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={(e) => setVisibility(true)}
        >
          Login
        </Button>
      </Box>
      <Drawer
        anchor="right"
        open={loginVisible}
        onClose={(e) => setVisibility(false)}
        classes={{
          paper: [classes.page],
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(e, index) => setIndex(index)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="View" className={classes.tab} />
          <Tab label="Modify" className={classes.tab} />
          <Tab label="Create" className={classes.tab} />
        </Tabs>
        <CustomForm index={tabIndex} />
      </Drawer>
    </React.Fragment>
  );
};

export default Login;
