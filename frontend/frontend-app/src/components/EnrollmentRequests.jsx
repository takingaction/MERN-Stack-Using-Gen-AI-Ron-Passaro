import { useEffect, useState } from "react";
import { getPendingForInstructor, approveEnrollment, rejectEnrollment } from "../service/enrollmentService";
import { viewAllCourses } from "../service/courseService";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";

function EnrollmentRequests() {
    let instructorEmail = sessionStorage.getItem("instructorEmail");
    let [pendingRequests, setPendingRequests] = useState([]);
    let [courses, setCourses] = useState([]);
    let [message, setMessage] = useState("");
    let [showConfirmModal, setShowConfirmModal] = useState(false);
    let [showResultModal, setShowResultModal] = useState(false);
    let [selectedRequest, setSelectedRequest] = useState(null);
    let [actionType, setActionType] = useState(null);
    let [resultMessage, setResultMessage] = useState("");

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

    let handleActionClick = (request, action) => {
        setSelectedRequest(request);
        setActionType(action);
        setShowConfirmModal(true);
    };

    let handleConfirm = async () => {
        if (!selectedRequest || !actionType) return;
        setShowConfirmModal(false);

        try {
            let result;
            if (actionType === "approve") {
                result = await approveEnrollment(selectedRequest._id, instructorEmail);
            } else {
                result = await rejectEnrollment(selectedRequest._id, instructorEmail);
            }

            if (result.success) {
                setResultMessage(actionType === "approve"
                    ? "Enrollment approved successfully!"
                    : "Enrollment rejected!");
                loadPendingRequests();
            } else {
                setResultMessage(result.message);
            }
            setShowResultModal(true);
        } catch (error) {
            console.error(`Error ${actionType}ing enrollment:`, error);
            setResultMessage("An error occurred. Please try again.");
            setShowResultModal(true);
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
                                            onClick={() => handleActionClick(request, "approve")}
                                            style={{ marginRight: "0.5rem" }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="button error"
                                            onClick={() => handleActionClick(request, "reject")}
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
            <ConfirmModal
                isOpen={showConfirmModal}
                title={actionType === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                message={`Are you sure you want to ${actionType} enrollment for "${selectedRequest?.studentEmail}"?`}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirm}
                confirmText={actionType === "approve" ? "Approve" : "Reject"}
            />
            <Modal
                isOpen={showResultModal}
                title={actionType === "approve" ? "Approved" : "Rejected"}
                onClose={() => setShowResultModal(false)}
            >
                {resultMessage}
            </Modal>
        </div>
    );
}

export default EnrollmentRequests;
