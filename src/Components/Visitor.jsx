import React, { useEffect, useState, useCallback } from "react";
import { Eye, Users } from "lucide-react";

const Visitor = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const api = process.env.REACT_APP_API_URL;
  const ipInfoToken = process.env.REACT_APP_API_TOKEN;

  // Function to get location based on IP using ipinfo.io
  const getLocationFromIP = useCallback(async () => {
    try {
      const response = await fetch(
        `https://ipinfo.io/json?token=${ipInfoToken}`
      );
      const locationData = await response.json();
      return {
        city: locationData.city,
        country: locationData.country,
      };
    } catch (error) {
      console.error("Failed to get location from IP:", error);
      return { city: "Unknown", country: "Unknown" };
    }
  }, [ipInfoToken]);

  useEffect(() => {
    const checkVisitor = async () => {
      const visitorCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("visitor="));

      if (!visitorCookie) {
        // New visitor: get location and send it in the request
        const location = await getLocationFromIP();
        const response = await fetch(`${api}/api/visitors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: location.city,
            country: location.country,
          }),
        });

        const data = await response.json();
        setVisitorCount(data.count);

        // Set a cookie to mark the visitor as counted
        document.cookie = `visitor=unique_id; max-age=${
          60 * 60 * 24 * 30
        }; path=/`;
      } else {
        // Returning visitor, just fetch the count
        const response = await fetch(`${api}/api/visitors`);
        const data = await response.json();
        setVisitorCount(data.count);
      }
    };

    // Fetch user count from API
    const fetchUserCount = async () => {
      try {
        const response = await fetch(`${api}/api/user-count`);
        const data = await response.json();
        setUserCount(data.count);
      } catch (error) {
        console.error("Failed to fetch user count:", error);
      }
    };

    checkVisitor();
    fetchUserCount();
  }, [api, getLocationFromIP]);
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between my-20">
      {/* Visitors Section */}
      <div className="flex items-center space-x-3">
        <Eye size={24} className="text-yellow-600" />
        <div className="text-gray-800 dark:text-gray-200 flex gap-2">
          <h2 className="text-lg font-semibold">Visitors</h2>
          <p className="text-xl font-bold">{visitorCount}</p>
        </div>
      </div>

      {/* Total Users Section */}
      <div className="flex items-center space-x-3">
        <Users size={24} className="text-yellow-600" />{" "}
        {/* You can change icon or color here if needed */}
        <div className="text-gray-800 dark:text-gray-200 flex gap-2">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-xl font-bold">{userCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Visitor;
