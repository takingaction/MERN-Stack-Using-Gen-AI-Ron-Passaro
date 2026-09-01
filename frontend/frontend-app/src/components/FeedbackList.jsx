import StarRating from "./StarRating";

function FeedbackList({ feedback }) {
    if (!feedback || feedback.length === 0) {
        return (
            <div style={{ padding: "1rem", textAlign: "center" }}>
                <p className="small-note">No reviews yet. Be the first to review!</p>
            </div>
        );
    }

    return (
        <div className="feedback-list">
            {feedback.map((item) => (
                <div
                    key={item._id}
                    style={{
                        padding: "1rem",
                        marginBottom: "1rem",
                        background: "#f9f9f9",
                        borderRadius: "8px",
                        borderLeft: "4px solid #007bff"
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <strong>{item.studentEmail}</strong>
                        <StarRating value={item.rating} readonly />
                    </div>
                    <p style={{ margin: "0.5rem 0" }}>{item.comment}</p>
                    <small className="small-note">
                        {new Date(item.createdAt).toLocaleDateString()}
                    </small>
                </div>
            ))}
        </div>
    );
}

export default FeedbackList;
