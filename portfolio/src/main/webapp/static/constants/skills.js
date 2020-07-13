export default (() => {
    const skills = [
        { name: 'Javascript', color: 'warning' },
        { name: 'HTML', color: 'primary' },
        { name: 'CSS', color: 'danger' },
        { name: 'Cloud Services', color: 'info' },
        { name: 'C++', color: 'warning' },
        { name: 'Git', color: 'dark' },
        { name: 'Data Structures and Algorithms', color: 'info' },
        { name: 'Node.js', color: 'success' },
        { name: 'SQL', color: 'dark' },
        { name: 'React.js', color: 'primary' },
        { name: 'Web Development', color: 'info' },
        { name: 'GraphQL', color: 'danger' },
        { name: 'AWS', color: 'warning' },
        { name: 'Infrastructure design', color: 'info' },
        { name: 'MongoDB', color: 'success' },
        { name: 'NoSQL', color: 'dark' },
        { name: 'Scrum', color: 'info' },
    ];

    const skills_section = document.getElementById('skills');
    for (const skill of skills) {
        const tag = document.createElement('span');

        tag.innerHTML = skill.name;
        tag.classList.add('badge', `badge-${skill.color}`, 'badge-skill');

        skills_section.append(tag);
    }
})();