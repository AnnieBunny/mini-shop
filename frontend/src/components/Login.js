import { useState, useContext } from "react";
import { AuthContext } from "../../src/contexts/AuthContext";
import { useNavigate } from "react-router-dom";


function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();
            login(data.token, data.email);
            navigate("/");
        } else {
            const text = await res.text();
            
            alert("Login failed: " + text);
        }
    };

    return (
        <>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>

            </form>
            <span>If you dont have an acount: </span>
            <button onClick={() => {
                navigate("/register");
            }}>Registration</button>
        </>


    );
}

export default Login;