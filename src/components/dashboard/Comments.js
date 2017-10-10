import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import { Modal, Button } from 'react-bootstrap';
import { EditorState, convertToRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../react-draft-wysiwyg.css'


class Comments extends Component {
    constructor(props){
        super(props);
        this.state = {
          editorState: EditorState.createEmpty(),
          showModal: true,
          comments:[]
        }
    }

    //Mount ticket comments first
    componentDidMount() {
        this.getComments();
    }

    /*Gets the JSON from the editor and creates a POST request to store comment to ticket in 
    database.*/    
    editorChanges = () => {
        //Get current state of editor
        const rawContent = JSON.stringify( convertToRaw(this.state.editorState.getCurrentContent() ));
        //Send to API
        fetch(apiurl + '/api/tickets/comments/' + this.props.ticket.id, {
            headers:  {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: rawContent
          })
          .then((response) => {
              //Refresh state when response is successful
              if(response.ok) {
                this.getComments()
              }
        }) 
    }

    //Gets the comments from the ticket id from API
    getComments() {
      fetch(apiurl + '/api/tickets/comments/' + this.props.ticket.id)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    comments: responseJson,
                });
            })
    }

    //Draft.js state changer for editor
    onEditorStateChange(editorState) {
        this.setState({
          editorState,
        });
    };

    //Close modal when finished
    closeModal = (bool) => {
        this.setState({showModal: bool});
    }


    render () {
        const { editorState } = this.state;
        return (
           <div className="static-modal">
                <Modal show={this.state.showModal} onHide={() => {this.props.resetSelection(); this.props.editComments(false)}}>
                    <Modal.Header closeButton>
                            <Modal.Title>Ticket #{this.props.ticket.id}</Modal.Title>
                        </Modal.Header>
                        
                        <Modal.Body>
                            {this.state.comments.length < 1 && (
                             <div className="alert alert-info">No comments yet.</div>
                            )}
                            {this.state.comments.map((comment, i) => (
                                <div key={i}>
                                  <h4>ITS Support at {comment.created_at}</h4>
                                  {comment.body}
                                  <hr/>
                                </div>
                            ))}
                            <Editor
                              editorState={editorState}
                              wrapperClassName="demo-wrapper"
                              editorClassName="demo-editor"
                              onEditorStateChange={(editorState) => {this.onEditorStateChange(editorState)}}
                            />
                            <div className="clearfix"><br/>
                              <Button className="pull-right" bsStyle="success" onClick={()=> this.editorChanges()}>Save</Button>
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={() => {this.props.resetSelection(); this.props.editComments(false)}}>Close</Button>
                        </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default Comments;