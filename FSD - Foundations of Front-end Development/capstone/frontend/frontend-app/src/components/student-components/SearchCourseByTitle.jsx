import { useState } from "react";
import { viewCourseByTitle } from "../../service/courseService";
function SearchCourseByTitle() {
let [course, setCourse] = useState(null);
let [title, setTitle] = useState("");
let [message,setMessage] = useState("");
let searchCourse = async () => {
    try {
        let result = await viewCourseByTitle(title);
        console.log("Course found:", result);
        if(result.success) {
        setCourse(result.data);
        setMessage("");
        }else {
            setCourse(null);
            setMessage(result.message);
        }
    }
    catch (error) {
        console.error("Error searching course:", error);
    }
}

    return(
        <div className="course-card">
            <h3>Search Course By Title</h3>
            <p className="small-note">Find a specific course from the catalog using its title.</p>
            <div className="search-row">
                <input className="input-field" type="text" placeholder="Enter course title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <button className="button" type="button" onClick={searchCourse}>Search</button>
            </div>
            {message && <p className="msg-error">{message}</p>}
            {course && (
                <article className="result-card">
                    <span className="badge">Found course</span>
                    <h2>{course.title}</h2>
                    <p>{course.description}</p>
                    <p><strong>Instructor:</strong> {course.instructor}</p>
                    <p><strong>Duration:</strong> {course.duration}</p>
                </article>
            )}
        </div>
    )
}

export default SearchCourseByTitle;