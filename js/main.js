// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const html = document.documentElement;
const navLinks = document.querySelectorAll('.nav-link');

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeSwitch) {
    themeSwitch.checked = savedTheme === 'dark';
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    if (themeSwitch) {
        themeSwitch.checked = newTheme === 'dark';
    }
}

// Navigation
function navigateToPage(page) {
    // Don't navigate if already on the same page
    if ((window.location.pathname.endsWith(`${page}/`) && page !== '') || 
        (page === '' && window.location.pathname === '/')) {
        return;
    }
    
    // Update URL without page reload
    const newPath = page ? `/${page}/` : '/';
    window.history.pushState({ page }, '', newPath);
    
    // Load the page content
    loadPageContent(page);
    
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
    }
}

// Load page content
async function loadPageContent(page = '') {
    const contentElement = document.getElementById('page-content');
    if (!contentElement) return;
    
    // Hide all page content first
    document.querySelectorAll('.page-content > *').forEach(el => {
        el.style.display = 'none';
    });

    // If it's the home page, show the home content
    if (!page || page === 'home' || page === '') {
        const homePage = document.querySelector('.home-page');
        if (homePage) {
            homePage.style.display = 'block';
        }
        return;
    }
    
    // Check if we already have this page loaded
    let pageElement = document.querySelector(`.${page}-page`);
    
    // If page is already loaded, just show it
    if (pageElement) {
        pageElement.style.display = 'block';
        return;
    }
    
    // Otherwise, fetch the page content
    try {
        const response = await fetch(`/pages/${page}/index.html`);
        if (!response.ok) throw new Error('Page not found');
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const pageContent = doc.querySelector('.page-content');
        
        if (pageContent) {
            // Create a new container for this page
            pageElement = document.createElement('div');
            pageElement.className = `${page}-page`;
            pageElement.innerHTML = pageContent.innerHTML;
            contentElement.appendChild(pageElement);
            pageElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading page:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <h2>Page Not Found</h2>
                <p>The requested page could not be loaded: ${page}</p>
                <a href="/" class="btn" data-page="">Return to Home</a>
            </div>
        `;
    }
}

// Initialize the page
function initPage() {
    // Set up navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page') || '';
            navigateToPage(page);
        });
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
    const initialPage = window.location.pathname === '/' ? '' : 
                       window.location.pathname.replace(/^\/([^\/]+).*$/, '$1');
    loadPageContent(initialPage);
    updateActiveNavLink(initialPage);
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);
