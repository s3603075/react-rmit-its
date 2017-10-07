import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import firebase from 'firebase';
import { Table, Button } from 'react-bootstrap';
import Details from './Details';

class Tech extends Component {
    constructor(props)  {
        super(props)
        this.resetSelection = this.resetSelection.bind(this)
    }
    state = {
        tickets: [],
        selectedTicket: null,
        comments: [],
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

    ticketDetailsClick = (ticket) => {     
        const { selectedTicket } = this.state;
        this.setState({
            selectedTicket: (selectedTicket !== null && selectedTicket.id === ticket.id ? null : ticket)
        });
        fetch(apiurl + '/api/tickets/comments/' + ticket.id)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    comments: responseJson,
                });
            })
    }

    resetSelection(e)   {
        e.preventDefault()
        this.setState({
            selectedTicket: null
        })
        console.log(this.state.selectedTicket.id);
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
                                <th>Summary</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((ticket, i) => (
                                <tr key={i}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.email}</td>
                                    <td>{ticket.priority}</td>
                                    <td>{ticket.esclevel}</td>
                                    <td>
                                        <Button bsStyle="info" onClick={() => this.ticketDetailsClick(ticket)}>More Details</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                    </Table>
                )}
                <div>
                    {this.state.selectedTicket !== null && (
                        <Details 
                        ticket={this.state.selectedTicket} 
                        comments={this.state.comments} 
                        resetSelection= {this.resetSelection}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default Tech;