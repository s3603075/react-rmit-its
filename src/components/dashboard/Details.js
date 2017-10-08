import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import firebase from 'firebase';
import { Table, Modal, Button } from 'react-bootstrap';
import { Route, Redirect } from 'react-router';

class Details extends Component {
    state = {
        showModal: true,
        status: null
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
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
            })
        alert('Status changed!'); 
    }

    render () {
        return (
            <div className="static-modal">
                <Modal show={this.state.showModal}>
                    <Modal.Header>
                            <Modal.Title>Ticket #{this.props.ticket.id}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h2>Status</h2>
                                {this.props.ticket.status}
                                <select className="form-control" onChange={this.handleStatusChange} defaultValue="-1">
                                    <option value="-1" defaultValue disabled>Select priority</option>
                                        <option value={1}>Unresolved</option>
                                        <option value={2}>Resolved</option>
                                        <option value={3}>In Progress</option>
                                </select>
                                <div className="clearfix"><br/>
                                        <Button className="pull-right" bsStyle="success" onClick={this.changeStatus}>Assign</Button>
                                </div>
                            <h2>Issue</h2>
                            <div>
                                {this.props.ticket.issue}
                            </div>
                            <h2>Comments</h2>
                             {this.props.comments.map((comment, i) => (
                                <div key={i}>
                                    {comment.body}
                                </div>   
                            ))}
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={this.props.resetSelection}>Close</Button>
                            <Button bsStyle="primary">Save changes</Button>
                        </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
/**/


export default Details;