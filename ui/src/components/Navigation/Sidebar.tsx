import clsx from "clsx";

import {
  Drawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";

import {
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  AllInbox as AllInboxIcon,
  FileCopy as FileCopyIcon,
  Schedule as ScheduleIcon,
} from "@material-ui/icons";

import {useStyles} from "../styles";
import {Link} from "react-router-dom";

type Props = {
  open: boolean;
  handleDrawerClose: any;
};

const Sidebar = ({open, handleDrawerClose}: Props) => {
  const classes = useStyles();

  return (
    <Drawer
      variant="persistent"
      PaperProps={{
        style: {
          position: "relative",
        },
      }}
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <div>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/volumes">
            <ListItemIcon>
              <AllInboxIcon />
            </ListItemIcon>
            <ListItemText primary="Volumes" />
          </ListItem>
          <ListItem button component={Link} to="/snapshots">
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary="Snapshots" />
          </ListItem>
          <ListItem button component={Link} to="/schedules">
            <ListItemIcon>
              <ScheduleIcon />
            </ListItemIcon>
            <ListItemText primary="Schedules" />
          </ListItem>
          {/* <ListItem button component={Link} to="/logs">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Events / Logs" />
          </ListItem> */}
        </div>
      </List>
      <Divider />
      <List>
        <div>
          <ListSubheader inset>ToDos</ListSubheader>
        </div>
      </List>
    </Drawer>
  );
};

export default Sidebar;
