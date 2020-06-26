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
}