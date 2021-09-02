import React, { FunctionComponent } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { Variant } from "@material-ui/core/styles/createTypography";

type Props = {
  variant?: Variant | undefined;
};

export const Title: FunctionComponent<Props> = (props) => {
  return (
    <Typography
      component="h2"
      variant={props.variant}
      color="primary"
      gutterBottom
    >
      {props.children}
    </Typography>
  );
};

// Title.propTypes = {
//   children: PropTypes.node,
// };
