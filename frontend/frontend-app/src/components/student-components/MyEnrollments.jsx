import { useEffect, useState } from "react";
import { getStudentEnrollments } from "../../service/enrollmentService";

function MyEnrollments() {
    let userEmail = sessionStorage.getItem("userEmail");
    let [enrollments, setEnrollments] = useState([]);
    let [message, setMessage] = useState("");

    useEffect(() => {
        loadEnrollments();
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

    let getStatusBadge = (status) => {
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
    };

    return (
        <div className="course-card">
            <h3>My Enrollments</h3>
            <p className="small-note">Track the status of your course enrollment requests.</p>
            {message && <p className="msg-error">{message}</p>}
            {enrollments.length === 0 && !message ? (
                <p className="small-note">You haven't requested any course enrollments yet.</p>
            ) : (
                <div className="table-wrap">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Course ID</th>
                                <th>Instructor</th>
                                <th>Status</th>
                                <th>Requested</th>
                                <th>Processed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((enrollment) => (
                                <tr key={enrollment._id}>
                                    <td>{enrollment.courseId}</td>
                                    <td>{enrollment.instructorEmail}</td>
                                    <td>{getStatusBadge(enrollment.status)}</td>
                                    <td>{new Date(enrollment.requestedAt).toLocaleDateString()}</td>
                                    <td>
                                        {enrollment.processedAt
                                            ? new Date(enrollment.processedAt).toLocaleDateString()
                                            : "-"}
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

export default MyEnrollments;
