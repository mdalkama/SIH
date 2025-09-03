// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

// 1️⃣ Context create
const UserContext = createContext(null);

// 2️⃣ Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);  // { id, role, ... }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("https://sih-4ptm.onrender.com/api/v1/me", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (data) {
                    setUser(data);
                }
            } catch (err) {
                console.error("Error fetching logged-in user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// 3️⃣ Custom hook for easy access
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
