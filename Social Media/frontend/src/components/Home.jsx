import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../components/context/UserContext';
import MenuBar from './MenuBar';
import axios from 'axios';
import { URL as API_URL } from '../url';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(user?.profilePic || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ensure state updates when user data changes
  useEffect(() => {
    setUsername(user?.username || '');
    setBio(user?.bio || '');
    setPreview(user?.profilePic || '');
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('bio', bio);
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      const token = localStorage.getItem('token');
      const { data } = await axios.put(`${API_URL}/api/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setUser(data.updatedUser);
      setShowModal(false);
    } catch (err) {
      setError('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <MenuBar />
      <div className="container mt-4 text-center">
        {user ? (
          <>
            <h2>Welcome, {user.username}!</h2>
            <img src={preview || "/uploads/default-profile.png"} alt="Profile" className="rounded-circle mt-3" width="150" height="150" />
            <p><strong>Bio:</strong> {user.bio || "No bio available"}</p>
            <Button className="mt-3" onClick={() => {
              console.log("Edit button clicked");
              setShowModal(true);
            }}>
              Edit Profile
            </Button>
          </>
        ) : (
          <p className="alert alert-warning">Please log in to view your profile.</p>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>

            {preview && (
              <img src={preview} alt="Preview" className="mt-3 rounded-circle" width="150" height="150" />
            )}

            {error && <p className="text-danger mt-3">{error}</p>}

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
