import { Outlet, useNavigate } from "react-router-dom";

function AdminDashboard() {
let navigate = useNavigate();
let logout = ()=> {
    sessionStorage.removeItem("adminEmail");
    navigate('/login');
}

    return(
        <div className="dashboard-shell">
            <header className="dashboard-header">
                <div>
                    <p className="eyebrow">Admin workspace</p>
                    <h3>Admin Dashboard</h3>
                    <p className="small-note">Monitor and manage the learning platform from one central place.</p>
                </div>
                <button className="button ghost" type="button" onClick={logout}>Logout</button>
            </header>
            <nav className="dashboard-nav">
                <a className="nav-link" href="/admin-dashboard/manage-courses">Manage Courses</a>
                <a className="nav-link" href="/admin-dashboard/create-course">Create Course</a>
                <a className="nav-link" href="/admin-dashboard/user-management">User Management</a>
            </nav>
            <article className="panel-card">
                <Outlet />
            </article>
        </div>
    )
}

export default AdminDashboard;