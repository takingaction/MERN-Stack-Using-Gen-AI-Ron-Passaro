import { useEffect, useState } from "react";
import { getStudentEnrollments } from "../../service/enrollmentService";
import { viewAllCourses } from "../../service/courseService";
import CourseContentViewer from "../CourseContentViewer";

function MyEnrollments() {
    let userEmail = sessionStorage.getItem("userEmail");
    let [enrollments, setEnrollments] = useState([]);
    let [courses, setCourses] = useState([]);
    let [selectedCourse, setSelectedCourse] = useState(null);
    let [message, setMessage] = useState("");

    useEffect(() => {
        loadEnrollments();
        loadCourses();
    }, []);

    let loadEnrollments = async () => {
        try {
            let result = await getStudentEnrollments(userEmail);
            if (result.success) {
                setEnrollments(result.data);
                setMessage("");
            } else {
                setMessage(result.message);
                setEnrollments([]);
            }
        } catch (error) {
            console.error("Error loading enrollments:", error);
        }
    };

    let loadCourses = async () => {
        try {
            let result = await viewAllCourses();
            if (result.success) {
                setCourses(result.data);
            }
        } catch (error) {
            console.error("Error loading courses:", error);
        }
    };

    let getCourseTitle = (courseId) => {
        let course = courses.find(c => c._id === courseId);
        return course ? course.title : courseId;
    };

    let approvedEnrollments = enrollments.filter(e => e.status === "approved");

    if (selectedCourse) {
        return (
            <CourseContentViewer
                courseId={selectedCourse.courseId}
                studentEmail={userEmail}
                courseTitle={selectedCourse.title}
                onClose={() => setSelectedCourse(null)}
            />
        );
    }

    return (
        <div className="course-card">
            <h3>My Enrollments</h3>
            <p className="small-note">Track the status of your course enrollment requests.</p>
            {message && <p className="msg-error">{message}</p>}
            {approvedEnrollments.length === 0 && enrollments.length === 0 && !message ? (
                <p className="small-note">You haven't requested any course enrollments yet.</p>
            ) : (
                <div className="table-wrap">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Instructor</th>
                                <th>Status</th>
                                <th>Requested</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((enrollment) => (
                                <tr key={enrollment._id}>
                                    <td>{getCourseTitle(enrollment.courseId)}</td>
                                    <td>{enrollment.instructorEmail}</td>
                                    <td>{getStatusBadge(enrollment.status)}</td>
                                    <td>{new Date(enrollment.requestedAt).toLocaleDateString()}</td>
                                    <td>
                                        {enrollment.status === "approved" && (
                                            <button
                                                className="button"
                                                onClick={() => setSelectedCourse({
                                                    courseId: enrollment.courseId,
                                                    title: getCourseTitle(enrollment.courseId)
                                                })}
                                            >
                                                View Course
                                            </button>
                                        )}
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

function getStatusBadge(status) {
    switch (status) {
        case "pending":
            return <span className="badge pending">Pending</span>;
        case "approved":
            return <span className="badge success">Approved</span>;
        case "rejected":
            return <span className="badge error">Rejected</span>;
        default:
            return <span className="badge">{status}</span>;
    }
}

export default MyEnrollments;