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

let activeReadmeRequest = 0;
let previousFocusedElement = null;


// ========================================
// 2. HELPER FUNCTIONS
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
// 3. PROJECT VISUAL THEMES
// ========================================

const projectThemes = {
    "vietjet-analysis": {
        background: "#E8E5D9",
        label: "Financial Performance"
    },

    "global-sales": {
        background: "#DCEAE4",
        label: "Business Intelligence"
    },

    "financial-analysis": {
        background: "#E8E4D9",
        label: "Financial Analytics"
    },

    "vietdist": {
        background: "#DFE8E9",
        label: "Data Engineering"
    },

    "shopify-churn": {
        background: "#E4E8DC",
        label: "Predictive Analytics"
    },

    "marketing-sales-analysis": {
        background: "#E9E1D9",
        label: "Marketing Analytics"
    },

    "hr-workforce-database": {
        background: "#E0E5E8",
        label: "Database Design"
    }
};


// ========================================
// 4. CREATE PROJECT CARDS
// ========================================

function createProjectCard(project, index) {
    const toolsHTML = project.tools
        .map(tool => `
            <span class="tool-tag">
                ${escapeHTML(tool)}
            </span>
        `)
        .join("");

    const theme = projectThemes[project.id] || {
        background: "#DCEAE4",
        label: project.type
    };

    const projectNumber = String(index + 1).padStart(2, "0");

    return `
        <article class="project-card">

            <div
                class="project-visual"
                style="--visual-bg: ${theme.background}"
            >
                <span class="project-visual-label">
                    ${escapeHTML(theme.label)}
                </span>

                <span class="project-visual-number">
                    ${projectNumber}
                </span>
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
                    ${toolsHTML}
                </div>

                <button
                    type="button"
                    class="project-link"
                    data-project-id="${escapeHTML(project.id)}"
                >
                    Explore project <span>↗</span>
                </button>

            </div>
        </article>
    `;
}


// ========================================
// 5. RENDER PROJECTS
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

    // Update project counts automatically
    const academicCount = document.querySelector(
        ".project-group:first-of-type .group-heading span"
    );

    const personalCount = document.querySelector(
        ".project-group:last-of-type .group-heading span"
    );

    if (academicCount) {
        academicCount.textContent =
            `${String(academicProjects.length).padStart(2, "0")} PROJECTS`;
    }

    if (personalCount) {
        personalCount.textContent =
            `${String(personalProjects.length).padStart(2, "0")} PROJECTS`;
    }
}


// ========================================
// 6. PREPARE README CONTENT
// ========================================

function prepareReadmeHTML(html, project) {
    const parser = new DOMParser();

    const parsedDocument = parser.parseFromString(
        html,
        "text/html"
    );

    const repositoryURL = new URL(project.github);

    const pathParts = repositoryURL.pathname
        .split("/")
        .filter(Boolean);

    const owner = pathParts[0];
    const repo = pathParts[1];
    const branch = project.branch || "main";

    if (!owner || !repo) {
        return parsedDocument.body.innerHTML;
    }

    const rawBase =
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;

    const githubBase =
        `https://github.com/${owner}/${repo}/blob/${branch}/`;

    // Fix relative image paths
    parsedDocument.querySelectorAll("img").forEach(image => {
        const source = image.getAttribute("src");

        if (
            source &&
            !source.startsWith("http") &&
            !source.startsWith("//") &&
            !source.startsWith("data:")
        ) {
            try {
                image.src = new URL(source, rawBase).href;
            } catch (error) {
                console.warn("Invalid README image URL:", source);
            }
        }

        image.loading = "lazy";
    });

    // Fix relative links
    parsedDocument.querySelectorAll("a").forEach(link => {
        const href = link.getAttribute("href");

        if (
            href &&
            !href.startsWith("http") &&
            !href.startsWith("//") &&
            !href.startsWith("mailto:") &&
            !href.startsWith("#")
        ) {
            try {
                link.href = new URL(href, githubBase).href;
            } catch (error) {
                console.warn("Invalid README link:", href);
            }
        }

        if (link.protocol === "https:" || link.protocol === "http:") {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }
    });

    return parsedDocument.body.innerHTML;
}


// ========================================
// 7. OPEN PROJECT DETAILS
// ========================================

async function openProject(projectId) {
    const project = projects.find(
        item => item.id === projectId
    );

    if (!project) {
        console.error("Project not found:", projectId);
        return;
    }

    // Track the request to prevent old README responses
    // from replacing the currently selected project.
    const requestId = ++activeReadmeRequest;

    previousFocusedElement = document.activeElement;

    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;

    modalTools.innerHTML = project.tools
        .map(tool => `
            <span class="tool-tag">
                ${escapeHTML(tool)}
            </span>
        `)
        .join("");

    modalGithub.href = project.github;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    modalClose.focus();

    modalReadme.textContent = "Loading project documentation...";

    if (!project.readme) {
        modalReadme.textContent =
            "Project documentation is not available here. " +
            "Please use the project materials link above.";

        return;
    }

    try {
        const response = await fetch(project.readme);

        if (!response.ok) {
            throw new Error(
                `README request failed: ${response.status}`
            );
        }

        const markdown = await response.text();

        if (requestId !== activeReadmeRequest) {
            return;
        }

        if (typeof marked === "undefined" ||
            typeof DOMPurify === "undefined") {
            throw new Error("Markdown libraries are unavailable.");
        }

        const html = marked.parse(markdown);

        const safeHTML = DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true }
        });

        const preparedHTML = prepareReadmeHTML(
            safeHTML,
            project
        );

        if (requestId === activeReadmeRequest) {
            modalReadme.innerHTML = preparedHTML;
        }

    } catch (error) {
        console.error("README loading error:", error);

        if (requestId === activeReadmeRequest) {
            modalReadme.textContent =
                "Unable to load README. " +
                "Please visit the project repository to view its documentation.";
        }
    }
}


// ========================================
// 8. CLOSE PROJECT MODAL
// ========================================

function closeProject() {
    if (!modal.classList.contains("active")) {
        return;
    }

    // Invalidate pending README requests
    activeReadmeRequest++;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    if (
        previousFocusedElement &&
        typeof previousFocusedElement.focus === "function"
    ) {
        previousFocusedElement.focus();
    }
}


// ========================================
// 9. EVENT LISTENERS
// ========================================

document.addEventListener("click", function(event) {
    const projectButton = event.target.closest(
        "[data-project-id]"
    );

    if (projectButton) {
        openProject(projectButton.dataset.projectId);
    }
});

modalClose.addEventListener("click", closeProject);
modalOverlay.addEventListener("click", closeProject);

document.addEventListener("keydown", function(event) {
    if (
        event.key === "Escape" &&
        modal.classList.contains("active")
    ) {
        closeProject();
    }
});


// ========================================
// 10. INITIALIZE WEBSITE
// ========================================

renderProjects();
