import { Grid, Tooltip, Avatar, Chip } from "@material-ui/core";
type GridChipProps = {
  label?: string;
  title: string;
};
const GridChip = ({ label, title }: GridChipProps) => {
  return (
    <Grid item>
      <Tooltip title={title} arrow>
        <Chip
          color="secondary"
          avatar={<Avatar>{title.charAt(0)}</Avatar>}
          label={label}
        />
      </Tooltip>
    </Grid>
  );
};

export default GridChip;
