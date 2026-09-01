import { Outlet, useNavigate } from "react-router-dom";

function InstructorDashboard() {
let instructorEmail = sessionStorage.getItem("instructorEmail");
let navigate = useNavigate();
let logout = ()=> {
    sessionStorage.removeItem("instructorEmail");
    navigate('/login');
}

    return(
        <div className="dashboard-shell">
            <header className="dashboard-header">
                <div>
                    <p className="eyebrow">Instructor workspace</p>
                    <h3>Instructor Dashboard</h3>
                    <p className="small-note">{instructorEmail ? `Welcome, ${instructorEmail}!` : 'Please log in to continue.'}</p>
                </div>
                <button className="button ghost" type="button" onClick={logout}>Logout</button>
            </header>
            <nav className="dashboard-nav">
                <a className="nav-link" href="/instructor-dashboard/my-courses">My Courses</a>
                <a className="nav-link" href="/instructor-dashboard/enrollment-requests">Enrollment Requests</a>
                <a className="nav-link" href="/instructor-dashboard/upload-materials">Upload Materials</a>
            </nav>
            <article className="panel-card">
                <Outlet />
            </article>
        </div>
    )
}

export default InstructorDashboard;