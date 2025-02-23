import React, { useState, useRef } from 'react';
import MenuBar from './MenuBar';
import axios from 'axios';
import { URL } from '../url'; // Ensure the `URL` variable is correctly exported from '../url'

const PostNotes = () => {
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null); // Reference to the file input

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 

        if (!file) {
            setError("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('file', file);

        try {
            const res = await axios.post(`${URL}/api/user/upload`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('File uploaded successfully');
            console.log(res.data);
            setCaption('');
            setFile(null);
            
            // Reset file input field
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            setError("File upload failed. Please try again.");
            console.error(err);
        }
    };

    return (
        <>
            <MenuBar />
            <div className="container mt-5">
                <h1>Create New Entry</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="caption">Caption:</label>
                        <input
                            type="text"
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="form-group mt-3">
                        <label htmlFor="file">File:</label>
                        <input
                            type="file"
                            id="file"
                            ref={fileInputRef} // Attach ref to file input
                            onChange={(e) => setFile(e.target.files[0])}
                            className="form-control"
                            required
                        />
                    </div>

                    {error && <p className="text-danger mt-2">{error}</p>}

                    <button type="submit" className="btn btn-primary mt-3">
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default PostNotes;
