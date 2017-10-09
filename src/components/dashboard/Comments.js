import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import { Modal, Button } from 'react-bootstrap';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './react-draft-wysiwyg.css';
//import draftToHtml from 'draftjs-to-html';
//import htmlToDraft from 'html-to-draftjs';


class Comments extends Component {
    constructor(props){
        super(props);
        this.state = {
          editorState: EditorState.createEmpty(),
          showModal: true
        }
    }

    
    onEditorStateChange(editorState) {
        this.setState({
          editorState,
        });
    };

    closeModal = (bool) => {
        this.setState({showModal: bool});
    }


    render () {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                  editorState={editorState}
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor"
                  onEditorStateChange={(editorState) => {this.onEditorStateChange(editorState)}}
                />
            </div>
        );
    }
}
/**/


export default Comments;