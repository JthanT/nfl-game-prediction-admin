import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

function TeamList() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.center}>
                Team
            </div>
        </div>
    );
}

export default TeamList;

const useStyles = makeStyles({
    root: {
        backgroundColor: '#BED6AC',
        height: '100vh'
    },
    center: {
        backgroundColor: 'white',
        position: 'absolute', 
        left: '50%', 
        top: '50%',
        transform: 'translate(-50%, -50%)'
    }
});