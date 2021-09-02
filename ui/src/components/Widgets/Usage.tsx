import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Title } from "../Title";
import { Link } from "react-router-dom";
import { useStyles } from "../styles";
import { WebSocketObject } from "../myTypes";

export function calcSize(obj: WebSocketObject) {
  if (typeof obj.spec != "undefined") {
    var ret = parseFloat(
      obj.spec.resources.requests.storage.replace(/\D/g, "")
    );
    return ret;
  }
  return 0;
}

type Props = {
  volumes: WebSocketObject[];
};

export default function Usage({ volumes }: Props) {
  const classes = useStyles();

  var usage = volumes.reduce((a, b) => a + calcSize(b), 0);
  return (
    <React.Fragment>
      <Title>Storage Usage</Title>
      <Typography component="p" variant="h4">
        {usage} Gi
      </Typography>
      <Typography color="textSecondary">
        across {volumes.length} PVCs
      </Typography>
      <div>
        <Link color="primary" to="/tutorial">
          Details
        </Link>
      </div>
    </React.Fragment>
  );
}
