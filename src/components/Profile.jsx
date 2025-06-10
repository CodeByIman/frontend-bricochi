import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const { token, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/users/profile",
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setProfileData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
        }
        setError("Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("No token");
    }
  }, [token, logout]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  
  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      {profileData && (
        <div className="space-y-4">
          <p><strong>Username:</strong> {profileData.username}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Role:</strong> {profileData.role}</p>
          <p><strong>Member Since:</strong> {new Date(profileData.createdAt).toLocaleDateString()}</p>
          
          {profileData.role === 'PRESTATAIRE' && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-semibold mb-2">Professional Info</h3>
              <p><strong>Speciality:</strong> {profileData.speciality || 'Not set'}</p>
              <p><strong>Location:</strong> {profileData.location || 'Not set'}</p>
              <p><strong>Hourly Rate:</strong> {profileData.hourlyRate ? `$${profileData.hourlyRate}` : 'Not set'}</p>
              {profileData.bio && <p><strong>Bio:</strong> {profileData.bio}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;