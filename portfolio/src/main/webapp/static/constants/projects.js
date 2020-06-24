export default (() => {
    const projects = [
        {
            title: "Stone crusher management system",
            description: "Tailored management/pos webapp for a Mexican based company dedicated to blast, smash and sell different stone types."
        },
        {
            title: "E-mail phishing web crawler detection",
            description: "Chrome extension that fetches incoming links in mail, tests them against malware and disables them if necessary. Increase links' trustfulness before accessing them."
        }
    ];

    const projects_section = document.getElementById("projects");
    projects.forEach(project => {
        const title = document.createElement("span");
        const description = document.createElement("p");

        title.innerHTML = project.title;
        title.classList.add("badge", "badge-secondary");
        description.innerHTML = project.description;
        
        const project_to_append = document.createElement("li");

        project_to_append.classList.add("list-group-item", "text-wrap");
        project_to_append.style = "width: 100%;";

        project_to_append.appendChild(title);
        project_to_append.appendChild(document.createElement("br"));
        project_to_append.appendChild(description);

        projects_section.append(project_to_append);
    });
})();