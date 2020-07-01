const GITHUB_REPOS_URL = "https://api.github.com/users/oscardavidrm/repos";
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_LIMIT = 5;
let page = 0;

const getComments = async limit => {
    let comments;
    try {
        const payload = await fetch(`/comments?limit=${limit || DEFAULT_LIMIT}`);
        const data = await payload.text();
        comments = JSON.parse(data); // Verify that the payload is in valid format.
    } catch (e) {
        console.log(e);
        return;
    }

    const commentsSectionTitle = document.getElementById("comments-title");
    commentsSectionTitle.innerHTML = `Comments (${comments?.length})`;

    const commentsSection = document.getElementById("comments");
    commentsSection.innerHTML = ""; // Empty previous loaded comments.
    comments.forEach(commentPayload => {
        const commentToAppend = createCommentElement(commentPayload);
        commentsSection.append(commentToAppend);
    });
};

const getProjects = async (page, size) => {
    const data = await fetch(`${GITHUB_REPOS_URL}?page=${page}&per_page=${DEFAULT_PAGE_SIZE}`);
    const payload = await data.text();
    const repos = JSON.parse(payload);

    const projects_section = document.getElementById("projects");
    repos.forEach(repo => {
        const card = document.createElement("div");
        const body = document.createElement("div");
        const title = document.createElement("h6");
        const tags = document.createElement("div");
        const description = document.createElement("p");

        card.onclick = () => window.open(repo.html_url);

        card.classList.add("card");
        body.classList.add("card-body");
        title.classList.add("card-title");
        tags.classList.add("card-subtitle", "list-tags");
        description.classList.add("card-text");

        title.innerHTML = repo.name;
        description.innerHTML = repo.description;

        const language = document.createElement("span");
        const createdAt = document.createElement("span");

        language.innerHTML = repo.language;
        language.classList.add("badge", "badge-success");
        createdAt.innerHTML = new Date(repo.created_at).toLocaleDateString();
        createdAt.classList.add("badge", "badge-secondary");

        tags.appendChild(language);
        tags.appendChild(createdAt);

        body.appendChild(title);
        body.appendChild(tags);
        body.appendChild(description);
        card.appendChild(body);

        projects_section.append(card);
    });
};

const loadMoreProjects =  async () => {
    ++page;
    
    getProjects(page, DEFAULT_PAGE_SIZE);

    const projects = document.getElementById("projects");
    projects.scrollTo({ top: projects.scrollHeight, behavior: "smooth" });
};

// Event listeners
const limitComments = document.getElementById("limit-form");
limitComments.addEventListener("submit", async e => {
    e.preventDefault();
    const form = new FormData(limitComments);

    limitComments.reset();

    const payload = {};
    for (var [key, value] of form.entries())
        payload[key] = value;

    getComments(payload.limit);
});