import {useState} from "react";
import {Grid, Collapse, CardActions, Button, Divider} from "@material-ui/core";

import {YAMLCodeBlock} from "./YAMLCodeBlock";

type Props = {
  yamlobj: any;
};

export const CardActionFooterCodeBlock = ({yamlobj}: Props) => {
  const [showYAML, setShowYAML] = useState(false);
  return (
    <>
      <Divider />
      <CardActions>
        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => setShowYAML(!showYAML)}
        >
          {showYAML ? "close" : "yaml"}
        </Button>
      </CardActions>

      <Grid container spacing={6}>
        <Grid item xs={12} spacing={4}>
          <Collapse in={showYAML}>
            <YAMLCodeBlock yamlobj={yamlobj} />
          </Collapse>
        </Grid>
      </Grid>
    </>
  );
};
