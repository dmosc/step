const getComments = async (limit = 5) => {
    
    let comments;
    try {
        const payload = await fetch(`/comments?limit=${limit}`);
        const data = await payload.text();
        comments = JSON.parse(data); // Verify that the payload is in valid format.
    } catch (e) {
        return;
    }

    const commentsSectionTitle = document.getElementById("comments-title");

    commentsSectionTitle.innerHTML = `Comments (${limit})`;

    const commentsSection = document.getElementById("comments");
    commentsSection.innerHTML = ""; // Empty previous loaded comments.
    comments.forEach(commentPayload => {
        const username = document.createElement("span");
        const comment = document.createElement("p");
        const deleteOption = document.createElement("i");

        username.innerHTML = `@ ${commentPayload.username}`;
        username.classList.add("badge", "badge-dark");
        comment.innerHTML = commentPayload.comment;
        
        deleteOption.classList.add('fas', 'fa-trash', 'icon');
        deleteOption.onclick = () => deleteComment(commentPayload.id);
        
        const commentToAppend = document.createElement("li");

        commentToAppend.id = commentPayload.id;
        commentToAppend.classList.add("list-group-item", "text-wrap", "list-item-portfolio");

        commentToAppend.appendChild(username);
        commentToAppend.appendChild(document.createElement("br"));
        commentToAppend.appendChild(comment);
        commentToAppend.appendChild(deleteOption);

        commentsSection.append(commentToAppend);
    });
};