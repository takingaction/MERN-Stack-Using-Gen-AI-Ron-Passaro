import { useNavigate } from "react-router-dom";

function InstructorDashboard() {
let instructorEmail = sessionStorage.getItem("instructorEmail");
let navigate = useNavigate();
let logout = ()=> {
    sessionStorage.removeItem("instructorEmail");
    navigate('/login');
}

    return(
        <div className="dashboard-shell">
            <section className="panel-card">
                <p className="eyebrow">Instructor workspace</p>
                <h3>Instructor Dashboard</h3>
                <p className="small-note">{instructorEmail ? `Welcome, ${instructorEmail}!` : 'Please log in to continue.'}</p>
                <button className="button ghost" type="button" onClick={logout}>Logout</button>
            </section>
        </div>
    )
}

export default InstructorDashboard;