import { Outlet, useNavigate } from "react-router-dom";

function StudentDashboard() {
let userEmail = sessionStorage.getItem("userEmail");
let navigate = useNavigate();
let logout = ()=> {
    sessionStorage.removeItem("userEmail");
    navigate('/login');
}

    return(
        <div className="dashboard-shell">
            <header className="dashboard-header">
                <div>
                    <p className="eyebrow">Student portal</p>
                    <h3>Student Dashboard</h3>
                    <p className="small-note">{userEmail ? `Welcome, ${userEmail}!` : 'Please log in to view your learning dashboard.'}</p>
                </div>
                <button className="button ghost" type="button" onClick={logout}>Logout</button>
            </header>
            <nav className="dashboard-nav">
                <a className="nav-link" href="/student-dashboard/view-all-courses">View All Courses</a>
                <a className="nav-link" href="/student-dashboard/search-course-by-title">Search Course By Title</a>
                <a className="nav-link" href="/student-dashboard/my-enrollments">My Enrollments</a>
            </nav>
            <article className="panel-card">
                <Outlet />
            </article>
        </div>
    )
}

export default StudentDashboard;