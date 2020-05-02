import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from "react-router-dom";

function TeamDetails() {

    const classes = useStyles();
    const location = useLocation();

    return (
        <div className={classes.center}>
            {location.state}
        </div>
    );
}

export default TeamDetails;

const useStyles = makeStyles({
    root: {
        backgroundColor: 'black',
        height: '100vh'
    },
    center: {
        backgroundColor: 'white',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    },
    cell: {
        width: '100%',
    }
});