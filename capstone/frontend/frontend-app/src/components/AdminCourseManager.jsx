import { useState, useEffect } from "react";
import { viewAllCourses, deleteCourse } from "../service/courseService";
import EditCourse from "./EditCourse";
import ConfirmModal from "./ConfirmModal";

function AdminCourseManager() {
    let adminEmail = sessionStorage.getItem("adminEmail") || "admin@gmail.com";
    let [courses, setCourses] = useState([]);
    let [message, setMessage] = useState("");
    let [editingCourse, setEditingCourse] = useState(null);
    let [deleteModalCourse, setDeleteModalCourse] = useState(null);
    let [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadCourses();
    }, []);

    let loadCourses = async () => {
        try {
            let result = await viewAllCourses();
            if (result.success) {
                setCourses(result.data);
                setMessage("");
            } else {
                setMessage(result.message);
                setCourses([]);
            }
        } catch (error) {
            console.error("Error loading courses:", error);
        }
    };

    let handleEditSuccess = () => {
        setEditingCourse(null);
        loadCourses();
    };

    let handleDeleteClick = (course) => {
        setDeleteModalCourse(course);
    };

    let handleDeleteConfirm = async () => {
        if (!deleteModalCourse) return;
        setIsDeleting(true);
        try {
            let result = await deleteCourse(deleteModalCourse._id);
            console.log("Delete result:", result);
            if (result && result.success) {
                setDeleteModalCourse(null);
                loadCourses();
            } else {
                alert((result && result.message) || "Failed to delete course");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            alert("Failed to delete course");
        }
        setIsDeleting(false);
    };

    let handleDeleteCancel = () => {
        setDeleteModalCourse(null);
    };

    if (editingCourse) {
        return (
            <EditCourse
                courseId={editingCourse}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditingCourse(null)}
                requestingUser={adminEmail}
                userType="admin"
            />
        );
    }

    return (
        <div className="course-card">
            <h3>Manage All Courses</h3>
            <p className="small-note">View and edit all courses in the system.</p>
            {message && <p className="msg-error">{message}</p>}
            {courses.length === 0 && !message ? (
                <p className="small-note">No courses available.</p>
            ) : (
                <div className="table-wrap">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Instructor</th>
                                <th>Duration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course._id}>
                                    <td>{course.title}</td>
                                    <td>{course.description}</td>
                                    <td>{course.instructor}</td>
                                    <td>{course.duration} hrs</td>
                                    <td>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button
                                                className="button"
                                                onClick={() => setEditingCourse(course._id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="button danger"
                                                onClick={() => handleDeleteClick(course)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteModalCourse}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Course"
                message={`Are you sure you want to delete "${deleteModalCourse?.title}"? This will also delete all enrollments, materials, feedback, and chat messages associated with this course. This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                isDeleting={isDeleting}
            />
        </div>
    );
}

export default AdminCourseManager;
