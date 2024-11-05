import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';
import km from '../profile/assets/lll.png'
import axios from 'axios';

const Profile = () => {
  const [userName, setUserName] = useState(null);
  const [userID, setUserID] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false); // New state for attendance marked
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const id = localStorage.getItem('userID');
   
    setUserID(id);
    if (id) {
      fetchUserData(id);
    }
    

    // Cleanup camera on unmount
    return () => closeCamera();
  }, []);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`https://face-recognition-backend-gamma.vercel.app/user/profile/${id}`);
      if (response.data) {
        setUserName(response.data.userName);
        setUserImage(response.data.image ? `https://face-recognition-backend-gamma.vercel.app/uploads/${response.data.image}` : null);
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
    setAttendanceMarked(false); // Reset attendance marked state

    try {
      const response = await axios.post(`https://face-recognition-backend-gamma.vercel.app/user/attendance`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.status === "SUCCESS") {
        setUserName(response.data.userName);
        setAttendanceMarked(true); // Set attendance marked to true
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

  return (
    <div>
      <img src={km} className='logo'></img>
    <div className="profile">
        
      
       {userName && (
        <div className="user-info">
          {userImage && (
            <img src={userImage} alt="User profile" className="user-image" />
          )}
          <p className='welcome-text'><h2>Welcome,</h2> <span><strong>{userName}</strong></span></p>
        </div>
      )}


      <button onClick={isCameraOpen ? captureImage : openCamera} disabled={loading}>
        {loading ? 'Processing...' : (isCameraOpen ? 'Capture Image' : 'Mark Attendance')}
      </button>

      {isCameraOpen && (
        <div className="camera">
          <video ref={videoRef} autoPlay playsInline className="video" />
          <button onClick={closeCamera} className="close-button">Close Camera</button>
        </div>
      )}

{attendanceMarked && (
        <div className="user-name">
          <p>Attendance marked for: <strong>{userName}</strong></p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div></div>
  );
};

export default Profile;
