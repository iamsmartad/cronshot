import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

import {Title} from "../Title";
import {WebSocketObject} from "../myTypes";

type Props = {
  volumes: WebSocketObject[];
};

export default function VolumesWidget({volumes}: Props) {
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
