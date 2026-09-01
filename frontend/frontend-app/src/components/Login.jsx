import { useState } from "react";
import {checkLoginDetails} from '../service/loginService';
import { useNavigate } from "react-router-dom";
function Login() {
let [email, setEmail] = useState('');
let [password, setPassword] = useState('');
let [typeOfUser, setTypeOfUser] = useState('');
let [msg, setMsg] = useState('');
let navigate = useNavigate();

let signIn = async (event) => {
    event.preventDefault();
    let login = {email, password, typeOfUser};
    //console.log(login);
    let result = await checkLoginDetails(login);
    console.log(result);
    if(result.message==="Logged in as admin"){
        navigate('/admin-dashboard');
    }else if(result.message==="Logged in as student"){
        sessionStorage.setItem("userEmail", email);
        navigate('/student-dashboard');
    }else if(result.message==="Logged in as instructor"){
        sessionStorage.setItem("instructorEmail", email);
        navigate('/instructor-dashboard');  
    }else {
        setMsg("Invalid credentials. Please try again.");
    }
    setEmail('');
    setPassword('');
    setTypeOfUser('');
}
    return(
        <div className="auth-page">
            <section className="page-card auth-card">
                <p className="eyebrow">Welcome back</p>
                <h3>Login to your account</h3>
                <p className="small-note">Use your email, password, and role to continue.</p>
                <span className="msg-error">{msg}</span>
                <form className="form-stack" onSubmit={signIn}>
                    <input className="input-field" type='email' placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="input-field" type='password' placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <select className="select-field" value={typeOfUser} onChange={(e) => setTypeOfUser(e.target.value)}>
                        <option value="">Select User Type</option>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                        <option value="instructor">Instructor</option>
                    </select>
                    <button className="button" type="submit">Login</button>
                </form>
                <p style={{ marginTop: '12px' }}><a className="link-text" href="/signup">Don't have an account? Sign Up</a></p>
            </section>
        </div>
    )
}

export default Login;