import {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {
  MuiThemeProvider,
  createTheme,
  Typography,
  Box,
  Container,
  CssBaseline,
} from "@material-ui/core";
import ReconnectingWebSocket from "reconnecting-websocket";

import Dashboard from "./components/Dashboard/Dashboard";
import Navbar from "./components/Navigation/Navbar";
import Sidebar from "./components/Navigation/Sidebar";
import Volumes from "./components/Volumes/Volumes";
import Snapshots from "./components/Snapshots/Snapshots";
import Schedules from "./components/Schedules/Schedules";
import Logs from "./components/Logs/Logs";
import {
  WebSocketObject,
  AddScheduleProps,
  DeleteScheduleProps,
} from "./components/myTypes";

import getWebSocket from "./wsDataProvider";

import {useStyles} from "./components/styles";
import "./index.css";

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#CA002D",
      },
      secondary: {
        main: "#4875F3",
      },
    },
  });
  // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [message, setMessage] = useState("");
  const [volumes, setVolumes] = useState<WebSocketObject[]>([]);
  const [snapshots, setSnapshots] = useState<WebSocketObject[]>([]);
  const [snapclasses, setSnapClasses] = useState<WebSocketObject[]>([]);
  const [snapcontents, setSnapConts] = useState<WebSocketObject[]>([]);
  const [schedules, setSchedules] = useState<WebSocketObject[]>([]);
  const [socket, setSocket] = useState<ReconnectingWebSocket>();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  function addItem(
    arr: WebSocketObject[],
    item: WebSocketObject
  ): WebSocketObject[] {
    return [...arr.filter((a) => a.metadata.uid !== item.metadata.uid), item];
  }
  function rmItem(
    arr: WebSocketObject[],
    item: WebSocketObject
  ): WebSocketObject[] {
    return arr.filter((a) => a.metadata.uid !== item.metadata.uid);
  }

  const addSchedule = ({
    name,
    namespace,
    crontab,
    pvc,
    snapshotclass,
    content,
    fromContent,
    retention,
  }: AddScheduleProps) => {
    if (fromContent) {
      pvc = content;
    }
    socket?.send(
      JSON.stringify({
        Event: "createSchedule",
        Object: {
          name,
          namespace,
          crontab,
          PVCorContent: pvc,
          Snapshotclass: snapshotclass,
          Content: content,
          FromContent: fromContent,
          Retention: retention,
        },
      })
    );
  };

  const deleteSchedule = ({name, namespace}: DeleteScheduleProps) => {
    console.log("triggered delete schedule" + name + namespace);
    socket?.send(
      JSON.stringify({
        Event: "deleteSchedule",
        Object: {
          Name: name,
          Namespace: namespace,
        },
      })
    );
  };

  useEffect(() => {
    const socket = getWebSocket();
    setSocket(socket);

    socket.onopen = () => {
      setMessage("Connected");
      console.log("Connected");
    };

    socket.onmessage = (e) => {
      const wsObjects = e.data.split("\n");
      for (var x in wsObjects) {
        const eventType = JSON.parse(wsObjects[x])?.Event;
        const eventObject: WebSocketObject = JSON.parse(wsObjects[x])?.Object;
        switch (eventType) {
          case "add-v1/PersistentVolumeClaim":
          case "update-v1/PersistentVolumeClaim":
            setVolumes((volumes) => addItem(volumes, eventObject));
            break;
          case "delete-v1/PersistentVolumeClaim":
            setVolumes((volumes) => rmItem(volumes, eventObject));
            break;
          case "add-snapshot.storage.k8s.io/v1/VolumeSnapshot":
          case "update-snapshot.storage.k8s.io/v1/VolumeSnapshot":
            setSnapshots((snapshots) => addItem(snapshots, eventObject));
            break;
          case "delete-snapshot.storage.k8s.io/v1/VolumeSnapshot":
            setSnapshots((snapshots) => rmItem(snapshots, eventObject));
            break;
          case "add-snapshot.storage.k8s.io/v1/VolumeSnapshotContent":
          case "update-snapshot.storage.k8s.io/v1/VolumeSnapshotContent":
            setSnapConts((snapcontents) => addItem(snapcontents, eventObject));
            break;
          case "delete-snapshot.storage.k8s.io/v1/VolumeSnapshotContent":
            setSnapConts((snapcontents) => rmItem(snapcontents, eventObject));
            break;
          case "add-snapshot.storage.k8s.io/v1/VolumeSnapshotClass":
          case "update-snapshot.storage.k8s.io/v1/VolumeSnapshotClass":
            setSnapClasses((snapclasses) => addItem(snapclasses, eventObject));
            break;
          case "delete-snapshot.storage.k8s.io/v1/VolumeSnapshotClass":
            setSnapClasses((snapclasses) => rmItem(snapclasses, eventObject));
            break;
          case "add-storage.k8s.io/v1/StorageClass":
          case "update-storage.k8s.io/v1/StorageClass":
            console.log("TODO: received " + eventType);
            break;
          case "delete-storage.k8s.io/v1/StorageClass":
            console.log("TODO: received " + eventType);
            break;
          case "add-batch/v1/CronJob":
          case "update-batch/v1/CronJob":
          case "add-batch/v1beta1/CronJob":
          case "update-batch/v1beta1/CronJob":
            setSchedules((schedules) => addItem(schedules, eventObject));
            break;
          case "delete-batch/v1/CronJob":
          case "delete-batch/v1beta1/CronJob":
            setSchedules((schedules) => rmItem(schedules, eventObject));
            break;
          default:
            console.log("unknown event type " + eventType);
        }
      }
    };

    socket.onclose = () => {
      setMessage("Connection lost - trying to reconnect");
      console.log("Connection lost - trying to reconnect");
      setVolumes([]);
      setSnapshots([]);
    };

    return () => {
      setVolumes([]);
      setSnapshots([]);
      setSchedules([]);
      socket.close();
    };
  }, []);

  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {"an "}
        <a color="inherit" href="https://www.iamstudent.eu">
          iam product
        </a>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <Router>
          <Navbar
            open={open}
            handleDrawerOpen={handleDrawerOpen}
            status={message}
          />
          <Sidebar open={open} handleDrawerClose={handleDrawerClose} />

          <main className={classes.content}>
            <div className={classes.appBarSpacer} />

            <Container maxWidth={false} className={classes.container}>
              <Switch>
                <Route exact path="/">
                  <Dashboard volumes={volumes} snapshots={snapshots} />
                </Route>
                <Route path="/volumes">
                  <Volumes volumes={volumes} />
                </Route>
                <Route path="/snapshots">
                  <Snapshots
                    snapshots={snapshots}
                    snapshotcontents={snapcontents}
                    snapclasses={snapclasses}
                  />
                </Route>
                <Route path="/schedules">
                  <Schedules
                    schedules={schedules}
                    volumes={volumes}
                    addSchedule={addSchedule}
                    deleteSchedule={deleteSchedule}
                  />
                </Route>
                <Route path="/logs">
                  <Logs />
                </Route>
              </Switch>
              <Box pt={4}>
                <Copyright />
              </Box>
            </Container>
          </main>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
