import React from 'react'
import {useUser} from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Mylogin = () => {
    const {setUser} = useUser();
    const navigate = useNavigate();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = async () => {
        const res = await fetch('https://sih-4ptm.onrender.com/api/v1/student/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if(!res.ok){
            console.log("error");
            return;
        }

        const data = await res.json();
        if(data){
            setUser(data.user);
            console.log(data);
            navigate('/student');
        }
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
