const createCommentElement = commentPayload => {
    const username = document.createElement("span");
    const sentiment = document.createElement("span");
    const comment = document.createElement("p");
    const deleteOption = document.createElement("i");

    username.innerHTML = `@ ${commentPayload.username}`;
    username.classList.add("badge", "badge-dark");
    comment.innerHTML = commentPayload.comment;

    const emotion = commentPayload.emotion;

    const badgeToSet =
        emotion === "Mad" ? "danger" :
        emotion === "Neutral" ? "warning" :
        "success";
    
    sentiment.innerHTML = `# ${emotion}`;
    sentiment.classList.add("badge", `badge-${badgeToSet}`);
    
    deleteOption.classList.add("fas", "fa-trash", "icon");
    deleteOption.onclick = () => deleteComment(commentPayload.id);

    const commentToAppend = document.createElement("li");

    commentToAppend.id = commentPayload.id;
    commentToAppend.classList.add("list-group-item", "text-wrap", "list-item-comment");

    const header = document.createElement("div");
    header.classList.add("header");

    const tagsSection = document.createElement("div");
    tagsSection.classList.add("header-tags");

    tagsSection.appendChild(username);
    tagsSection.appendChild(sentiment);

    header.appendChild(tagsSection);
    header.appendChild(deleteOption);

    commentToAppend.appendChild(header);
    commentToAppend.appendChild(document.createElement("br"));
    commentToAppend.appendChild(comment);

    return commentToAppend;
};