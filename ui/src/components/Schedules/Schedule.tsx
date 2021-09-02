import { useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Fab,
  Button,
  IconButton,
  CardHeader,
  Avatar,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import {
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
} from "@material-ui/icons";

import { CodeBlock, monoBlue } from "react-code-blocks";
import YAML from "yaml";
import cronstrue from "cronstrue";

import { WebSocketObject, DeleteScheduleProps } from "../myTypes";
import GridChip from "../GridChip";
import { CardActionFooterCodeBlock } from "../CodeBlocks/CardActionFooterCodeBlock";
import { YAMLCodeBlock } from "../CodeBlocks/YAMLCodeBlock";

// import { useStyles } from "../styles";

type Props = {
  schedule: WebSocketObject;
  deleteSchedule: ({ name, namespace }: DeleteScheduleProps) => void;
};

export default function Schedule({ schedule, deleteSchedule }: Props) {
  // const classes = useStyles();
  const [pendingDelete, setPendingDelete] = useState(false);
  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={1}></Grid>
      <Grid item xs={11}>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe">
                <ScheduleIcon color="primary" />
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={schedule.metadata.name}
            subheader={cronstrue.toString(schedule.spec.schedule, {
              throwExceptionOnParseError: false,
              use24HourTimeFormat: true,
            })}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={4} container spacing={1}>
                <Grid item xs={12}>
                  {/* <YAMLCodeBlock
                    yamlobj={
                      schedule.spec?.jobTemplate?.spec?.template?.spec
                        ?.containers[0]?.command
                    }
                  /> */}
                </Grid>
              </Grid>

              <Grid item xs={4} container spacing={1}>
                <GridChip
                  title="Created"
                  label={schedule.metadata?.creationTimestamp}
                />
                <GridChip
                  title="SnapshotClass"
                  label={schedule.metadata?.annotations["snapshotclass"]}
                />
                <GridChip
                  title="Retention"
                  label={schedule.metadata?.annotations["retention"]}
                />
                <GridChip
                  title="Source"
                  label={schedule.metadata?.annotations["source"]}
                />
                <GridChip
                  title="Content"
                  label={schedule.metadata?.annotations["fromContent"]}
                />
              </Grid>
              <Divider orientation="vertical" flexItem />

              <Grid item xs={2} container spacing={2}>
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    disabled={pendingDelete}
                    onClick={() => {
                      setPendingDelete(true);
                      deleteSchedule({
                        name: schedule.metadata.name,
                        namespace: schedule.metadata.namespace,
                      });
                    }}
                  >
                    Delete Schedule
                  </Button>
                </Grid>
                <Grid item>
                  {pendingDelete && <CircularProgress size={24} />}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActionFooterCodeBlock yamlobj={schedule} />
        </Card>
      </Grid>
    </Grid>
  );
}
