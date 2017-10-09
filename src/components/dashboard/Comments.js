import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import { Modal, Button } from 'react-bootstrap';

class Comments extends Component {
    constructor(props){
        super(props);
        this.state = {
          showModal: true
        }
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
                            Test
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={() => {this.props.resetSelection(); this.props.editComments(false)}}>Close</Button>
                        </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
/**/


export default Comments;