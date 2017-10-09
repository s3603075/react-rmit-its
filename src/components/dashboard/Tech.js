import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import firebase from 'firebase';
import { Table, Button } from 'react-bootstrap';
import Details from './Details';
import Comments from './Comments';

class Tech extends Component {
    constructor(props)  {
        super(props)
        this.resetSelection = this.resetSelection.bind(this)
        this.setTickets = this.setTickets.bind(this)
        this.editComments = this.editComments.bind(this)
    }
    state = {
        tickets: [],
        selectedTicket: null,
        editComments: false,
    }

    componentDidMount() {
        /* Fetch all tickets and check which tickets have
            been assigned to this tech user
         */
        this.setTickets();
    }
    
    setTickets()    {
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
                if(this.state.selectedTicket !== null)  {
                    this.updateSelectedTicket();
                }
            })
            

    }

    updateSelectedTicket()  {
        for(const ele in this.state.tickets)    {
            if(this.state.tickets[ele].id === this.state.selectedTicket.id )   {
                this.setState({
                    selectedTicket: this.state.tickets[ele]
                })
                return;
            }
        }
    }

    ticketDetailsClick = (ticket) => {     
        const { selectedTicket } = this.state;
        this.setState({
            selectedTicket: (selectedTicket !== null && selectedTicket.id === ticket.id ? null : ticket)
        });
        return;
    }

    resetSelection()   {
        this.setState({
            selectedTicket: null
        })
    }

    editComments(bool)  {
        this.setState({editComments: bool});
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
                                <th>Status</th>
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
                                    <td>{ticket.status}</td>
                                    <td>{ticket.esclevel}</td>
                                    <td>
                                        <Button bsStyle="info" onClick={() => this.ticketDetailsClick(ticket)}>More Details</Button>
                                    </td>
                                    <td>
                                        <Button bsStyle="info" onClick={() => {this.ticketDetailsClick(ticket); this.editComments(true)}}>Comments</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                    </Table>
                )}
                <div>
                    {this.state.selectedTicket !== null && this.state.editComments === false &&(
                        <Details 
                        ticket={this.state.selectedTicket} 
                        resetSelection= {this.resetSelection}
                        setTickets= {this.setTickets.bind(this)}
                        />
                    )}
                </div>
                <div>
                    {this.state.selectedTicket !== null && this.state.editComments === true && (
                        <Comments 
                        ticket={this.state.selectedTicket} 
                        resetSelection= {this.resetSelection}
                        setTickets= {this.setTickets.bind(this)}
                        editComments = {this.editComments}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default Tech;