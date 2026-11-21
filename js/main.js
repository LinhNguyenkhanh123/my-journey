// 1. DOM ELEMENTS
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

// 2. HELPER FUNCTIONS
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

// 3. VISUAL THEMES
const projectThemes = {
    "vietjet-analysis": {
        background: "#E8E5D9",
        label: "Financial Analysis"
    },
    
    "omo-simulation": {
        background: "#E5E8D9",
        label: "Banking Simulation"
    },
    
    "global-sales": {
        background: "#DCEAE4",
        label: "Data Analytics"
    },

    "financial-analysis": {
        background: "#E8E4D9",
        label: "Data Analytics"
    },

    "vietdist": {
        background: "#DFE8E9",
        label: "Data Analytics"
    },

    "shopify-churn": {
        background: "#E4E8DC",
        label: "Data Analytics"
    },

    "marketing-sales-analysis": {
        background: "#E9E1D9",
        label: "Data Analytics"
    },

    "hr-workforce-database": {
        background: "#E0E5E8",
        label: "Data Analytics"
    }
};

// 3.1. PROJECT ARTWORK GENERATOR
function createProjectArtwork(project) {
    const artworks = {
        // Financial analysis: chart and trend line
        "financial": `
            <g class="art-grid">
                <path d="M40 35 H360 M40 85 H360 M40 135 H360 M40 185 H360"/>
            </g>
            <g class="art-bars">
                <rect x="65" y="125" width="32" height="75" rx="3"/>
                <rect x="120" y="95" width="32" height="105" rx="3"/>
                <rect x="175" y="110" width="32" height="90" rx="3"/>
                <rect x="230" y="55" width="32" height="145" rx="3"/>
                <rect x="285" y="35" width="32" height="165" rx="3"/>
            </g>
            <path class="art-line" d="M65 105 L136 72 L191 91 L246 42 L301 25"/>
            <circle class="art-dot" cx="301" cy="25" r="6"/>
        `,

        // Banking: monetary flow and circulation
        "banking": `
            <g class="art-orbits">
                <circle cx="200" cy="110" r="82"/>
                <circle cx="200" cy="110" r="55"/>
                <circle cx="200" cy="110" r="28"/>
            </g>
            <path class="art-line" d="M75 110 C75 40 325 40 325 110"/>
            <path class="art-line" d="M75 110 C75 180 325 180 325 110"/>
            <circle class="art-dot" cx="118" cy="57" r="7"/>
            <circle class="art-dot" cx="285" cy="157" r="7"/>
            <circle class="art-center" cx="200" cy="110" r="13"/>
        `,

        // Analytics: data grid and metrics
        "analytics": `
            <g class="art-grid">
                <path d="M55 35 V190 M110 35 V190 M165 35 V190 M220 35 V190 M275 35 V190 M330 35 V190"/>
                <path d="M55 60 H330 M55 110 H330 M55 160 H330"/>
            </g>
            <g class="art-blocks">
                <rect x="75" y="125" width="38" height="50" rx="3"/>
                <rect x="130" y="90" width="38" height="85" rx="3"/>
                <rect x="185" y="105" width="38" height="70" rx="3"/>
                <rect x="240" y="65" width="38" height="110" rx="3"/>
            </g>
            <circle class="art-dot" cx="299" cy="45" r="9"/>
        `,

        // Machine learning: connected data nodes
        "network": `
            <g class="art-connections">
                <path d="M95 55 L190 95 L300 40"/>
                <path d="M95 55 L110 165 L190 95"/>
                <path d="M190 95 L270 165 L300 40"/>
                <path d="M110 165 L270 165"/>
                <path d="M190 95 L190 190"/>
            </g>
            <g class="art-nodes">
                <circle cx="95" cy="55" r="12"/>
                <circle cx="190" cy="95" r="17"/>
                <circle cx="300" cy="40" r="10"/>
                <circle cx="110" cy="165" r="11"/>
                <circle cx="270" cy="165" r="14"/>
                <circle cx="190" cy="190" r="8"/>
            </g>
        `
    };

    const artworkType = {
        "vietjet-analysis": "financial",
        "financial-analysis": "analytics",
        "omo-simulation": "banking",
        "global-sales": "analytics",
        "vietdist": "analytics",
        "marketing-sales-analysis": "analytics",
        "shopify-churn": "network",
        "hr-workforce-database": "analytics"
    };

    const selectedArtwork =
        artworks[artworkType[project.id]] || artworks.analytics;

    return `
        <svg
            class="project-artwork"
            viewBox="0 0 400 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
        >
            ${selectedArtwork}
        </svg>
    `;
}

// 4. PROJECT CARDS
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
                ${createProjectArtwork(project)}
                
                <span class="project-visual-label">
                    ${escapeHTML(theme.label)}
                </span>

                <span class="project-visual-number">
                    ${projectNumber}
                </span>
            </div>

            <div class="project-info">

                <p class="project-type">
                    <span class="project-category">
                        ${escapeHTML(project.category)}
                    </span>
                
                    ${
                        project.workType
                            ? `<span class="project-work-type">
                                ${escapeHTML(project.workType)}
                               </span>`
                            : ""
                    }
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

