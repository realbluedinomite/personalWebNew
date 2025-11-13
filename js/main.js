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
    console.log('Navigating to page:', page);
    
    // Don't navigate if already on the same page
    const currentPath = window.location.pathname;
    const targetPath = page ? `/${page}/` : '/';
    
    if (currentPath === targetPath || 
        (currentPath.endsWith(`${page}/`) && page !== '') || 
        (page === '' && currentPath === '/')) {
        console.log('Already on the same page');
        return;
    }
    
    // Update URL without page reload
    window.history.pushState({ page }, '', targetPath);
    
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
    console.log('Loading page:', page || 'home');
    const contentElement = document.getElementById('page-content');
    if (!contentElement) {
        console.error('Page content element not found');
        return;
    }
    
    // Hide all page content first
    document.querySelectorAll('.page-content > *').forEach(el => {
        el.style.display = 'none';
    });

    // Handle home page
    if (!page || page === 'home' || page === '') {
        const homePage = document.querySelector('.home-page');
        if (homePage) {
            homePage.style.display = 'block';
            return;
        }
        // If home page element doesn't exist, load it
        page = 'home';
    }
    
    // Check if we already have this page loaded
    let pageElement = document.querySelector(`.${page}-page`);
    
    // If page is already loaded, just show it
    if (pageElement) {
        console.log('Page already loaded, showing:', page);
        pageElement.style.display = 'block';
        return;
    }
    
    // Otherwise, fetch the page content
    try {
        console.log('Fetching page:', `/pages/${page}/index.html`);
        const response = await fetch(`/pages/${page}/index.html`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        console.log('Page fetched successfully');
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const pageContent = doc.querySelector('.page-content') || doc.body;
        
        if (pageContent) {
            // Create a new container for this page
            pageElement = document.createElement('div');
            pageElement.className = `${page}-page`;
            pageElement.innerHTML = pageContent.innerHTML;
            contentElement.appendChild(pageElement);
            pageElement.style.display = 'block';
            console.log('Page content loaded:', page);
        } else {
            throw new Error('No .page-content found in the loaded page');
        }
    } catch (error) {
        console.error('Error loading page:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <h2>Error Loading Page</h2>
                <p>Failed to load: ${page}</p>
                <p>${error.message}</p>
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
