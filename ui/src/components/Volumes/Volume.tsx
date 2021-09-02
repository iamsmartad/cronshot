import { useState } from "react";
import {
  Button,
  Card,
  Grid,
  CardContent,
  Fab,
  CardHeader,
  Avatar,
  IconButton,
  Collapse,
  Divider,
  Badge,
  CardActions,
} from "@material-ui/core";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  MoreVert as MoreVertIcon,
  Inbox as InboxIcon,
  FileCopy as FileCopyIcon,
} from "@material-ui/icons";

import { WebSocketObject } from "../myTypes";
import GridChip from "../GridChip";
import { CardActionFooterCodeBlock } from "../CodeBlocks/CardActionFooterCodeBlock";

// import { useStyles } from "../styles";

type Props = {
  volume: WebSocketObject;
};

export const Volume = ({ volume }: Props) => {
  // const classes = useStyles();
  const [showSnapshots, setShowSnapshots] = useState(false);
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
            title={volume.metadata.name}
            subheader={"underlying PV: " + volume.spec.volumeName}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={6} container spacing={1}>
                <GridChip
                  title="Created"
                  label={volume.metadata?.creationTimestamp}
                />
                <GridChip
                  title="Capacity"
                  label={volume.status?.capacity?.storage}
                />
                <GridChip title="Phase" label={volume.status?.phase} />
                <GridChip
                  title="Storage Class"
                  label={volume.spec?.storageClassName}
                />
                <GridChip
                  title="Access Mode"
                  label={volume.spec?.accessModes}
                />
              </Grid>
              <Divider orientation="vertical" flexItem />
              {/* right third of card */}
              <Grid item xs={6} container spacing={2}>
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    // onClick={() => setShowYAML(!showYAML)}
                  >
                    Create Snapshot
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    // onClick={() => setShowYAML(!showYAML)}
                  >
                    Create Schedule
                  </Button>
                </Grid>
                <Grid item>
                  <Badge badgeContent={4} color="secondary">
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setShowSnapshots(!showSnapshots)}
                    >
                      Show Snapshots
                    </Button>
                  </Badge>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item>
                  <Collapse in={showSnapshots}>
                    <Card>
                      <CardHeader
                        avatar={
                          <Avatar aria-label="recipe">
                            <FileCopyIcon color="secondary" />
                          </Avatar>
                        }
                        title="some Snapshot"
                        subheader="created 3 days ago"
                      />
                      <CardContent>
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                        >
                          details
                        </Button>
                      </CardContent>
                    </Card>
                  </Collapse>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActionFooterCodeBlock yamlobj={volume} />
        </Card>
      </Grid>
    </Grid>
  );
};

type VolumeNamspaceProps = {
  namespace: string;
  volumes: WebSocketObject[];
};

export const VolumeNameSpace = ({
  namespace,
  volumes,
}: VolumeNamspaceProps) => {
  const [showVolumes, setShowVolumes] = useState(false);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} container>
        <Grid item>
          <Badge
            badgeContent={volumes.length}
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
              onClick={() => setShowVolumes(!showVolumes)}
            >
              {showVolumes ? <RemoveIcon /> : <AddIcon />}
              Namespace: {namespace}{" "}
            </Fab>
            {/* <Title variant="h6">Namespace: {namespace}</Title> */}
          </Badge>
        </Grid>
        {/* direction="row" */}
      </Grid>
      <Grid item xs={12} container>
        <Grid item xs={12}>
          <Collapse in={showVolumes}>
            {volumes.map((vol) => (
              <Volume key={vol.metadata.uid} volume={vol} />
            ))}
          </Collapse>
        </Grid>
      </Grid>
    </Grid>
  );
};
