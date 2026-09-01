import { useEffect } from "react";
import { useState } from "react";
import { viewAllCourses } from "../../service/courseService";
import { requestEnrollment } from "../../service/enrollmentService";

function ViewAllCourseByStudent() {
    let userEmail = sessionStorage.getItem("userEmail");
    let [courses, setCourses] = useState([]);
    let [message, setMessage] = useState("");

    useEffect(() => {
        loadAllCourses();
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

    let handleRequestAccess = async (courseId) => {
        try {
            let result = await requestEnrollment(courseId, userEmail);
            if (result.success) {
                alert("Enrollment request submitted successfully!");
                setMessage("");
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error requesting enrollment:", error);
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
                                    <button
                                        className="button"
                                        onClick={() => handleRequestAccess(course._id)}
                                    >
                                        Request Access
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewAllCourseByStudent;