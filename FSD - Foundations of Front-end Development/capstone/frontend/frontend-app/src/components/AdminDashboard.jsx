import { useNavigate } from "react-router-dom";

function AdminDashboard() {

let navigate = useNavigate();
let logout = ()=> {
    navigate('/login');
}

    return(
        <div className="dashboard-shell">
            <section className="panel-card">
                <p className="eyebrow">Admin workspace</p>
                <h3>Admin Dashboard</h3>
                <p className="small-note">Monitor and manage the learning platform from one central place.</p>
                <button className="button ghost" type="button" onClick={logout}>Logout</button>
            </section>
        </div>
    )
}

export default AdminDashboard;