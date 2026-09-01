import { useEffect } from "react";
import { useState } from "react";
import { viewAllCourses } from "../../service/courseService";
import { requestEnrollment, getStudentEnrollments } from "../../service/enrollmentService";
import Modal from "../Modal";
import ConfirmModal from "../ConfirmModal";

function ViewAllCourseByStudent() {
    let userEmail = sessionStorage.getItem("userEmail");
    let [courses, setCourses] = useState([]);
    let [message, setMessage] = useState("");
    let [showConfirmModal, setShowConfirmModal] = useState(false);
    let [showResultModal, setShowResultModal] = useState(false);
    let [selectedCourse, setSelectedCourse] = useState(null);
    let [resultMessage, setResultMessage] = useState("");
    let [enrollmentStatus, setEnrollmentStatus] = useState({});

    useEffect(() => {
        loadAllCourses();
        loadEnrollmentStatus();
    }, []);

    let loadAllCourses = async () => {
        try {
            let result = await viewAllCourses();
            console.log("All courses loaded:", result.data);
            setCourses(result.data);
        } catch (error) {
            console.error("Error loading all courses:", error);
        }
    };

    let loadEnrollmentStatus = async () => {
        try {
            let result = await getStudentEnrollments(userEmail);
            if (result.success) {
                let statusMap = {};
                result.data.forEach(enrollment => {
                    statusMap[enrollment.courseId] = enrollment.status;
                });
                setEnrollmentStatus(statusMap);
            }
        } catch (error) {
            console.error("Error loading enrollment status:", error);
        }
    };

    let handleRequestClick = (course) => {
        setSelectedCourse(course);
        setShowConfirmModal(true);
    };

    let handleRequestAccess = async () => {
        if (!selectedCourse) return;
        setShowConfirmModal(false);

        try {
            let result = await requestEnrollment(selectedCourse._id, userEmail);
            if (result.success) {
                setResultMessage("Enrollment request submitted successfully!");
                setEnrollmentStatus(prev => ({ ...prev, [selectedCourse._id]: "pending" }));
            } else {
                setResultMessage(result.message);
            }
            setShowResultModal(true);
        } catch (error) {
            console.error("Error requesting enrollment:", error);
            setResultMessage("An error occurred. Please try again.");
            setShowResultModal(true);
        }
    };

    return(
        <div className="course-card">
            <h3>View All Courses</h3>
            <p className="small-note">Browse the full catalog of available lessons and programs.</p>
            {message && <p className="msg-error">{message}</p>}
            <div className="table-wrap">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Instructor</th>
                            <th>Duration</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course._id}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>{course.instructor}</td>
                                <td>{course.duration}</td>
                                <td>
                                    {enrollmentStatus[course._id] === "approved" && (
                                        <button className="button" disabled>Enrolled</button>
                                    )}
                                    {enrollmentStatus[course._id] === "pending" && (
                                        <button className="button" disabled>Request Pending</button>
                                    )}
                                    {!enrollmentStatus[course._id] && (
                                        <button
                                            className="button"
                                            onClick={() => handleRequestClick(course)}
                                        >
                                            Request Access
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ConfirmModal
                isOpen={showConfirmModal}
                title="Confirm Enrollment Request"
                message={`Are you sure you want to request access to "${selectedCourse?.title}"?`}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleRequestAccess}
                confirmText="Request"
            />
            <Modal
                isOpen={showResultModal}
                title="Enrollment Request"
                onClose={() => setShowResultModal(false)}
            >
                {resultMessage}
            </Modal>
        </div>
    )
}

export default ViewAllCourseByStudent;