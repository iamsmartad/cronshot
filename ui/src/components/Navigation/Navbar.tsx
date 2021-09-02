import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  ListItemIcon,
} from "@material-ui/core";

import {
  Menu as MenuIcon,
  WifiOff as WifiOffIcon,
  Wifi as WifiIcon,
} from "@material-ui/icons";

import clsx from "clsx";
import {useStyles} from "../styles";

type Props = {
  open: boolean;
  status: string;
  handleDrawerOpen: any;
};

const Navbar = ({open, handleDrawerOpen, status}: Props) => {
  const classes = useStyles();

  return (
    <AppBar
      position="absolute"
      className={clsx(classes.appBar, open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          iamCronShot
        </Typography>
        <IconButton color="inherit">
          <Typography
            component="h2"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            <ListItemIcon>
              {status === "Connected" ? (
                <WifiIcon color="secondary" />
              ) : (
                <WifiOffIcon />
              )}
            </ListItemIcon>
            {status}
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
