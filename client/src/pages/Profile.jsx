import { useUser } from "../context/UserContext";


function Profile() {
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
