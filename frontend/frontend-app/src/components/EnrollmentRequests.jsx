import { useEffect, useState } from "react";
import { getPendingForInstructor, approveEnrollment, rejectEnrollment } from "../service/enrollmentService";
import { viewAllCourses } from "../service/courseService";

function EnrollmentRequests() {
    let instructorEmail = sessionStorage.getItem("instructorEmail");
    let [pendingRequests, setPendingRequests] = useState([]);
    let [courses, setCourses] = useState([]);
    let [message, setMessage] = useState("");

    useEffect(() => {
        loadPendingRequests();
        loadCourses();
    }, []);

    let loadPendingRequests = async () => {
        try {
            let result = await getPendingForInstructor(instructorEmail);
            if (result.success) {
                setPendingRequests(result.data);
                setMessage("");
            } else {
                setMessage(result.message);
                setPendingRequests([]);
            }
        } catch (error) {
            console.error("Error loading pending requests:", error);
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

    let handleApprove = async (enrollmentId) => {
        try {
            let result = await approveEnrollment(enrollmentId, instructorEmail);
            if (result.success) {
                alert("Enrollment approved successfully!");
                loadPendingRequests();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error approving enrollment:", error);
        }
    };

    let handleReject = async (enrollmentId) => {
        try {
            let result = await rejectEnrollment(enrollmentId, instructorEmail);
            if (result.success) {
                alert("Enrollment rejected!");
                loadPendingRequests();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error rejecting enrollment:", error);
        }
    };

    return (
        <div className="course-card">
            <h3>Pending Enrollment Requests</h3>
            <p className="small-note">Review and respond to student requests for course access.</p>
            {message && <p className="msg-error">{message}</p>}
            {pendingRequests.length === 0 && !message ? (
                <p className="small-note">No pending enrollment requests at this time.</p>
            ) : (
                <div className="table-wrap">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Student Email</th>
                                <th>Requested</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.map((request) => (
                                <tr key={request._id}>
                                    <td>{getCourseTitle(request.courseId)}</td>
                                    <td>{request.studentEmail}</td>
                                    <td>{new Date(request.requestedAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="button success"
                                            onClick={() => handleApprove(request._id)}
                                            style={{ marginRight: "0.5rem" }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="button error"
                                            onClick={() => handleReject(request._id)}
                                        >
                                            Reject
                                        </button>
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

export default EnrollmentRequests;
