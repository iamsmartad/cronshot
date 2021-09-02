import {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";

import {SnapshotNameSpace} from "./Snapshot";
import {Title} from "../Title";
import {WebSocketObject} from "../myTypes";

type Props = {
  snapshots: WebSocketObject[];
  snapshotcontents: WebSocketObject[];
  snapclasses: WebSocketObject[];
};

export type SnapshotSet = {
  snapshot: WebSocketObject;
  content: WebSocketObject;
  snapclass: WebSocketObject;
};

export default function Snapshots({
  snapshots,
  snapshotcontents,
  snapclasses,
}: Props) {
  const [snapshotSet, setSnapshotSet] = useState<SnapshotSet[]>([]);
  const grouped = snapshotSet.reduce<Record<string, SnapshotSet[]>>((r, a) => {
    r[a.snapshot.metadata.namespace] = r[a.snapshot.metadata.namespace] || [];
    r[a.snapshot.metadata.namespace].push(a);
    return r;
  }, Object.create(null));

  useEffect(() => {
    const newPairs = snapshots.map((snap) => {
      var cont = snapshotcontents.find(
        (content) => content.spec.volumeSnapshotRef.name === snap.metadata.name
      );
      return {
        snapshot: snap,
        content: cont,
      } as SnapshotSet;
    });
    setSnapshotSet(newPairs);
  }, [snapshots, snapshotcontents, snapclasses]);

  return (
    <>
      <Title variant="h6">Snapshots</Title>
      <Grid container spacing={2}>
        {
          Object.keys(grouped)
            .sort((a, b) => ("" + a).localeCompare(b))
            .map((ns) => (
              <Grid item xs={12}>
                <SnapshotNameSpace namespace={ns} snapshots={grouped[ns]} />
              </Grid>
            ))
          //
        }
      </Grid>
    </>
  );
}
