import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Title } from "../Title";
import { WebSocketObject } from "../myTypes";
// import { useStyles } from "../styles";

type Props = {
  volumes: WebSocketObject[];
};

export default function VolumesWidget({ volumes }: Props) {
  // const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Overview Volumes</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Namspace</TableCell>
            <TableCell>Storage Class</TableCell>
            <TableCell>Snapshots</TableCell>
            <TableCell>Phase</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {volumes.map((vol) => (
            <TableRow key={vol.metadata?.uid}>
              <TableCell>{vol.metadata?.name}</TableCell>
              <TableCell>{vol.metadata?.creationTimestamp}</TableCell>
              <TableCell>{vol.spec?.resources.requests.storage}</TableCell>
              <TableCell>{vol.metadata?.namespace}</TableCell>
              <TableCell>{vol.spec?.storageClassName}</TableCell>
              <TableCell></TableCell>
              <TableCell>{vol.status?.phase}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
