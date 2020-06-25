const get_comments = async () => {
    const payload = await fetch('/comments');
    const comments = await payload.json();

    const comments_section = document.getElementById("comments");
    comments.forEach(comment_payload => {
        const username = document.createElement("span");
        const comment = document.createElement("p");

        username.innerHTML = `@ ${comment_payload.username}`;
        username.classList.add("badge", "badge-dark");
        comment.innerHTML = comment_payload.comment;
        
        const comment_to_append = document.createElement("li");

        comment_to_append.classList.add("list-group-item", "text-wrap", "list-item-portfolio");

        comment_to_append.appendChild(username);
        comment_to_append.appendChild(document.createElement("br"));
        comment_to_append.appendChild(comment);

        comments_section.append(comment_to_append);
    });
};