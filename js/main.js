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
    console.log('Navigating to page:', page || 'home');
    
    // Handle home page URL
    const targetPath = (page && page !== 'home') ? `/${page}/` : '/';
    
    // Update URL without page reload
    window.history.pushState({ page }, '', targetPath);
    
    // Load the page content
    loadPageContent(page);
    
    // Update active nav link
    updateActiveNavLink(page);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Prevent default link behavior
    return false;
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
    
    // Show loading state
    contentElement.innerHTML = '<div class="loading">Loading...</div>';

    try {
        // Set the default page to 'home' if empty
        if (!page || page === '') {
            page = 'home';
        }
        
        // For all pages, including home
        console.log('Fetching page:', `/pages/${page}/index.html`);
        const response = await fetch(`/pages/${page}/index.html`);
        if (!response.ok) throw new Error(`Page not found: ${page}`);
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Try to find the main content
        let pageContent = doc.querySelector('.page-content') || 
                         doc.querySelector('main') || 
                         doc.querySelector('article') || 
                         doc.body;
        
        if (pageContent) {
            // Clear the content element
            contentElement.innerHTML = '';
            
            // Create a container for this page
            const pageContainer = document.createElement('div');
            pageContainer.className = `${page}-page`;
            pageContainer.innerHTML = pageContent.innerHTML;
            
            // Add the page content to the DOM
            contentElement.appendChild(pageContainer);
            
            console.log(`${page} page loaded`);
            
            // If this is the home page, we need to re-initialize any scripts
            if (page === 'home') {
                // Re-initialize any home page specific scripts here
            }
            
            // Scroll to the top of the page
            window.scrollTo(0, 0);
        } else {
            throw new Error('No content found in the page');
        }
                pageElement = document.createElement('div');
                pageElement.className = `${page}-page`;
                contentElement.appendChild(pageElement);
            }
            
            // Update the content
            pageElement.innerHTML = pageContent.innerHTML;
            pageElement.style.display = 'block';
            console.log('Page content loaded:', page);
        } else {
            throw new Error('No content found in the loaded page');
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
    console.log('Initializing page...');
    
    // Use event delegation for navigation links
    document.addEventListener('click', (e) => {
        // Check if the clicked element or its parent is a nav-link
        const link = e.target.closest('.nav-link');
        if (link) {
            e.preventDefault();
            const page = link.getAttribute('data-page') || '';
            console.log('Nav link clicked, page:', page);
            navigateToPage(page);
        }
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        console.log('Popstate event triggered');
        const page = window.location.pathname === '/' ? '' : 
                    window.location.pathname.replace(/^\/([^\/]+).*$/, '$1');
        console.log('Loading page from popstate:', page || 'home');
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
    
    // If we're at the root, make sure we show the home page
    if (window.location.pathname === '/' || !initialPage) {
        initialPage = '';
    }
    
    console.log('Loading initial page:', initialPage || 'home');
    loadPageContent(initialPage);
    updateActiveNavLink(initialPage);
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);
