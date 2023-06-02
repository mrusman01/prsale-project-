import React, { useContext, useState } from "react";
import {
  Box,
  List,
  Paper,
  Button,
  ListItem,
  Container,
  ListItemText,
  useMediaQuery,
  SwipeableDrawer,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import clsx from "clsx";

import { AppContext } from "../utils";
import { ToastNotify } from "../ConnectivityAssets/hooks";
import StyledButton from "./StyledButton";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
    alignItems: "center",
  },
  paper: {
    background: "#1C0D38 !important",
    justifyContent: "center",
  },
});

const StyledBox = ({ children }) => {
  return (
    <Box
      mr={5}
      component="a"
      sx={{
        color: "#000",
        fontSize: "18px",
        fontWeight: "500",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      {children}
    </Box>
  );
};

export default function Header() {
  const { account, connect, disconnect } = useContext(AppContext);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });
  const classes = useStyles();
  const [state, setState] = useState({
    left: false,
  });

  const matches = useMediaQuery("(min-width:900px)");

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box
        mt={-20}
        mb={4}
        color="#fff"
        fontSize="25px"
        display="flex"
        justifyContent="center"
      >
        LOGO
      </Box>
      <List>
        {["About", "Services", "Roadmap", "FAQ", "Statistic"].map(
          (text, index) => (
            <ListItem button key={index}>
              <ListItemText
                style={{
                  textTransform: "capitalize",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#ffffff",
                }}
                primary={text}
              />
            </ListItem>
          )
        )}
      </List>
      <Box mt={3} display="flex" justifyContent="center">
        {account ? (
          <StyledButton onClick={() => disconnect()} width="80%">
            {account.slice(0, 4) + "..." + account.slice(-4)}
          </StyledButton>
        ) : (
          <StyledButton onClick={() => connect()} width="80%">
            Connect
          </StyledButton>
        )}
      </Box>
    </div>
  );

  return (
    <>
      <ToastNotify alertState={alertState} setAlertState={setAlertState} />
      <Box
        display="flex"
        alignItems="center"
        sx={{
          width: "100%",
          height: "90px",
          zIndex: 100,
        }}
      >
        <Container>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              style={{
                color: "#000000",
                fontSize: "25px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              LOGO
            </Box>

            {matches ? (
              <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
              >
                <StyledBox>About</StyledBox>
                <StyledBox>Services</StyledBox>
                <StyledBox>Roadmap</StyledBox>
                <StyledBox>FAQ</StyledBox>
                <StyledBox>Statistic</StyledBox>

                {account ? (
                  <StyledButton onClick={() => disconnect()} width="160px">
                    {account.slice(0, 4) + "..." + account.slice(-4)}
                  </StyledButton>
                ) : (
                  <StyledButton onClick={() => connect()} width="160px">
                    Connect
                  </StyledButton>
                )}
              </Box>
            ) : (
              <Box>
                {["left"].map((anchor) => (
                  <React.Fragment key={anchor}>
                    <Button
                      onClick={toggleDrawer(anchor, true)}
                      style={{ zIndex: 1 }}
                    >
                      <MenuIcon
                        style={{
                          fontSize: "38px",
                          cursor: "pointer",
                          color: "#000000",
                        }}
                      ></MenuIcon>
                    </Button>
                    <Paper style={{ background: "#1C0D38" }}>
                      <SwipeableDrawer
                        classes={{ paper: classes.paper }}
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                      >
                        {list(anchor)}
                      </SwipeableDrawer>
                    </Paper>
                  </React.Fragment>
                ))}
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}
