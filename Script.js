// Global state
let currentUser = null;
let personalInfo = {
    name: 'John Developer',
    title: 'Full Stack Developer',
    bio: 'Passionate about creating beautiful and functional web applications. I love turning ideas into reality through code.',
    photo_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    resume_url: '',
    email: 'john@example.com',
    github_url: 'https://github.com/johndeveloper',
    linkedin_url: 'https://linkedin.com/in/johndeveloper',
    twitter_url: ''
};

let projects = [
    {
        id: '1',
        title: 'E-Commerce Platform',
        description: 'A modern e-commerce platform built with React and Node.js, featuring user authentication, payment integration, and inventory management.',
        long_description: 'This comprehensive e-commerce platform provides a complete online shopping experience. Features include user registration and authentication, product catalog with search and filtering, shopping cart functionality, secure payment processing with Stripe, order management, and an admin dashboard for inventory and order management.',
        image_url: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
        demo_url: 'https://ecommerce-demo.example.com',
        github_url: 'https://github.com/johndeveloper/ecommerce-platform',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'JWT', 'Tailwind CSS'],
        featured: true
    },
    {
        id: '2',
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates, project organization, and team collaboration features.',
        long_description: 'Built for teams to organize and track their work efficiently. The application includes project creation and management, task assignment with due dates and priorities, real-time collaboration with WebSocket integration, file attachments and comments, progress tracking and reporting, and role-based access control.',
        image_url: 'https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg?auto=compress&cs=tinysrgb&w=800',
        demo_url: 'https://taskmanager-demo.example.com',
        github_url: 'https://github.com/johndeveloper/task-manager',
        technologies: ['React', 'TypeScript', 'Socket.io', 'Express', 'MongoDB', 'Redux'],
        featured: true
    },
    {
        id: '3',
        title: 'Weather Dashboard',
        description: 'A responsive weather dashboard that provides current conditions, forecasts, and weather maps for multiple locations.',
        long_description: 'An intuitive weather application that helps users stay informed about weather conditions. Features include current weather conditions with detailed metrics, 7-day weather forecast, interactive weather maps, location-based weather detection, favorite locations management, and weather alerts and notifications.',
        image_url: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
        demo_url: 'https://weather-dashboard.example.com',
        github_url: 'https://github.com/johndeveloper/weather-dashboard',
        technologies: ['React', 'JavaScript', 'OpenWeather API', 'Chart.js', 'CSS3'],
        featured: false
    },
    {
        id: '4',
        title: 'Blog Platform',
        description: 'A full-featured blogging platform with markdown support, user management, and SEO optimization.',
        long_description: 'A comprehensive blogging solution for content creators and businesses. Includes markdown editor with live preview, user authentication and profiles, comment system with moderation, SEO optimization with meta tags, responsive design for all devices, and analytics dashboard for post performance.',
        image_url: 'https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg?auto=compress&cs=tinysrgb&w=800',
        demo_url: 'https://blog-platform.example.com',
        github_url: 'https://github.com/johndeveloper/blog-platform',
        technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'NextAuth.js'],
        featured: false
    }
];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const adminControls = document.getElementById('adminControls');
const loginModal = document.getElementById('loginModal');
const adminModal = document.getElementById('adminModal');
const projectModal = document.getElementById('projectModal');
const toast = document.getElementById('toast');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadContent();
});

function initializeApp() {
    // Check if user is logged in (simulate with localStorage)
    const savedUser = localStorage.getItem('portfolioUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
    
    // Load saved data
    const savedPersonalInfo = localStorage.getItem('portfolioPersonalInfo');
    if (savedPersonalInfo) {
        personalInfo = JSON.parse(savedPersonalInfo);
    }
    
    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    }
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            scrollToSection(target);
            updateActiveNavLink(link);
        });
    });
    
    // Auth buttons
    loginBtn.addEventListener('click', () => openModal('loginModal'));
    document.getElementById('adminBtn').addEventListener('click', () => openModal('adminModal'));
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Modal controls
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);
    
    // Admin tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Project management
    document.getElementById('addProjectBtn').addEventListener('click', () => openProjectForm());
    document.getElementById('cancelProjectBtn').addEventListener('click', () => closeModal('projectModal'));
    
    // Toast close
    document.getElementById('toastClose').addEventListener('click', hideToast);
    
    // Smooth scrolling for hero buttons
    window.scrollToSection = scrollToSection;
}

