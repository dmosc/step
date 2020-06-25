export default (() => {
    const hobbies = ["Movies (Harry, Marvel, DC)", "Machine Learning", "Golf"];
    
    const hobbies_section = document.getElementById("hobbies");
    hobbies.forEach(hobby => {
        const hobby_to_append = document.createElement("li");

        hobby_to_append.classList.add("list-group-item", "text-wrap", "list-item-portfolio");
        hobby_to_append.innerHTML = hobby;

        hobbies_section.append(hobby_to_append);
    });
})();