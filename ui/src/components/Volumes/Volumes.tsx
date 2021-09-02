import Grid from "@material-ui/core/Grid";
import { Volume } from "./Volume";
import { Title } from "../Title";
import { useStyles } from "../styles";
import { WebSocketObject } from "../myTypes";
import { VolumeNameSpace } from "./Volume";
type Props = {
  volumes: WebSocketObject[];
};

export default function Volumes({ volumes }: Props) {
  const classes = useStyles();
  const grouped = volumes.reduce<Record<string, WebSocketObject[]>>((r, a) => {
    r[a.metadata.namespace] = r[a.metadata.namespace] || [];
    r[a.metadata.namespace].push(a);
    return r;
  }, Object.create(null));
  return (
    <>
      <Title variant="h6">Volumes</Title>
      <Grid container spacing={2}>
        {
          Object.keys(grouped)
            .sort((a, b) => ("" + a).localeCompare(b))
            .map((ns) => (
              <Grid item xs={12}>
                <VolumeNameSpace
                  key={ns}
                  namespace={ns}
                  volumes={grouped[ns]}
                />
              </Grid>
            ))
          //
        }
      </Grid>
    </>
  );
}
