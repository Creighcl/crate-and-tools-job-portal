import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { getDatabase, ref, get, set, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import ItemAddForm from './item-add-form';

import numeral from 'numeral';

const StarterComponent = () => {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');

    function getTotalForProjectKey(pkey) {
        return Object.values(projects[pkey]).filter((o) => o.qty && o.ea).reduce((acc, { qty, ea }) => acc + (qty * ea), 0);
    }

    function createNewProject() {
        if (!projects[newProjectName]) {
            set(ref(getDatabase(), `/open/${newProjectName}/`), { '-': '-' });
            // firebase.database()..set({ '-': '-' });
        } else {
            alert('already exists');
        }
        setNewProjectName('');
    }

    function deleteItemForProject(ikey, pkey) {
        set(ref(getDatabase(), `/open/${pkey}/${ikey}/`), null);
        // firebase.database().ref(`/open/${pkey}/${ikey}/`).set(null);
    }

    function onNewProjectNameChange({ target: { value }}) {
        setNewProjectName(value);
    }

    useEffect(() => {
        // get all projects
        if (getAuth().currentUser !== null) {
            onValue(ref(getDatabase(), '/open'), (snapshot) => {
                if (snapshot.exists()) {
                    setProjects(snapshot.val());
                } else {
                    setProjects([]);
                }
            });
            // const projectsLookup = firebase.database().ref(`/open`);
            // // console.log(projectsLookup);
            // projectsLookup.onDisconnect().cancel();
            // projectsLookup.on('value', (snapshot) => {
            //     if (snapshot.exists()) {
            //         setProjects(snapshot.val());
            //     } else {
            //         setProjects([]);
            //     }
            // });
            // console.log('logged');
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
                        <div style={ { display: 'flex', justifyContent: 'space-between', width: '100%' } }>
                            <Typography variant="body1">
                                <b>
                                    { key }
                                </b>
                            </Typography>
                            <Typography variant="body2">
                                { numeral(getTotalForProjectKey(key)).format('$0,0.00') }
                            </Typography>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails style={ { flexWrap: 'wrap' } }>
                        [ ] Name  [Edit]<br />
                        [ ] Description <br />
                        [ Save ] <br />
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
                            [ other options]
                        </div>
                    </AccordionDetails>
                    </Accordion>
                ))
            }

            <Card style={ { marginTop: 48 } }>
                <CardContent>
                    <Typography variant="h6">New Project</Typography>
                    <TextField label="Project Name" variant="outlined" value={ newProjectName } onChange={ onNewProjectNameChange } />
                    <Button variant="contained" color="primary" onClick={ createNewProject }>
                        Add New
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
};

export default StarterComponent;
