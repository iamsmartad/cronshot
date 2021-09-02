import React, { useState } from "react";
import { Title } from "../Title";
import Grid from "@material-ui/core/Grid";
import Schedule from "./Schedule";
import CreateScheduleForm from "./CreateScheduleForm";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/ExpandLess";
// import EditIcon from "@material-ui/icons/Edit";
// import { useStyles } from "../styles";
import {
  WebSocketObject,
  AddScheduleProps,
  DeleteScheduleProps,
} from "../myTypes";

type Props = {
  schedules: WebSocketObject[];
  volumes: WebSocketObject[];
  addSchedule: ({ ...any }: AddScheduleProps) => void;
  deleteSchedule: ({ ...any }: DeleteScheduleProps) => void;
};

export default function Schedules({
  schedules,
  volumes,
  addSchedule,
  deleteSchedule,
}: Props) {
  // const classes = useStyles();
  const [addHidden, setAddHidden] = useState(true);

  const toggleHidded = () => {
    setAddHidden(!addHidden);
  };

  return (
    <>
      <Title variant="h6">Schedules</Title>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            spacing={10}
          >
            <Grid item xs={11}></Grid>
            <Grid item xs={1}>
              <Fab color="primary" aria-label="add" onClick={toggleHidded}>
                {addHidden ? <AddIcon /> : <RemoveIcon />}
              </Fab>
            </Grid>
          </Grid>
        </Grid>
        {!addHidden && (
          <Grid item xs={12}>
            <CreateScheduleForm
              volumes={volumes}
              addSchedule={addSchedule}
              toggleHidded={toggleHidded}
            />
          </Grid>
        )}
        {schedules.map((sched) => (
          <Grid item xs={12}>
            <Schedule
              key={sched.metadata.uid}
              schedule={sched}
              deleteSchedule={deleteSchedule}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
