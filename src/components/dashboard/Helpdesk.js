import React, { Component } from 'react';
import { apiurl } from '../../helpers/constants';
import { Table, Row, Col, Jumbotron, Button } from 'react-bootstrap';
import firebase from 'firebase';

class Helpdesk extends Component {
    state = {
        tickets: [],
        selectedTicket: null,
        techUsers: [],
        selectedTech: null,
        priority: null,
        esclevel: null
    }

    /* Once component has mounted, fetch from API + firebase */
    componentDidMount() {
        //Fetch all tickets
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

    /* Click assign button. Assigns ticket to tech and provides priority/esclevel
    if they do not exist already */
    assignTicketToTech = () => {
        if(this.state.selectedTech === null) {
            return;
        }
        var ticketsRef =  firebase.database().ref('ticket/' + this.state.selectedTicket.id);
        if(ticketsRef === null) {
            return;
        }
        //Provide default values if they don't exist already
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
        //Assign the ticket to the tech
        ticketsRef.update({
            ticket_id: this.state.selectedTicket.id,
            user_id: this.state.selectedTech
        });

        
        alert('Tech successfully assigned to ticket!');
    }

    //Handles changing priority in form
    handlePriorityChange = (e) => {
        this.setState({
            priority: e.target.value
        });      
    }

    //Assigns a priority within firebase
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

    //Handles escalation level
    handleEscLvlChange = (e) => {
        this.setState({
            esclevel: e.target.value
        });      
    }

    //Assigns escalation level to firebase
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

    render () {
        const vm = this
        const { selectedTicket, tickets, techUsers} = this.state

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
                            <h3>Ticket Details</h3>
                            <p><b>Issue: </b>{selectedTicket.issue}</p>                         
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
                                    <hr/>

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
                                    <hr/>
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