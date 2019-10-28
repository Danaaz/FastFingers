import React from 'react';
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import FastFingers from './components/FastFingers';
import HighScores from './components/HighScores';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const App = () => {
    const classes = useStyles();
    return(
        <Container maxWidth="lg">
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item lg={9}>
                        <Paper className={classes.paper}>
                            <FastFingers />
                        </Paper>
                    </Grid>
                    <Grid item lg={3}>
                        <Paper className={classes.paper}>
                            <HighScores />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default App;
