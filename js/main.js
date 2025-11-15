// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const contentElement = document.getElementById('page-content');

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeSwitch) {
    themeSwitch.checked = savedTheme === 'dark';
    themeSwitch.addEventListener('change', toggleTheme);
}

// Theme Toggle
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    const themeText = document.getElementById('theme-text');
    if (themeText) {
        themeText.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}

// Navigation
async function navigateToPage(page = '') {
    console.log('Navigating to:', page || 'home');
    
    // Update active nav link immediately for better UX
    updateActiveNavLink(page);
    
    try {
        // Update URL without page reload
        const targetPath = page ? `/${page}/` : '/';
        window.history.pushState({ page }, '', targetPath);
        
        // Load the page content
        await loadPageContent(page);
    } catch (error) {
        console.error('Navigation error:', error);
        // Fallback to home page on error
        if (page !== '') {
            navigateToPage('');
        }
    }
}

// Update active navigation link
function updateActiveNavLink(page) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        // Also remove active class from parent li if it exists
        if (link.parentElement && link.parentElement.tagName === 'LI') {
            link.parentElement.classList.remove('active');
        }
    });
    
    // Add active class to current nav link and its parent li
    let activeLink;
    if (page) {
        activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    } else {
        // Home page
        activeLink = document.querySelector('.nav-link[data-page=""]') || 
                    document.querySelector('.nav-link[href="/"]');
    }
    
    if (activeLink) {
        activeLink.classList.add('active');
        if (activeLink.parentElement && activeLink.parentElement.tagName === 'LI') {
            activeLink.parentElement.classList.add('active');
        }
    }
}

// Load page content
async function loadPageContent(page = '') {
    console.log('Loading page:', page || 'home');
    
    if (!contentElement) {
        console.error('Page content element not found');
        return;
    }
    
    // Show loading state
    contentElement.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading ${page || 'home'} page...</p>
        </div>`;
        
    // Add a small delay to show loading state (for demo purposes)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
        // Default to home if no page specified
        if (!page) page = 'home';
        
        // Special handling for home page - use inline content
        if (page === 'home') {
            const homeContent = `
<div class="home-page">
    <h1>Welcome to My Personal Website</h1>
    <p>Hello! I'm a web developer passionate about creating beautiful and functional websites.</p>
    
    <div class="features">
        <div class="feature">
            <i class="fas fa-code"></i>
            <h3>Web Development</h3>
            <p>Building responsive and modern web applications using the latest technologies.</p>
        </div>
        
        <div class="feature">
            <i class="fas fa-paint-brush"></i>
            <h3>UI/UX Design</h3>
            <p>Creating intuitive and engaging user experiences with clean, modern design.</p>
        </div>
        
        <div class="feature">
            <i class="fas fa-terminal"></i>
            <h3>Terminal</h3>
            <p>Try out the <a href="#terminal" class="nav-link" data-page="terminal">terminal</a> to navigate the site or get information.</p>
        </div>
    </div>
    
    <div class="cta">
        <h2>Let's Work Together</h2>
        <p>Have a project in mind? Get in touch with me!</p>
        <a href="#contact" class="btn" data-page="contact">Contact Me</a>
    </div>
</div>`;
            contentElement.innerHTML = homeContent;
            console.log('Home page loaded');
            return;
        }
        
        // For other pages
        console.log(`Fetching: /pages/${page}/index.html`);
        const response = await fetch(`/pages/${page}/index.html`);
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
            console.error(`Failed to fetch page: ${response.status} ${response.statusText}`);
            throw new Error(`Page not found: ${page}`);
        }
        
        const html = await response.text();
        console.log(`Raw HTML length: ${html.length}`);
        
        // Extract only the content inside the page-content div if it exists
        let contentToInsert = html;
        const contentMatch = html.match(/<div[^>]*class="page-content"[^>]*>([\s\S]*?)<\/div>/);
        if (contentMatch) {
            contentToInsert = contentMatch[1];
            console.log('Extracted content from page-content div');
        } else {
            console.log('No page-content div found, using full HTML');
        }
        
        contentElement.innerHTML = contentToInsert;
        console.log(`Page loaded: ${page}`);
        
    } catch (error) {
        console.error('Error loading page:', error);
        
        // Provide fallback content for common pages
        let fallbackContent = '';
        switch(page) {
            case 'about':
                fallbackContent = `
<div class="about-page">
    <h1>About Me</h1>
    <p>Hello! I'm a web developer passionate about creating beautiful and functional websites.</p>
    <p>This is a fallback version of the about page. The full page content will be available soon.</p>
</div>`;
                break;
            case 'contact':
                fallbackContent = `
<div class="contact-page">
    <h1>Contact Me</h1>
    <p>Get in touch with me through the form below or via email.</p>
    <p>This is a fallback version of the contact page. The full contact form will be available soon.</p>
</div>`;
                break;
            case 'resume':
                fallbackContent = `
<div class="resume-page">
    <h1>My Resume</h1>
    <p>Download my resume to learn more about my experience and skills.</p>
    <p>This is a fallback version of the resume page. The full resume will be available soon.</p>
</div>`;
                break;
            case 'portfolio':
                fallbackContent = `
<div class="portfolio-page">
    <h1>Portfolio</h1>
    <p>Check out some of my recent projects and work.</p>
    <p>This is a fallback version of the portfolio page. The full portfolio will be available soon.</p>
</div>`;
                break;
            case 'blog':
                fallbackContent = `
<div class="blog-page">
    <h1>Blog</h1>
    <p>Read my latest thoughts and articles on web development and technology.</p>
    <p>This is a fallback version of the blog page. The full blog will be available soon.</p>
</div>`;
                break;
            case 'projects':
                fallbackContent = `
<div class="projects-page">
    <h1>Projects</h1>
    <p>Explore my open-source projects and contributions.</p>
    <p>This is a fallback version of the projects page. The full projects list will be available soon.</p>
</div>`;
                break;
            case 'terminal':
                fallbackContent = `
<div class="terminal-page">
    <h1>Terminal</h1>
    <p>Interactive terminal interface for navigating the site.</p>
    <p>This is a fallback version of the terminal page. The full terminal will be available soon.</p>
</div>`;
                break;
            default:
                fallbackContent = `
<div class="error-message">
    <h2>Page Not Found</h2>
    <p>The page "${page}" could not be loaded.</p>
    <p>Error: ${error.message}</p>
    <a href="/" class="btn" data-page="">Return to Home</a>
</div>`;
        }
        
        contentElement.innerHTML = fallbackContent;
    }
}

// Initialize the page
function initPage() {
    console.log('Initializing page...');
    
    // Set up navigation
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-link');
        if (link) {
            e.preventDefault();
            const page = link.getAttribute('data-page') || '';
            navigateToPage(page);
        }
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        const page = window.location.pathname === '/' ? '' : 
                    window.location.pathname.replace(/^\/([^\/]+).*$/, '$1');
        loadPageContent(page);
        updateActiveNavLink(page);
    });
    
    // Set up theme toggle
    if (themeSwitch) {
        themeSwitch.addEventListener('change', toggleTheme);
    }
    
    // Load initial page
    let initialPage = window.location.pathname === '/' ? '' : 
                     window.location.pathname.replace(/^\/([^\/]+).*$/, '$1');
    
    if (window.location.pathname === '/' || !initialPage) {
        initialPage = '';
    }
    
    console.log('Loading initial page:', initialPage || 'home');
    loadPageContent(initialPage);
    updateActiveNavLink(initialPage);
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);
