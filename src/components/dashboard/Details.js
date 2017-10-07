import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import firebase from 'firebase';
import { Table, Modal, Button } from 'react-bootstrap';
import { Route, Redirect } from 'react-router';

class Details extends Component {
    state = {
        showModal: true
    }

    closeModal = (bool) => {
        this.setState({showModal: bool});
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