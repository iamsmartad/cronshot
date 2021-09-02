import React, { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import cronstrue from "cronstrue";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import { useStyles } from "../styles";
import { WebSocketObject, AddScheduleProps } from "../myTypes";

type Props = {
  volumes: WebSocketObject[];
  addSchedule: ({
    name,
    namespace,
    crontab,
    pvc,
    content,
    snapshotclass,
    fromContent,
    retention,
  }: AddScheduleProps) => void;
  toggleHidded(): void;
};

export default function CreateScheduleForm({
  volumes,
  addSchedule,
  toggleHidded,
}: Props) {
  const classes = useStyles();
  const [volume, setVolume] = useState("None");
  const [content, setContent] = useState("None");
  const [fromContent, setFromContent] = useState(false);
  const [retention, setRetention] = useState(5);
  const [snapshotclass, setSnapshotclass] = useState("hans-wurst");
  const [cron, setCron] = useState("0 3 * * 0");
  const [cronValid, setCronValid] = useState(
    cronstrue.toString(cron, {
      throwExceptionOnParseError: false,
      use24HourTimeFormat: true,
      dayOfWeekStartIndexZero: true,
    })
  );
  const [name, setName] = useState("");
  const [volumeErr, setVolumeErr] = useState(true);
  const [nameErr, setNameErr] = useState(true);
  const [cronErr, setCronErr] = useState(false);
  const [namespace, setNamespace] = useState("");

  const handleName = (event: any) => {
    setName(event.target.value);
    if (event.target.value === "") {
      setNameErr(true);
      return;
    }
    setNameErr(false);
  };
  const handleVolume = (event: any) => {
    setVolume(event.target.value);
    if (event.target.value === "None") {
      setVolumeErr(true);
      return;
    }
    setVolumeErr(false);

    var found = volumes.find((vol) => vol.metadata.name === event.target.value);
    if (found) {
      setVolume(found.metadata.name);
      setNamespace(found.metadata.namespace);
    }
  };
  const handleCron = (event: any) => {
    setCron(event.target.value);
    try {
      setCronValid(
        cronstrue.toString(event.target.value, {
          throwExceptionOnParseError: true,
          use24HourTimeFormat: true,
          dayOfWeekStartIndexZero: true,
        })
      );
    } catch {
      setCronValid("invaid");
      setCronErr(true);
      return;
    }
    setCronErr(false);
  };

  const handleCreate = () => {
    if (!cronErr && !nameErr && !volumeErr) {
      addSchedule({
        name,
        namespace,
        crontab: cron,
        pvc: volume,
        content,
        snapshotclass,
        fromContent,
        retention,
      });
      setVolume("None");
      setName("");
      setNamespace("");
      setCron("0 3 * * 0");
      setVolumeErr(true);
      setNameErr(true);
      toggleHidded();
    }
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container direction="row" spacing={1}>
        <Grid item xs={3}>
          {/* <FormControl error={volumeerror}> */}
          <InputLabel htmlFor="outlined-select-currency-native">
            Volume Name
          </InputLabel>
          <Select
            error={volumeErr}
            id="outlined-select-currency-native"
            value={volume}
            onChange={handleVolume}
            // variant="outlined"
          >
            <MenuItem value="None">
              <em>None</em>
            </MenuItem>
            {volumes.map((option) => (
              <MenuItem
                key={option.metadata.uid}
                value={option.metadata.name}
                // value2={option.metadata.namespace}
              >
                {option.metadata.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>select the source pvc</FormHelperText>
          {/* </FormControl> */}
        </Grid>
        <Grid item xs={3}>
          <FormControl error={nameErr}>
            <InputLabel htmlFor="component-simple">Schedule Name</InputLabel>
            <Input id="component-simple" value={name} onChange={handleName} />
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          <FormControl error={cronErr}>
            <InputLabel htmlFor="component-simple">CronTab</InputLabel>
            <Input id="component-simple" value={cron} onChange={handleCron} />
          </FormControl>
          {cronValid}
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            type="button"
            color="primary"
            onClick={handleCreate}
          >
            Create
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
