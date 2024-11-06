import React, { useState, useEffect, useRef } from 'react';
import './try.css'; // For sidebar and additional layout styling
import km from '../profile/assets/lll.png';
import axios from 'axios';

const Prep = () => {
  const [userName, setUserName] = useState(null);
  const [userID, setUserID] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const videoRef = useRef(null);

  useEffect(() => {
    const id = localStorage.getItem('userID');
    setUserID(id);
    if (id) {
      fetchUserData(id);
    }

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update the current time every second

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
      closeCamera(); // Cleanup camera on unmount
    };
  }, []);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`https://face-recognition-backend-gamma.vercel.app/user/profile/${id}`);
      if (response.data) {
        setUserName(response.data.userName);
        setUserEmail(response.data.userEmail);
        setUserImage(response.data.image || null);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Could not load user data.");
    }
  };

  const openCamera = () => {
    setIsCameraOpen(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => {
        console.error("Error accessing camera:", err);
        setError("Error accessing camera. Please allow camera permissions.");
        setIsCameraOpen(false);
      });
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      uploadImage(blob);
    }, 'image/jpeg');
  };

  const uploadImage = async (imageBlob) => {
    if (!userID) {
      console.error("User ID is not available.");
      setError("User ID is not available.");
      return;
    }

    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('file', imageBlob, 'attendance.jpg');

    setLoading(true);
    setError(null);
    setAttendanceMarked(false);

    try {
      const response = await axios.post(`https://face-recognition-backend-gamma.vercel.app/user/attendance`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data && response.data.status === "SUCCESS") {
        setUserName(response.data.userName);
        setAttendanceMarked(true);
        if (response.data.imageUrl) {
          setUserImage(response.data.imageUrl);  // Set the uploaded image URL from Cloudinary
        }
      } else {
        setError("Attendance marking failed.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError("Error marking attendance: " + (error.response?.data?.message || "An unknown error occurred."));
    } finally {
      setLoading(false);
      closeCamera();
    }
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Function to format the current date
  const formatDate = () => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return currentTime.toLocaleDateString('en-US', options);
  };

  // Function to format the current time
  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <div><img src={km} alt="Logo" className="logo" /></div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="sidebar-icon">🏠</div>
        <div className="sidebar-icon">📷</div>
        <div className="sidebar-icon">📋</div>
        <div className="sidebar-icon">⚙️</div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-header">
          <h2>Profile</h2>
          {/* <div className="user-settings">
            {userName ? (
              <>
                <span className="user-name">{userName}</span>
                {userImage && <img src={userImage} alt="User Avatar" className="user-avatar" />}
              </>
            ) : (
              <span>Loading...</span>
            )}
          </div> */}
        </div>

        <div className="profile-header">
  <h2>Welcome,<br/>
    <span className="user-name-highlight">{userName}</span></h2>
  <div className="user-settings">
    {userImage && <img src={userImage} alt="User Avatar" className="user-avatar" />}
  </div>
</div>

<div className="user-info">
  <p className="user-email">{userEmail || "email"}</p>
</div>

{/* Date and Time Section */}
<div className="date-time-section">
  <p className="date-time"><strong>Date:</strong> {formatDate()}</p>
  <p className="date-time"><strong>Time:</strong> {formatTime()}</p>
</div>

<div className="upload-buttons">
  <button onClick={isCameraOpen ? captureImage : openCamera} disabled={loading} className="attendance-button">
    {loading ? 'Processing...' : (isCameraOpen ? 'Capture Image' : 'Mark Attendance')}
  </button>
</div>

        {isCameraOpen && (
          <div className="camera">
            <video ref={videoRef} autoPlay playsInline className="video" />
            <button onClick={closeCamera} className="close-button">Close Camera</button>
          </div>
        )}

        {attendanceMarked && (
          <div className="attendance-message">
            <p>Attendance marked for: <strong>{userName}</strong></p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prep;
