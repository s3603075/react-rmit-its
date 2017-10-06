import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import firebase from 'firebase';
import { Table } from 'react-bootstrap';

class Tech extends Component {
    state = {
        tickets: [],
        priority: []
    }

    componentDidMount() {
        /* Fetch all tickets and check which tickets have
            been assigned to this tech user
         */
        fetch(apiurl + '/api/tickets')
            .then((response) => response.json())
            .then((responseJson) => {
                const myTickets = [];
                for(const ele in responseJson) {
                    firebase.database().ref('ticket/'+responseJson[ele].id).on('value', (snapshot) => {
                        if(snapshot.val() !== null && snapshot.val().user_id === this.props.user.uid) {
                            responseJson[ele].priority = snapshot.val().priority;
                            responseJson[ele].esclevel = snapshot.val().esclevel;
                            myTickets.push(responseJson[ele]);
                            /* Force the view to re-render (async problem) */
                            this.forceUpdate();
                        }
                    })
                }
                return myTickets;
            })
            .then((tickets) => {
                this.setState({
                    tickets: tickets
                });
            })
    }

    render () {
        const { tickets } = this.state;
        return (
            <div>
                <h1>My Tickets</h1>
                {tickets.length < 1 ? (
                    <div className="alert alert-info">You have not been assigned any tickets.</div>
                )
                : (
                    <Table striped hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Priority</th>
                                <th>Escalation Level</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((ticket, i) => (
                                <tr key={i}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.email}</td>
                                    <td>{ticket.priority}</td>
                                    <td>{ticket.esclevel}</td>
                                </tr>
                            ))}
                            </tbody>
                    </Table>
                )}
            </div>
        );
    }
}

export default Tech;