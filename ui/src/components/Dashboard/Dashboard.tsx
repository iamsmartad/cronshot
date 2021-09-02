import {Grid, Paper} from "@material-ui/core";

import VolumesWidget from "../Volumes/VolumesWidget";
import SnapshotsWidget from "../Snapshots/SnapshotsWidget";
import {WebSocketObject} from "../myTypes";
import {useStyles} from "../styles";

type Props = {
  volumes: WebSocketObject[];
  snapshots: WebSocketObject[];
};

export default function Dashboard({volumes, snapshots}: Props) {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={3}>
        {/* Recent Volumes */}
        <Grid item xs={9}>
          <Paper className={classes.paper}>
            <VolumesWidget volumes={volumes} />
          </Paper>
        </Grid>
        {/* Chart */}
        <Grid item xs={3}>
          {/* <Paper className={fixedHeightPaper}>
            <Usage volumes={volumes} />
          </Paper>
          <Paper className={fixedHeightPaper}>
            <Chart volumes={volumes} />
          </Paper> */}
        </Grid>
        {/* Recent Volumes */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <SnapshotsWidget snapshots={snapshots} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