function loadContent() {
    updatePersonalInfo();
    loadProjects();
    updateSocialLinks();
    
    if (currentUser) {
        loadAdminContent();
    }
}

function updatePersonalInfo() {
    // Update hero section
    document.getElementById('profilePhoto').src = personalInfo.photo_url;
    document.getElementById('heroName').textContent = personalInfo.name;
    document.getElementById('heroTitle').textContent = personalInfo.title;
    document.getElementById('heroBio').textContent = personalInfo.bio;
    
    // Update about section
    document.getElementById('aboutDescription').textContent = personalInfo.bio;
    
    // Update resume download button
    const downloadBtn = document.getElementById('downloadResumeBtn');
    if (personalInfo.resume_url) {
        downloadBtn.style.display = 'inline-flex';
        downloadBtn.onclick = () => window.open(personalInfo.resume_url, '_blank');
    } else {
        downloadBtn.style.display = 'none';
    }
}

function updateSocialLinks() {
    document.getElementById('emailLink').href = `mailto:${personalInfo.email}`;
    document.getElementById('githubLink').href = personalInfo.github_url || '#';
    document.getElementById('linkedinLink').href = personalInfo.linkedin_url || '#';
    document.getElementById('twitterLink').href = personalInfo.twitter_url || '#';
}

function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image_url}" alt="${project.title}">
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-technologies">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" class="project-link">
                    <i class="fas fa-external-link-alt"></i> Demo
                </a>` : ''}
                ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> Code
                </a>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function loadAdminContent() {
    loadAdminProjects();
    loadProfileForm();
}

function loadAdminProjects() {
    const adminProjectsGrid = document.getElementById('adminProjectsGrid');
    adminProjectsGrid.innerHTML = '';
    
    if (projects.length === 0) {
        adminProjectsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p style="color: #9ca3af; font-size: 1.125rem; margin-bottom: 1rem;">No projects yet</p>
                <button class="btn btn-primary" onclick="openProjectForm()">
                    <i class="fas fa-plus"></i> Add Your First Project
                </button>
            </div>
        `;
        return;
    }
    
    projects.forEach(project => {
        const projectCard = createAdminProjectCard(project);
        adminProjectsGrid.appendChild(projectCard);
    });
}

function createAdminProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'admin-project-card';
    
    card.innerHTML = `
        <div class="admin-project-image">
            <img src="${project.image_url}" alt="${project.title}">
        </div>
        <div class="admin-project-content">
            <h4 class="admin-project-title">${project.title}</h4>
            <p class="admin-project-description">${project.description}</p>
            <div class="admin-project-technologies">
                ${project.technologies.slice(0, 3).map(tech => `<span class="admin-tech-tag">${tech}</span>`).join('')}
                ${project.technologies.length > 3 ? `<span class="admin-tech-tag">+${project.technologies.length - 3}</span>` : ''}
            </div>
            <div class="admin-project-actions">
                <div class="admin-project-links">
                    ${project.demo_url ? `<a href="${project.demo_url}" target="_blank"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    ${project.github_url ? `<a href="${project.github_url}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                </div>
                <div class="admin-project-controls">
                    <button class="btn-icon edit" onclick="editProject('${project.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteProject('${project.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function loadProfileForm() {
    document.getElementById('profileName').value = personalInfo.name;
    document.getElementById('profileTitle').value = personalInfo.title;
    document.getElementById('profileBio').value = personalInfo.bio;
    document.getElementById('profilePhoto').value = personalInfo.photo_url;
    document.getElementById('profileResume').value = personalInfo.resume_url;
    document.getElementById('profileEmail').value = personalInfo.email;
    document.getElementById('profileGithub').value = personalInfo.github_url;
    document.getElementById('profileLinkedin').value = personalInfo.linkedin_url;
}

// Event Handlers
function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Simple authentication (in real app, this would be server-side)
    if (email === 'admin@portfolio.com' && password === 'admin123') {
        currentUser = { email, id: '1' };
        localStorage.setItem('portfolioUser', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal('loginModal');
        showToast('Welcome back!', 'success');
        loadAdminContent();
    } else {
        showToast('Invalid credentials. Please try again.', 'error');
    }
}

function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Simulate form submission
    showToast('Message sent! I\'ll get back to you soon.', 'success');
    e.target.reset();
}

function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Update personal info
    personalInfo = {
        name: formData.get('name') || personalInfo.name,
        title: formData.get('title') || personalInfo.title,
        bio: formData.get('bio') || personalInfo.bio,
        photo_url: formData.get('photo_url') || personalInfo.photo_url,
        resume_url: formData.get('resume_url') || personalInfo.resume_url,
        email: formData.get('email') || personalInfo.email,
        github_url: formData.get('github_url') || personalInfo.github_url,
        linkedin_url: formData.get('linkedin_url') || personalInfo.linkedin_url,
        twitter_url: formData.get('twitter_url') || personalInfo.twitter_url
    };
    
    // Save to localStorage
    localStorage.setItem('portfolioPersonalInfo', JSON.stringify(personalInfo));
    
    // Update UI
    updatePersonalInfo();
    updateSocialLinks();
    
    showToast('Profile updated successfully!', 'success');
}

function handleProjectSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const projectId = formData.get('id');
    
    const projectData = {
        id: projectId || generateId(),
        title: formData.get('title'),
        description: formData.get('description'),
        long_description: formData.get('long_description') || '',
        image_url: formData.get('image_url'),
        demo_url: formData.get('demo_url') || '',
        github_url: formData.get('github_url') || '',
        technologies: formData.get('technologies').split(',').map(tech => tech.trim()),
        featured: formData.has('featured')
    };
    
    if (projectId) {
        // Update existing project
        const index = projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            projects[index] = projectData;
            showToast('Project updated successfully!', 'success');
        }
    } else {
        // Add new project
        projects.unshift(projectData);
        showToast('Project added successfully!', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    
    // Update UI
    loadProjects();
    loadAdminProjects();
    closeModal('projectModal');
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateAuthUI() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        adminControls.style.display = 'flex';
    } else {
        loginBtn.style.display = 'block';
        adminControls.style.display = 'none';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('portfolioUser');
    updateAuthUI();
    closeModal('adminModal');
    showToast('Logged out successfully', 'success');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function openProjectForm(projectId = null) {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    const title = document.getElementById('projectModalTitle');
    const submitText = document.getElementById('projectSubmitText');
    
    if (projectId) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            // Edit mode
            title.textContent = 'Edit Project';
            submitText.textContent = 'Update Project';
            
            // Fill form with project data
            document.getElementById('projectId').value = project.id;
            document.getElementById('projectTitle').value = project.title;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectLongDescription').value = project.long_description || '';
            document.getElementById('projectImage').value = project.image_url;
            document.getElementById('projectDemo').value = project.demo_url || '';
            document.getElementById('projectGithub').value = project.github_url || '';
            document.getElementById('projectTechnologies').value = project.technologies.join(', ');
            document.getElementById('projectFeatured').checked = project.featured;
        }
    } else {
        // Add mode
        title.textContent = 'Add New Project';
        submitText.textContent = 'Add Project';
        form.reset();
     