// 5. RENDER PROJECTS
function renderProjects() {
    if (!academicContainer || !personalContainer) {
        console.error("Project containers not found.");
        return;
    }

    // Separate projects by category
    const academicProjects = projects.filter(
        project => project.category === "Academic Project"
    );
    const personalProjects = projects.filter(
        project => project.category === "Personal Project"
    );

    // Render project cards
    academicContainer.innerHTML = academicProjects
        .map(createProjectCard)
        .join("");
    personalContainer.innerHTML = personalProjects
        .map(createProjectCard)
        .join("");

    // Update dashboard counts
    const totalCount = document.getElementById(
        "total-project-count"
    );
    const academicCount = document.getElementById(
        "academic-project-count"
    );
    const personalCount = document.getElementById(
        "personal-project-count"
    );
    if (totalCount) {
        totalCount.textContent =
            String(projects.length).padStart(2, "0");
    }
    if (academicCount) {
        academicCount.textContent =
            String(academicProjects.length).padStart(2, "0");
    }
    if (personalCount) {
        personalCount.textContent =
            String(personalProjects.length).padStart(2, "0");
    }

    // Update project section heading counts
    const academicHeadingCount = document.getElementById(
        "academic-heading-count"
    );
    const personalHeadingCount = document.getElementById(
        "personal-heading-count"
    );
    if (academicHeadingCount) {
        academicHeadingCount.textContent =
            `${String(academicProjects.length).padStart(2, "0")} PROJECTS`;
    }
    if (personalHeadingCount) {
        personalHeadingCount.textContent =
            `${String(personalProjects.length).padStart(2, "0")} PROJECTS`;
    }
}

// 5.1. INITIALIZE PROJECT CAROUSELS
function initializeProjectCarousels() {
    const carousels = document.querySelectorAll(
        ".project-carousel"
    );
    carousels.forEach(carousel => {
        const grid = carousel.querySelector(".project-grid");
        const prevButton = carousel.querySelector(
            "[data-carousel-prev]"
        );
        const nextButton = carousel.querySelector(
            "[data-carousel-next]"
        );
        if (!grid || !prevButton || !nextButton) {
            return;
        }

        // Update navigation button states
        function updateButtons() {
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            prevButton.disabled = grid.scrollLeft <= 2;
            nextButton.disabled =
                grid.scrollLeft >= maxScroll - 2 || maxScroll <= 2;
        }

        // Calculate the distance of one project card
        function getScrollDistance() {
            const firstCard = grid.querySelector(".project-card");
            if (!firstCard) {
                return grid.clientWidth;
            }
            const cardWidth = firstCard.getBoundingClientRect().width;
            const styles = getComputedStyle(grid);
            const gap = parseFloat(styles.gap) || 0;
        
            return cardWidth + gap;
        }

        // Previous project
        prevButton.addEventListener("click", () => {
            grid.scrollBy({
                left: -getScrollDistance(),
                behavior: "smooth"
            });
        });

        // Next project
        nextButton.addEventListener("click", () => {
            grid.scrollBy({
                left: getScrollDistance(),
                behavior: "smooth"
            });
        });

        // Update buttons when the carousel scrolls
        grid.addEventListener("scroll", updateButtons);

        // Mouse drag support
        let isPointerDown = false;
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        let lastDragTime = 0;
        grid.addEventListener("pointerdown", event => {
            if (event.pointerType !== "mouse" || event.button !== 0) {
                return;
            }
            isPointerDown = true;
            isDragging = false;
            startX = event.clientX;
            startScrollLeft = grid.scrollLeft;
        });
        grid.addEventListener("pointermove", event => {
            if (!isPointerDown) {
                return;
            }

            const distance = event.clientX - startX;
            if (Math.abs(distance) > 5 && !isDragging) {
                isDragging = true;
                grid.classList.add("is-dragging");
                grid.setPointerCapture(event.pointerId);
            }

            if (isDragging) {
                grid.scrollLeft = startScrollLeft - distance;
            }
        });

        function stopDragging() {
            if (isDragging) {
                lastDragTime = Date.now();
            }
            isPointerDown = false;
            isDragging = false;
            grid.classList.remove("is-dragging");
        }
        grid.addEventListener("pointerup", stopDragging);
        grid.addEventListener("pointercancel", stopDragging);

        // Prevent opening a project after dragging
        grid.addEventListener("click", event => {
            if (Date.now() - lastDragTime < 400) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, true);

        // Recalculate button states when the layout changes
        window.addEventListener("resize", updateButtons);
        updateButtons();
    });
}

/* 5.2. SCROLL REVEAL */
function initializeScrollReveal() {
    const elements = document.querySelectorAll(
        ".section-heading, " +
        ".about-overview, " +
        ".about-card, " +
        ".project-card, " +
        ".contact-content, " +
        ".contact-links"
    );

    // Respect accessibility preferences
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        reduceMotion ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    elements.forEach((element, index) => {
        element.classList.add("reveal");
        // Create a subtle stagger effect
        const delay = (index % 4) * 110;
        element.style.setProperty(
            "--reveal-delay",
            `${delay}ms`
        );
        observer.observe(element);

    });
}

// 6. PREPARE README CONTENT
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

// 7. OPEN PROJECT DETAILS
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

//9. EVENT LISTENERS
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

/* SCROLL REVEAL*/
const revealElements = document.querySelectorAll(
    ".section-heading, .project-card, .about-card"
);

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
});

// ACTIVE NAVIGATION ON SCROLL
function initializeActiveNavigation() {
    const navLinks = document.querySelectorAll(
        ".nav-links a[href^='#']"
    );

    const sections = document.querySelectorAll(
        "#about, #projects, #contact"
    );

    if (
        !navLinks.length ||
        !sections.length ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                }

                const activeId = entry.target.id;

                navLinks.forEach(link => {
                    const isActive =
                        link.getAttribute("href") === `#${activeId}`;

                    link.classList.toggle("is-active", isActive);

                    if (isActive) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px",
            threshold: 0
        }
    );

    sections.forEach(section => observer.observe(section));
}

// INITIALIZE WEBSITE
renderProjects();
initializeProjectCarousels();
initializeScrollReveal();
initializeActiveNavigation();
