import { useState, useEffect } from "react";
import { getCoursesByInstructor } from "../service/courseService";
import { getPendingForInstructor } from "../service/enrollmentService";

function InstructorOverview() {
    let instructorEmail = sessionStorage.getItem("instructorEmail");
    let [coursesCount, setCoursesCount] = useState(0);
    let [pendingCount, setPendingCount] = useState(0);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    let loadStats = async () => {
        try {
            let [coursesResult, pendingResult] = await Promise.all([
                getCoursesByInstructor(instructorEmail),
                getPendingForInstructor(instructorEmail)
            ]);

            if (coursesResult.success) {
                setCoursesCount(coursesResult.data.length);
            }
            if (pendingResult.success) {
                setPendingCount(pendingResult.data.length);
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
                <div className="stat-number">{coursesCount}</div>
                <div className="stat-label">My Courses</div>
            </div>
            <div className="stat-card">
                <div className="stat-number">{pendingCount}</div>
                <div className="stat-label">Pending Enrollments</div>
            </div>
        </div>
    );
}

export default InstructorOverview;
