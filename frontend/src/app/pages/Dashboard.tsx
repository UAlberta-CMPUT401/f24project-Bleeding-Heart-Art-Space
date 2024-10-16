import React, { useEffect, useState } from "react";
import axios from "axios";
import { getFirebaseToken } from "@utils/authHelper"; 

const Dashboard: React.FC = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null); 

  const checkUserSignedIn = async () => {
    const token = await getFirebaseToken();
    console.log("Token fetched:", token);
    if (token) {
      try {
        let response = await axios.get("http://localhost:3000/api/users/is-signed-in", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        console.log("Success response with Bearer token:", response.data);
        setData(response.data);
  
      } catch (err) {
        console.error("Error using Bearer token:", err);
  
        try {
          const response = await axios.get("http://localhost:3000/api/users/is-signed-in", {
            headers: {
              Authorization: `${token}`, 
            },
          });
          console.log("Success response with raw token:", response.data);
          setData(response.data); 
        } catch (err: any) { 
          console.error("Final error with raw token:", err.response || err.message);
          setError(
            "Failed to check user sign-in status: " + 
            (err.response?.data?.message || err.message) 
          );
        }
      }
    } else {
      setError("No token available. User might not be authenticated.");
    }
  };  

  useEffect(() => {
    checkUserSignedIn();
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>} 
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : "Loading..."}
    </div>
  );
};

export default Dashboard;
