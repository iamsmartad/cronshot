import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { useStyles } from "../styles";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import WifiIcon from "@material-ui/icons/Wifi";
import ListItemIcon from "@material-ui/core/ListItemIcon";

type Props = {
  open: boolean;
  status: string;
  handleDrawerOpen: any;
};

const Navbar = ({ open, handleDrawerOpen, status }: Props) => {
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
