
// ========================================
// 1. DOM ELEMENTS
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
// 2. HELPER FUNCTIONS
// ========================================

// Escape HTML to prevent unsafe content in project cards

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
// 3. CREATE PROJECT CARDS
// ========================================

function createProjectCard(project) {

    const toolsHTML = project.tools
        .map(tool => `
            <span class="tool-tag">
                ${escapeHTML(tool)}
            </span>
        `)
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

                <h3>
                    ${escapeHTML(project.title)}
                </h3>

                <p>
                    ${escapeHTML(project.description)}
                </p>

                <div class="project-tools">
                    ${toolsHTML}
                </div>

                <button
                    type="button"
                    class="project-link"
                    data-project-id="${escapeHTML(project.id)}">

                    View Project →

                </button>

            </div>

        </article>
    `;
}


// ========================================
// 4. RENDER PROJECTS
// ========================================

function renderProjects() {

    if (!academicContainer || !personalContainer) {
        console.error("Project containers not found.");
        return;
    }

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
// 5. PREPARE README CONTENT
// ========================================

// Convert relative README image paths into raw GitHub URLs.
// Convert relative README links into GitHub file links.

function prepareReadmeHTML(html, project) {

    const parser = new DOMParser();

    const documentFragment = parser.parseFromString(
        html,
        "text/html"
    );

    const repositoryURL = new URL(project.github);

    const owner = repositoryURL.pathname.split("/")[1];
    const repo = repositoryURL.pathname.split("/")[2];

    const rawBase =
        `https://raw.githubusercontent.com/${owner}/${repo}/main/`;

    const githubBase =
        `https://github.com/${owner}/${repo}/blob/main/`;

    // Fix image paths

    documentFragment.querySelectorAll("img").forEach(image => {

        const source = image.getAttribute("src");

        if (
            source &&
            !source.startsWith("http") &&
            !source.startsWith("//") &&
            !source.startsWith("data:")
        ) {
            image.src = new URL(source, rawBase).href;
        }

        image.loading = "lazy";

    });

    // Fix relative links

    documentFragment.querySelectorAll("a").forEach(link => {

        const href = link.getAttribute("href");

        if (
            href &&
            !href.startsWith("http") &&
            !href.startsWith("//") &&
            !href.startsWith("mailto:") &&
            !href.startsWith("#")
        ) {
            link.href = new URL(href, githubBase).href;
        }

        if (link.href.startsWith("https://")) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }

    });

    return documentFragment.body.innerHTML;
}


// ========================================
// 6. OPEN PROJECT DETAILS
// ========================================

async function openProject(projectId) {

    const project = projects.find(
        item => item.id === projectId
    );

    if (!project) {
        console.error("Project not found:", projectId);
        return;
    }

    // Display project information

    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;

    // Display project tools

    modalTools.innerHTML = project.tools
        .map(tool => `
            <span class="tool-tag">
                ${escapeHTML(tool)}
            </span>
        `)
        .join("");

    // Display external project link

    modalGithub.href = project.github;

    // Open modal

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    modalClose.focus();

    // Display loading message

    modalReadme.textContent = "Loading project documentation...";

    // Handle projects without README

    if (!project.readme) {

        modalReadme.textContent =
            "Project documentation is not available here. " +
            "Please use the project materials link above.";

        return;
    }

    // Fetch README from GitHub

    try {

        const response = await fetch(project.readme);

        if (!response.ok) {
            throw new Error(
                `README request failed: ${response.status}`
            );
        }

        const markdown = await response.text();

        // Convert Markdown into HTML

        const html = marked.parse(markdown);

        // Sanitize HTML

        const safeHTML = DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true }
        });

        // Fix relative image and link paths

        const preparedHTML = prepareReadmeHTML(
            safeHTML,
            project
        );

        modalReadme.innerHTML = preparedHTML;

    } catch (error) {

        console.error("README loading error:", error);

        modalReadme.textContent =
            "Unable to load README. " +
            "Please visit the project repository to view its documentation.";

    }

}


// ========================================
// 7. CLOSE PROJECT MODAL
// ========================================

function closeProject() {

    modal.classList.remove("active");

    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


// ========================================
// 8. EVENT LISTENERS
// ========================================

// Handle clicks on project buttons

document.addEventListener("click", function(event) {

    const projectButton = event.target.closest(
        "[data-project-id]"
    );

    if (projectButton) {

        const projectId = projectButton.dataset.projectId;

        openProject(projectId);

    }

});


// Close modal using close button

modalClose.addEventListener("click", closeProject);


// Close modal by clicking overlay

modalOverlay.addEventListener("click", closeProject);


// Close modal using Escape key

document.addEventListener("keydown", function(event) {

    if (
        event.key === "Escape" &&
        modal.classList.contains("active")
    ) {
        closeProject();
    }

});


// ========================================
// 9. INITIALIZE WEBSITE
// ========================================

renderProjects();
