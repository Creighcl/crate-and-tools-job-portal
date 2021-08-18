import React, { useEffect, useState } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import ItemAddForm from './item-add-form';

import firebase from "firebase/app";
import "firebase/auth";
import numeral from 'numeral';

const StarterComponent = () => {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');

    function getTotalForProjectKey(pkey) {
        return Object.values(projects[pkey]).filter((o) => o.qty && o.ea).reduce((acc, { qty, ea }) => acc + (qty * ea), 0);
    }

    function createNewProject() {
        if (!projects[newProjectName]) {
            firebase.database().ref(`/open/${newProjectName}/`).set({ '-': '-' });
        } else {
            alert('already exists');
        }
        setNewProjectName('');
    }

    function deleteItemForProject(ikey, pkey) {
        firebase.database().ref(`/open/${pkey}/${ikey}/`).set(null);
    }

    useEffect(() => {
        // get all projects
        if (firebase.auth().currentUser !== null) {
            const projectsLookup = firebase.database().ref(`/open`);
            console.log(projectsLookup);
            projectsLookup.onDisconnect().cancel();
            projectsLookup.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    setProjects(snapshot.val());
                } else {
                    setProjects([]);
                }
            });
            console.log('logged');
        } else {
            console.log('not logged in');
        }
    }, []);

    return (
        <div>
            <Typography variant="h4" style={ { marginBottom: 48 } }>Projects</Typography>
            {
                Object.keys(projects).map((key) => (<Accordion key={ key } style={ { maxWidth: 1000 } }>
                    <AccordionSummary>
                        <Typography variant="body1">
                            <b>
                                { key }
                            </b>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={ { flexWrap: 'wrap' } }>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Price (ea)</TableCell>
                                    <TableCell>Qty</TableCell>
                                    <TableCell>Cost</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    Object.keys(projects[key]).filter((o) => o !== '-').map((okey) => (
                                        <TableRow key={ okey }>
                                            <TableCell>{ okey }</TableCell>
                                            <TableCell>{ numeral(projects[key][okey].ea).format('$0,0.00') }</TableCell>
                                            <TableCell>{ projects[key][okey].qty }</TableCell>
                                            <TableCell>{ numeral(projects[key][okey].qty * projects[key][okey].ea).format('$0,0.00')}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={ () => deleteItemForProject(okey, key) }>
                                                    <DeleteForeverRoundedIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell colSpan="2" />
                                    <TableCell>{ numeral(getTotalForProjectKey(key)).format('$0,0.00') }</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableFooter>
                        </Table>
                        <div style={ { flexBasis: '100%', height: 0 } } />
                        <div style={ { marginTop: 48 } }>
                            <ItemAddForm projectKey={ key } />
                        </div>
                    </AccordionDetails>
                    </Accordion>
                ))
            }

            <Card style={ { marginTop: 48 } }>
                <CardContent>
                    <Typography variant="h6">New Project</Typography>
                    <TextField label="Project Name" variant="outlined" value={ newProjectName } onChange={ ({ target: { value }}) => setNewProjectName(value) } />
                    <Button variant="contained" color="primary" onClick={ createNewProject }>
                        Add New
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
};

export default StarterComponent;
