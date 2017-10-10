import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import firebase from 'firebase';
import { Modal, Button } from 'react-bootstrap';

class Details extends Component {
    constructor(props){
        super(props);
        this.state = {
            showModal: true,
            status: null,
            setStatus: this.props.ticket.status,
            setEsclevel: this.props.ticket.esclevel,
            esclevel: null,
        }
    }
    
    //Change props state when parent(tech.js) state changes
    componentWillReceiveProps(nextProps) {
        const newStatus = nextProps.ticket.status;
        const newEsc = nextProps.ticket.esclevel;
        this.setState({
            setStatus: newStatus,
            setEsclevel: newEsc,
        })
    }

    //Helper to close modal
    closeModal = (bool) => {
        this.setState({showModal: bool});
    }

    //Handle status change
    handleStatusChange = (e) => {
        this.setState({
            status: e.target.value
        });      
    }

    //Create a PUT request to change the status of a ticket
    changeStatus = () =>  {
        if(this.state.status === null) {
            return;
        }
        fetch(apiurl+"api/tickets/status/"+this.props.ticket.id+"?status="+this.state.status, {
            method: 'PUT'
        })
         .then((response) => {
            //If the response is successful, refresh the parent(tech.js) state of tickets, and change
            //selectedTicket state as well.  
            if(response.ok) {
                this.props.setTickets();
            }
        })

    }

    //Handles escalation level
    handleEscLvlChange = (e) => {
        this.setState({
            esclevel: e.target.value
        });      
    }

    //Assign the escalation level from within firebase
    assignEscLvl = () => {
        if(this.state.esclevel === null) {
            return;
        }
        var ticketsRef =  firebase.database().ref('ticket/' + this.props.ticket.id);
        ticketsRef.update({
            esclevel: this.state.esclevel,
        });
        //Refresh tickets state in parent   
        this.props.setTickets();
        
    }


    render () {
        return (
            <div className="static-modal">
                <Modal show={this.state.showModal} onHide={this.props.resetSelection}>
                    <Modal.Header closeButton>
                            <Modal.Title>Ticket #{this.props.ticket.id}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h4>Issue</h4>
                                <div>
                                    {this.props.ticket.issue}
                                </div>
                            <h4>Operating System</h4>
                                <div>
                                    {this.props.ticket.os}
                                    <hr/>
                                </div>
                            <h4>Status</h4>
                                <div style={{ marginBottom: 10 }}>
                                    {this.state.setStatus}
                                </div>
                                <select className="form-control" onChange={this.handleStatusChange} defaultValue="-1">
                                    <option value="-1" defaultValue disabled>Select priority</option>
                                        <option value={1}>Resolved</option>
                                        <option value={2}>Unresolved</option>
                                        <option value={3}>In Progress</option>
                                </select>
                                <div className="clearfix"><br/>
                                        <Button className="pull-right" bsStyle="success" onClick={this.changeStatus}>Assign</Button>
                                </div>
                            <h4>Change Escalation Level</h4>
                            <div style={{ marginBottom: 10 }}>
                                {this.state.setEsclevel}
                            </div>
                                <select className="form-control" onChange={this.handleEscLvlChange} defaultValue="-1">
                                    <option value="-1" defaultValue disabled>Select level</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                </select>
                                <div className="clearfix"><br/>
                                        <Button className="pull-right" bsStyle="success" onClick={this.assignEscLvl}>Assign</Button>
                                </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={this.props.resetSelection}>Close</Button>
                        </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
/**/


export default Details;