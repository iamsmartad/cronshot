import {Typography} from "@material-ui/core";
import {Title} from "../Title";
import {Link} from "react-router-dom";
import {WebSocketObject} from "../myTypes";

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

export default function Usage({volumes}: Props) {
  var usage = volumes.reduce((a, b) => a + calcSize(b), 0);
  return (
    <>
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
    </>
  );
}
