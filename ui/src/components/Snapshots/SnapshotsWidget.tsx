import React from "react";
import {
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Table,
} from "@material-ui/core";

import {Title} from "../Title";
import {WebSocketObject} from "../myTypes";

type Props = {
  snapshots: WebSocketObject[];
};

export default function SnapshotsWidget({snapshots}: Props) {
  return (
    <React.Fragment>
      <Title>Overview Snapshots</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Namspace</TableCell>
            <TableCell>Snapshot Class</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Ready to use</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {snapshots.map((snap) => (
            <TableRow key={snap.metadata?.uid}>
              <TableCell>{snap.metadata?.name}</TableCell>
              <TableCell>{snap.metadata?.creationTimestamp}</TableCell>
              <TableCell>{snap.spec?.resources?.requests?.storage}</TableCell>
              <TableCell>{snap.metadata?.namespace}</TableCell>
              {/* <TableCell>{snap.spec?.storageClassName}</TableCell> */}
              <TableCell></TableCell>
              <TableCell>{snap.status?.readyToUse}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
