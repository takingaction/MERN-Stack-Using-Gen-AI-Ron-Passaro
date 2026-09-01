import { useState, useEffect } from "react";
import { getAllUsers, getUsersByType } from "../service/userService";

function UserManagement() {
    let [users, setUsers] = useState([]);
    let [filteredUsers, setFilteredUsers] = useState([]);
    let [activeTab, setActiveTab] = useState("all");
    let [message, setMessage] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            if (activeTab === "all") {
                setFilteredUsers(users);
            } else {
                setFilteredUsers(users.filter(u => u.typeOfUser === activeTab));
            }
        }
    }, [activeTab, users]);

    let loadUsers = async () => {
        try {
            let result = await getAllUsers();
            if (result.success) {
                setUsers(result.data);
                if (activeTab === "all") {
                    setFilteredUsers(result.data);
                } else {
                    setFilteredUsers(result.data.filter(u => u.typeOfUser === activeTab));
                }
                setMessage("");
            } else {
                setMessage(result.message);
                setUsers([]);
                setFilteredUsers([]);
            }
        } catch (error) {
            console.error("Error loading users:", error);
        }
    };

    let getTabCount = (type) => {
        return users.filter(u => type === "all" || u.typeOfUser === type).length;
    };

    return (
        <div className="course-card">
            <h3>User Management</h3>
            <p className="small-note">View all users registered in the system.</p>
            {message && <p className="msg-error">{message}</p>}

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <button
                    className={`button ${activeTab === "all" ? "" : "ghost"}`}
                    onClick={() => setActiveTab("all")}
                >
                    All ({getTabCount("all")})
                </button>
                <button
                    className={`button ${activeTab === "instructor" ? "" : "ghost"}`}
                    onClick={() => setActiveTab("instructor")}
                >
                    Instructors ({getTabCount("instructor")})
                </button>
                <button
                    className={`button ${activeTab === "student" ? "" : "ghost"}`}
                    onClick={() => setActiveTab("student")}
                >
                    Students ({getTabCount("student")})
                </button>
            </div>

            {filteredUsers.length === 0 && !message ? (
                <p className="small-note">No users found.</p>
            ) : (
                <div className="table-wrap">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>User Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.typeOfUser}`}>
                                            {user.typeOfUser}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
