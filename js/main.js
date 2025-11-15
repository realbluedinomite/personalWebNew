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
        const response = await fetch(`/pages/${page}/index.html`);
        if (!response.ok) throw new Error(`Page not found: ${page}`);
        
        const html = await response.text();
        contentElement.innerHTML = html;
        console.log(`Page loaded: ${page}`);
        
    } catch (error) {
        console.error('Error loading page:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <h2>Error Loading Page</h2>
                <p>${error.message}</p>
                <a href="/" class="btn" data-page="">Return to Home</a>
            </div>
        `;
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
