import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";


function Profile() {
    // const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const res = await fetch("https://sih-4ptm.onrender.com/api/v1/me", {
    //                 method: "GET",
    //                 credentials: "include", // sends cookies
    //             });
    //             const data = await res.json();
    //             console.log(data);
    //             if (res.ok) {
    //                 setUser(data); // assuming the response has { user: {...} }
    //             } else {
    //                 console.error("Error fetching user:", data.message);
    //             }
    //         } catch (err) {
    //             console.error("Network error:", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchUser();
    // }, []);

    const { user, loading } = useUser();
    console.log(user);



    if (loading) return <p>Loading...</p>;
    if (!user) return <p>No user logged in</p>;

    return (
        <div>
            <h1>User Info</h1>
            <p>ID: {user.id}</p>
            <p>Role: {user.role}</p>
        </div>
    );
}

export default Profile;
