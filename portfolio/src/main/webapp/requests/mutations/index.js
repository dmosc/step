const deleteComment = async id => {
    try {
        await fetch(`/comment-delete`, {
            method: 'post',
            headers: { id }
        });

        const commentToDelete = document.getElementById(id);
        commentToDelete.innerHTML = "";
        commentToDelete.remove();
    } catch (e) {
        console.log("There was an error deleting the comment!");
    }
};


// Event listeners
const newCommentForm = document.getElementById("new-comment-form");
newCommentForm.addEventListener("submit", async e => {
    e.preventDefault();
    const form = new FormData(newCommentForm);

    newCommentForm.reset();

    const body = {};
    for (var [key, value] of form.entries())
        body[key] = value;

    const payload = await fetch("/comments", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await payload.text();
    const commentPayload = JSON.parse(data);

    const comments = document.getElementById("comments");
    const commentToAppend = createCommentElement(commentPayload);

    comments.insertBefore(commentToAppend, comments.firstChild);

    const commentsSectionTitle = document.getElementById("comments-title");
    commentsSectionTitle.innerHTML = `Comments (${comments?.childElementCount})`;
});