import React from 'react';
import { 
    makeStyles, 
    Button 
} from '@material-ui/core';

const useStyles = makeStyles({
    button: {
        textTransform: 'none',
        color: "white"
    },
});

function LinkButton(
    props: {
        onClick: () => void,
        label: string
    }
) {

  const classes = useStyles();

  return (
    <Button 
        className={classes.button} 
        onClick={() => props.onClick()}
    >
        Logout
    </Button>
  );
}

export default LinkButton;
