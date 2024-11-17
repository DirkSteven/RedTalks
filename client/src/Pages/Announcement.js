import {React, useState, useEffect} from 'react';
import axios from 'axios';

function Announcement(){
    const [announcements, setannouncements] = useState([]);

    useEffect(() => {
        // Fetch data from the backend API
        axios.get('api/announcements')
            .then(response => {
                console.log(response.data);  // Log response to inspect its structure

                // Check if the response data is an array
                if (Array.isArray(response.data)) {
                    setannouncements(response.data);
                } else if (response.data && Array.isArray(response.data.announcements)) {
                    setannouncements(response.data.announcements);  // If data is inside a 'announcements' key
                } else if (response.data && Array.isArray(response.data.data)) {
                    setannouncements(response.data.data);  // If data is inside a 'data' key
                } else {
                    console.error('Unexpected response structure:', response.data);
                    setannouncements([]);  // Set empty array to avoid errors
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="list">
            {announcements.length === 0 ? (
                <p>No announcements atm</p>
            ) : (
                announcements.map(announcement => (
                    <div key={announcement.id} className="announcementItem">
                        <h3>{announcement.title}</h3>
                        <p>{announcement.content}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Announcement;