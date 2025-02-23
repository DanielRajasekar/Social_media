import React, { useEffect, useState } from 'react';
import MenuBar from './MenuBar';
import axios from 'axios';
import { URL } from '../url';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function GetNotes() {
  const [notes, setNotes] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNoteData, setEditNoteData] = useState({});
  const [editFile, setEditFile] = useState(null); // For file input
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${URL}/api/user/notes`);
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, [refresh]);

  const handleEditClick = (note) => {
    setEditNoteData(note);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('caption', editNoteData.caption);
      if (editFile) {
        formData.append('file', editFile);
      }

      await axios.put(`${URL}/api/user/notes/${editNoteData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowEditModal(false);
      setRefresh(!refresh); // Refresh notes after editing
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDelete = async (noteId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this note?');
  
    if (isConfirmed) {
      try {
        await axios.delete(`${URL}/api/user/notes/${noteId}`);
        setRefresh(!refresh); // Refresh notes after deleting
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    } else {
      console.log('Delete action canceled');
    }
  };

  const handleEditChange = (e) => {
    setEditNoteData({ ...editNoteData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEditFile(e.target.files[0]);
  };

  return (
    <>
      <MenuBar />
      <div className="container mt-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-primary">Notes Details</h5>
            <table className="table table-striped table-bordered text-center">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">File</th>
                  <th scope="col">Caption</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <tr key={note._id}>
                      <td>
                        <img 
                          src={`${URL}/${note.filepath}`} 
                          alt="Note" 
                          style={{ width: "100px", height: "100px", objectFit: "cover" }} 
                        />
                      </td>
                      <td>{note.caption}</td>
                      <td>
                        <Button
                          className="m-1"
                          onClick={() => handleEditClick(note)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          className="m-1"
                          onClick={() => handleDelete(note._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No notes available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Note Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control
                type="text"
                name="caption"
                value={editNoteData.caption || ''}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>File</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GetNotes;
