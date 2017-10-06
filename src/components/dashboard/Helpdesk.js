import React, { Component } from 'react';
import { apiurl } from '../../helpers/constants';
import { Table, Row, Col, Jumbotron, Button } from 'react-bootstrap';
import firebase from 'firebase';

class Helpdesk extends Component {
    state = {
        tickets: [],
        selectedTicket: null,
        comments: [],
        techUsers: [],
        selectedTech: null,
        priority: null,
        esclevel: null
    }

    /* Once component has mounted, fetch from API + firebase */
    componentDidMount() {
        /* Fetch all tickets and check which tickets have
            an assigned tech
         */
        fetch(apiurl + '/api/tickets')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    tickets: responseJson
                });
            })
        /* Creates a firebase listener which will automatically
            update the list of tech users every time a new tech
            registers into the system
         */
        const users = firebase.database().ref('user/')
        users.on('value', (snapshot) => {
            const tempTech = [];
            for(const ele in snapshot.val()) {
                if(snapshot.val()[ele].type === 'tech') {
                    tempTech.push(snapshot.val()[ele]);
                }
            }
            this.setState({
                techUsers: tempTech
            });
        })
    }

    /* Toggle the ticket dialog */
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
                console.log(this.state.comments);
            })
    }

    /* Close button for dialog */
    closeDialogClick = () => {
        this.setState({
            selectedTicket: null
        })
    }

    /* Update the selected tech from dropdown box */
    handleTechChange = (e) => {
        this.setState({
            selectedTech: e.target.value
        });
    }

    /* Click assign button */
    assignTicketToTech = () => {
        console.log(this.state.selectedTech);
        if(this.state.selectedTech === null) {
            return;
        }
        var ticketsRef =  firebase.database().ref('ticket/' + this.state.selectedTicket.id);
        if(ticketsRef === null) {
            return;
        }
        ticketsRef.on('value', (snapshot) => {
            if(snapshot.val().priority === undefined)   {
                ticketsRef.update({
                    priority: "Low"
                });
            }
            if(snapshot.val().esclevel === undefined)   {
                ticketsRef.update({
                    esclevel: "1"
                });
            } 
        })
        ticketsRef.update({
            ticket_id: this.state.selectedTicket.id,
            user_id: this.state.selectedTech
        });

        
        alert('Tech successfully assigned to ticket!');
    }

    handlePriorityChange = (e) => {
        this.setState({
            priority: e.target.value
        });      
    }

    assignPriority = () => {
        if(this.state.priority === null) {
            return;
        }
        var ticketsRef =  firebase.database().ref('ticket/' + this.state.selectedTicket.id);
        ticketsRef.update({
            priority: this.state.priority,
        });   

        alert('Priority changed!'); 
    }

    handleEscLvlChange = (e) => {
        this.setState({
            esclevel: e.target.value
        });      
    }

    assignEscLvl = () => {
        if(this.state.esclevel === null) {
            return;
        }
        var ticketsRef =  firebase.database().ref('ticket/' + this.state.selectedTicket.id);
        ticketsRef.update({
            esclevel: this.state.esclevel,
        });   

        alert('Escalation changed!'); 
    }

    /* Render the page! */
    /* TODO : Complete in your own time:
        Do you think you could split this page into separate sub-components?
     */
    render () {
        const vm = this
        const { selectedTicket, tickets, techUsers, comments } = this.state

        return (
            <div>
                <Row>
                    <Col md={(selectedTicket !== null ? 7 : 12)}>
                        <h1>Pending Tickets</h1>
                        {tickets.length < 1 && (
                            <p className="alert alert-info">There are no tickets to display.</p>
                        )}
                        <Table striped hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((ticket, i) => (
                                <tr key={i}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.email}</td>
                                    <td>
                                        <Button bsStyle={vm.state.selectedTicket !== null && vm.state.selectedTicket.id === ticket.id ? 'success' : 'info'} onClick={() => vm.ticketDetailsClick(ticket)}>More Details</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Col>
                    {selectedTicket !== null && (
                    <Col md={5}>
                        <Jumbotron style={{padding: 10}}>
                            <Button block bsStyle="danger" onClick={this.closeDialogClick}>Close Dialog</Button>
                            <h3 className="text-uppercase">Ticket Details</h3>
                            <p><b>Issue: </b>{selectedTicket.issue}</p>
                            <p><b>Title: </b><br/>{selectedTicket.title}</p>
                            {comments.map((comment, i) => (
                                <p><b>Comment: </b><br/>{comment.body}</p>
                            ))}
                            
                            {techUsers.length > 0 && (
                                <div>
                                     <hr/>
                                    <h3 className="text-uppercase">Change priority</h3>
                                    <select className="form-control" onChange={this.handlePriorityChange} defaultValue="-1">
                                    <option value="-1" defaultValue disabled>Select priority</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>

                                    <div className="clearfix"><br/>
                                        <Button className="pull-right" bsStyle="success" onClick={this.assignPriority}>Assign</Button>
                                    </div>
                                    <hr/>

                                    <h3 className="text-uppercase">Change Escalation Level </h3>
                                    <select className="form-control" onChange={this.handleEscLvlChange} defaultValue="-1">
                                    <option value="-1" defaultValue disabled>Select priority</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                    </select>

                                    <div className="clearfix"><br/>
                                        <Button className="pull-right" bsStyle="success" onClick={this.assignEscLvl}>Assign</Button>
                                    </div>

                                    <h3 className="text-uppercase">Assign to tech</h3>
                                    <select className="form-control" onChange={this.handleTechChange} defaultValue="-1">
                                    <option value="-1" defaultValue disabled>Select a tech user</option>
                                    {techUsers.map((user, i) => (
                                        <option key={i} value={user.id}>{user.name}</option>
                                    ))}
                                    </select>

                                    <div className="clearfix"><br/>
                                        <Button className="pull-right" bsStyle="success" onClick={this.assignTicketToTech}>Assign</Button>
                                    </div>
                                </div>
                                )
                            }
                        </Jumbotron>
                    </Col>
                    )}
                </Row>
            </div>
        );
    }
}

export default Helpdesk;