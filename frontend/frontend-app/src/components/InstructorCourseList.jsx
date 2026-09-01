import { useState, useEffect } from "react";
import { getCoursesByInstructor } from "../service/courseService";
import EditCourse from "./EditCourse";

function InstructorCourseList() {
    let instructorEmail = sessionStorage.getItem("instructorEmail");
    let [courses, setCourses] = useState([]);
    let [message, setMessage] = useState("");
    let [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        loadCourses();
    }, []);

    let loadCourses = async () => {
        try {
            let result = await getCoursesByInstructor(instructorEmail);
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

    if (editingCourse) {
        return (
            <EditCourse
                courseId={editingCourse}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditingCourse(null)}
                requestingUser={instructorEmail}
                userType="instructor"
            />
        );
    }

    return (
        <div className="course-card">
            <h3>My Courses</h3>
            <p className="small-note">Courses assigned to you for instruction.</p>
            {message && <p className="msg-error">{message}</p>}
            {courses.length === 0 && !message ? (
                <p className="small-note">No courses assigned to you yet.</p>
            ) : (
                <div className="table-wrap">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Duration</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course._id}>
                                    <td>{course.title}</td>
                                    <td>{course.description}</td>
                                    <td>{course.duration} hrs</td>
                                    <td>
                                        <button
                                            className="button"
                                            onClick={() => setEditingCourse(course._id)}
                                        >
                                            Edit
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

export default InstructorCourseList;
