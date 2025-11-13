// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const contentElement = document.getElementById('page-content');

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeSwitch) {
    themeSwitch.checked = savedTheme === 'dark';
}

// Theme Toggle
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    if (themeSwitch) {
        themeSwitch.checked = newTheme === 'dark';
    }
}

// Navigation
async function navigateToPage(page = '') {
    console.log('Navigating to:', page || 'home');
    
    // Update URL without page reload
    const targetPath = page ? `/${page}/` : '/';
    window.history.pushState({ page }, '', targetPath);
    
    // Load the page content
    await loadPageContent(page);
    
    // Update active nav link
    updateActiveNavLink(page);
}

// Update active navigation link
function updateActiveNavLink(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current nav link
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    } else if (!page) {
        // If no page is specified, highlight the home link
        const homeLink = document.querySelector('[data-page=""]');
        if (homeLink) homeLink.classList.add('active');
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
    contentElement.innerHTML = '<div class="loading">Loading...</div>';
    
    try {
        // Default to home if no page specified
        if (!page) page = 'home';
        
        // Special handling for home page
        if (page === 'home') {
            const response = await fetch('/pages/home/index.html');
            if (!response.ok) throw new Error('Home page not found');
            
            const html = await response.text();
            contentElement.innerHTML = html;
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
