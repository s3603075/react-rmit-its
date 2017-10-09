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
    
    componentWillReceiveProps(nextProps) {
        const newStatus = nextProps.ticket.status;
        const newEsc = nextProps.ticket.esclevel;
        this.setState({
            setStatus: newStatus,
            setEsclevel: newEsc,
        })
    }

    closeModal = (bool) => {
        this.setState({showModal: bool});
    }

    handleStatusChange = (e) => {
        this.setState({
            status: e.target.value
        });      
    }

    changeStatus = () =>  {
        if(this.state.status === null) {
            return;
        }
        fetch(apiurl+"api/tickets/status/"+this.props.ticket.id+"?status="+this.state.status, {
            method: 'PUT'
        })
         .then((response) => {
            if(response.ok) {
                this.props.setTickets();
            }
        })

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
        var ticketsRef =  firebase.database().ref('ticket/' + this.props.ticket.id);
        ticketsRef.update({
            esclevel: this.state.esclevel,
        });   
        this.props.setTickets();
        
    }


    render () {
        return (
            <div className="static-modal">
                <Modal show={this.state.showModal}>
                    <Modal.Header>
                            <Modal.Title>Ticket #{this.props.ticket.id}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h2>Issue</h2>
                            <div>
                                {this.state.setStatus}
                            </div>
                            <h2>Status</h2>
                                <select className="form-control" onChange={this.handleStatusChange} defaultValue="-1">
                                    <option value="-1" defaultValue disabled>Select priority</option>
                                        <option value={1}>Resolved</option>
                                        <option value={2}>Unresolved</option>
                                        <option value={3}>In Progress</option>
                                </select>
                                <div className="clearfix"><br/>
                                        <Button className="pull-right" bsStyle="success" onClick={this.changeStatus}>Assign</Button>
                                </div>
                            <h2>Change Escalation Level</h2>
                            <div>
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