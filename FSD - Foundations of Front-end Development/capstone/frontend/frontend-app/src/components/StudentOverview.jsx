import { useState, useEffect } from "react";
import { getApprovedCoursesForStudent, getStudentEnrollments } from "../service/enrollmentService";
import { viewAllCourses } from "../service/courseService";

function StudentOverview() {
    let userEmail = sessionStorage.getItem("userEmail");
    let [enrolledCount, setEnrolledCount] = useState(0);
    let [pendingCount, setPendingCount] = useState(0);
    let [availableCount, setAvailableCount] = useState(0);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    let loadStats = async () => {
        try {
            let [enrolledResult, enrollmentsResult, coursesResult] = await Promise.all([
                getApprovedCoursesForStudent(userEmail),
                getStudentEnrollments(userEmail),
                viewAllCourses()
            ]);

            if (enrolledResult.success) {
                setEnrolledCount(enrolledResult.data.length);
            }
            if (enrollmentsResult.success) {
                setPendingCount(enrollmentsResult.data.filter(e => e.status === "pending").length);
            }
            if (coursesResult.success) {
                setAvailableCount(coursesResult.data.length);
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
                <div className="stat-number">{enrolledCount}</div>
                <div className="stat-label">Enrolled Courses</div>
            </div>
            <div className="stat-card">
                <div className="stat-number">{pendingCount}</div>
                <div className="stat-label">Pending Requests</div>
            </div>
            <div className="stat-card">
                <div className="stat-number">{availableCount}</div>
                <div className="stat-label">Available Courses</div>
            </div>
        </div>
    );
}

export default StudentOverview;
