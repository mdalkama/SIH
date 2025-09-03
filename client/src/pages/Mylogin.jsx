import React from 'react'

const Mylogin = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = async () => {
        const res = await fetch('https://sih-4ptm.onrender.com/api/v1/student/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log(data);


    }
    return (
        <div>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="username" />
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Mylogin
