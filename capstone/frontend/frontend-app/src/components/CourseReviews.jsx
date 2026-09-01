import { useState, useEffect } from "react";
import { getCourseFeedback, getAverageRating } from "../service/feedbackService";
import FeedbackList from "./FeedbackList";
import FeedbackForm from "./FeedbackForm";

function CourseReviews({ courseId, studentEmail, canReview = false }) {
    let [feedback, setFeedback] = useState([]);
    let [ratingStats, setRatingStats] = useState({ averageRating: 0, count: 0 });
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            loadFeedback();
        }
    }, [courseId]);

    let loadFeedback = async () => {
        setLoading(true);
        try {
            let feedbackResult = await getCourseFeedback(courseId);
            let ratingResult = await getAverageRating(courseId);
            if (feedbackResult.success) {
                setFeedback(feedbackResult.data);
            }
            if (ratingResult.success) {
                setRatingStats(ratingResult.data);
            }
        } catch (error) {
            console.error("Error loading feedback:", error);
        }
        setLoading(false);
    };

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    return (
        <div className="course-reviews">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4>Reviews</h4>
                {ratingStats.count > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                            {ratingStats.averageRating.toFixed(1)}
                        </span>
                        <span style={{ color: "#ffc107", fontSize: "1.2rem" }}>★</span>
                        <span className="small-note">({ratingStats.count} review{ratingStats.count !== 1 ? "s" : ""})</span>
                    </div>
                )}
            </div>

            {canReview && (
                <FeedbackForm
                    courseId={courseId}
                    studentEmail={studentEmail}
                    onSuccess={loadFeedback}
                />
            )}

            <div style={{ marginTop: "1.5rem" }}>
                <FeedbackList feedback={feedback} />
            </div>
        </div>
    );
}

export default CourseReviews;
