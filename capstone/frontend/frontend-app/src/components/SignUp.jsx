import { useState } from "react";
import {register} from '../service/loginService';
import { useNavigate } from "react-router-dom";

function SignUp() {
let [email, setEmail] = useState('');
let [password, setPassword] = useState('');
let [typeOfUser, setTypeOfUser] = useState('');
let [msg, setMsg] = useState('');
let signUp = async (event) => {
    event.preventDefault();
    let signUpDetails = {email, password, typeOfUser};
    let result = await register(signUpDetails);
    console.log(result);
    setMsg(result.message);
    setEmail('');
    setPassword('');
    setTypeOfUser('');
}
    return(
        <div className="auth-page">
            <section className="page-card auth-card">
                <p className="eyebrow">Create account</p>
                <h3>Sign up for the portal</h3>
                <p className="small-note">Register as a student, admin, or instructor to access your dashboard.</p>
                <span className="msg-error">{msg}</span>
                <form className="form-stack" onSubmit= {signUp}>
                    <input className="input-field" type='email' placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="input-field" type='password' placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <select className="select-field" value={typeOfUser} onChange={(e) => setTypeOfUser(e.target.value)}>
                        <option value="">Select User Type</option>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                        <option value="instructor">Instructor</option>
                    </select>
                    <button className="button" type="submit">Sign Up</button>
                </form>
                <p style={{ marginTop: '12px' }}><a className="link-text" href="/login">Already have an account? Login</a></p>
            </section>
        </div>
    )
}

export default SignUp;