import { useState } from "react";
import {
  Card,
  Badge,
  CardContent,
  Typography,
  Paper,
  Grid,
  Button,
  Fab,
  CardHeader,
  Avatar,
  IconButton,
  Collapse,
  Divider,
  CardActions,
} from "@material-ui/core";
import {
  Remove as RemoveIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Inbox as InboxIcon,
  FileCopy as FileCopyIcon,
} from "@material-ui/icons";

// import { useStyles } from "../styles";
import { WebSocketObject } from "../myTypes";
import { SnapshotSet } from "./Snapshots";
import GridChip from "../GridChip";
import { CardActionFooterCodeBlock } from "../CodeBlocks/CardActionFooterCodeBlock";
import { YAMLCodeBlock } from "../CodeBlocks/YAMLCodeBlock";
type Props = {
  snapshot: WebSocketObject;
  snapcontent: WebSocketObject;
  snapclass: WebSocketObject | null;
};

export default function Snapshot({ snapshot, snapcontent, snapclass }: Props) {
  // const classes = useStyles();
  const [showYAML, setShowYAML] = useState(false);
  const [isHiddenContent, setIsHiddenContent] = useState(true);
  const [isHiddenClass, setIsHiddenClass] = useState(true);
  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={1}></Grid>
      <Grid item xs={11}>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe">
                <InboxIcon color="primary" />
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={snapshot.metadata.name}
            subheader={"SnapshotClass: " + snapclass?.metadata.name}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={6} container spacing={1}>
                <Grid item xs={12}>
                  <YAMLCodeBlock yamlobj={snapshot.spec} />
                </Grid>
                <Grid item xs={12}>
                  <YAMLCodeBlock yamlobj={snapshot.status} />
                </Grid>
              </Grid>{" "}
              <Grid item xs={4} container spacing={1}>
                <GridChip
                  title="Created"
                  label={snapshot.metadata?.creationTimestamp}
                />
                {/* <GridChip
                  title="Capacity"
                  label={snapcontent.status?.capacity?.storage}
                /> */}
                <GridChip
                  title="Ready To Use"
                  label={snapshot.status?.readyToUse ? "ready" : "not ready"}
                />
                <GridChip
                  title="SnapshotClassName"
                  label={snapshot.spec?.volumeSnapshotClassName}
                />
              </Grid>
              <Divider orientation="vertical" flexItem />
              {/* right third of card */}
              <Grid item xs={2} container spacing={2}>
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => setShowYAML(!showYAML)}
                  >
                    Restore PVC from Snapshot
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setShowYAML(!showYAML)}
                  >
                    Delete
                  </Button>
                </Grid>
                <Grid item>
                  {/* <Badge badgeContent={4} color="secondary">
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setShowSnapshots(!showSnapshots)}
                    >
                      Show Snapshots
                    </Button>
                  </Badge> */}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActionFooterCodeBlock yamlobj={snapshot} />
        </Card>
      </Grid>
    </Grid>
  );
}

Snapshot.defaultProps = {
  snapshot: {},
  snapcontent: {},
};

type SnapshotNamspaceProps = {
  namespace: string;
  snapshots: SnapshotSet[];
};

export const SnapshotNameSpace = ({
  namespace,
  snapshots,
}: SnapshotNamspaceProps) => {
  const [showSnapshots, setShowSnapshots] = useState(false);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} container>
        <Grid item>
          <Badge
            badgeContent={snapshots.length}
            color="secondary"
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Fab
              color="default"
              size="small"
              variant="extended"
              aria-label="add"
              onClick={() => setShowSnapshots(!showSnapshots)}
            >
              {showSnapshots ? <RemoveIcon /> : <AddIcon />}
              Namespace: {namespace}
            </Fab>
            {/* <Title variant="h6">Namespace: {namespace}</Title> */}
          </Badge>
        </Grid>
        {/* direction="row" */}
      </Grid>
      <Grid item xs={12} container>
        <Grid item xs={12}>
          <Collapse in={showSnapshots}>
            {snapshots.map((snapset) => (
              <Snapshot
                key={snapset.snapshot.metadata.uid}
                snapshot={snapset.snapshot}
                snapclass={snapset.snapclass}
                snapcontent={snapset.content}
              />
            ))}
          </Collapse>
        </Grid>
      </Grid>
    </Grid>
  );
};
