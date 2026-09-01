import { useState, useEffect } from "react";
import { getAllUsers } from "../service/userService";
import { viewAllCourses } from "../service/courseService";

function AdminOverview() {
    let [courseCount, setCourseCount] = useState(0);
    let [instructorCount, setInstructorCount] = useState(0);
    let [studentCount, setStudentCount] = useState(0);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    let loadStats = async () => {
        try {
            let usersResult = await getAllUsers();
            let coursesResult = await viewAllCourses();

            if (usersResult.success && coursesResult.success) {
                setCourseCount(coursesResult.data.length);
                setInstructorCount(usersResult.data.filter(u => u.typeOfUser === "instructor").length);
                setStudentCount(usersResult.data.filter(u => u.typeOfUser === "student").length);
            }
        } catch (error) {
            console.error("Error loading stats:", error);
        }
        setLoading(false);
    };

    if (loading) {
        return <p>Loading stats...</p>;
    }

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-number">{courseCount}</div>
                <div className="stat-label">Courses</div>
            </div>
            <div className="stat-card">
                <div className="stat-number">{instructorCount}</div>
                <div className="stat-label">Instructors</div>
            </div>
            <div className="stat-card">
                <div className="stat-number">{studentCount}</div>
                <div className="stat-label">Students</div>
            </div>
        </div>
    );
}

export default AdminOverview;
