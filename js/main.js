
// ========================================
// 1. DOM Elements
// ========================================

const academicContainer = document.getElementById("academic-projects");
const personalContainer = document.getElementById("personal-projects");

const modal = document.getElementById("project-modal");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");

const modalCategory = document.getElementById("modal-category");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalTools = document.getElementById("modal-tools");
const modalReadme = document.getElementById("modal-readme");
const modalGithub = document.getElementById("modal-github");


// ========================================
// 2. Helper: Escape HTML
// ========================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}


// ========================================
// 3. Render Project Cards
// ========================================

function createProjectCard(project) {
    const tools = project.tools
        .map(tool => `<span class="tool-tag">${escapeHTML(tool)}</span>`)
        .join("");

    return `
        <article class="project-card">

            <div class="project-image">
                ${escapeHTML(project.type)}
            </div>

            <div class="project-info">

                <p class="project-type">
                    ${escapeHTML(project.category)}
                </p>

                <h3>${escapeHTML(project.title)}</h3>

                <p>
                    ${escapeHTML(project.description)}
                </p>

                <div class="project-tools">
                    ${tools}
                </div>

                <button
                    class="project-link"
                    data-project-id="${escapeHTML(project.id)}">
                    View Project →
                </button>

            </div>

        </article>
    `;
}


function renderProjects() {

    const academicProjects = projects.filter(
        project => project.category === "Academic Project"
    );

    const personalProjects = projects.filter(
        project => project.category === "Personal Project"
    );

    academicContainer.innerHTML = academicProjects
        .map(createProjectCard)
        .join("");

    personalContainer.innerHTML = personalProjects
        .map(createProjectCard)
        .join("");
}


// ========================================
// 4. Open Project Detail
// ========================================

async function openProject(projectId) {

    const project = projects.find(
        item => item.id === projectId
    );

    if (!project) return;

    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;

    modalTools.innerHTML = project.tools
        .map(tool => `<span class="tool-tag">${escapeHTML(tool)}</span>`)
        .join("");

    modalGithub.href = project.github;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    modalReadme.textContent = "Loading project documentation...";

    if (!project.readme) {
        modalReadme.textContent =
            "Detailed documentation is not available here. " +
            "Please use the project link to view the supporting material.";

        return;
    }

    try {

        const response = await fetch(project.readme);

        if (!response.ok) {
            throw new Error("Could not load README.");
        }

        const markdown = await response.text();

        const html = marked.parse(markdown);

        const safeHTML = DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true }
        });

        modalReadme.innerHTML = safeHTML;

    } catch (error) {

        console.error("README loading error:", error);

        modalReadme.textContent =
            "Unable to load README. Please visit the GitHub repository instead.";
    }
}


// ========================================
// 5. Close Project Detail
// ========================================

function closeProject() {

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


// ========================================
// 6. Event Listeners
// ========================================

document.addEventListener("click", function(event) {

    const projectButton = event.target.closest("[data-project-id]");

    if (projectButton) {

        const projectId = projectButton.dataset.projectId;

        openProject(projectId);
    }

});


modalClose.addEventListener("click", closeProject);

modalOverlay.addEventListener("click", closeProject);


document.addEventListener("keydown", function(event) {

    if (event.key === "Escape" && modal.classList.contains("active")) {
        closeProject();
    }

});


// ========================================
// 7. Initialize Website
// ========================================

renderProjects();
