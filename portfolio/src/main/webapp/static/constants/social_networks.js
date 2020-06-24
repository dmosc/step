export default (() => {
    const networks = {
        facebook: "https://www.facebook.com/oscarincarnero",
        twitter: "https://twitter.com/DAVIDOSCARRM",
        instagram: "https://www.instagram.com/oscarrodriguezm_",
        linkedin: "https://www.linkedin.com/in/oscar-rodriguez-moscosa"
    };

    const networks_section = document.getElementById('social_networks');
    for (const [key, value] of Object.entries(networks)) {
        const network_to_append = document.createElement("a");
        
        network_to_append.href = value;
        network_to_append.rel = "noopener noreferrer";
        network_to_append.target = "_blank";

        const icon = document.createElement("i");
        icon.classList.add('fab', `fa-${key}`);
        icon.style = "width: 20px; height: 20px;";

        network_to_append.appendChild(icon);
        networks_section.append(network_to_append);
    }
})();