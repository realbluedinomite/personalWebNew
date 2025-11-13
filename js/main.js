// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const html = document.documentElement;
const chatbot = document.getElementById('chatbot');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatMessages = document.getElementById('chat-messages') || { appendChild: () => {} };
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const navLinks = document.querySelectorAll('.nav-link');
const pageContent = document.getElementById('page-content');
const closeChatbot = document.querySelector('.close-chatbot');

// Terminal Commands
const commands = {
    help: 'Available commands: help, about, resume, portfolio, blog, projects, contact, clear, theme',
    about: 'I am a passionate web developer with expertise in modern web technologies.',
    resume: 'Opening resume...',
    portfolio: 'Navigating to portfolio...',
    blog: 'Navigating to blog...',
    projects: 'Navigating to projects...',
    contact: 'Navigating to contact...',
    clear: () => {
        terminalContent.innerHTML = '';
        return '';
    },
    theme: 'Usage: theme [light/dark/toggle]',
    'theme light': () => {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        if (themeSwitch) themeSwitch.checked = false;
        return 'Switched to light theme';
    },
    'theme dark': () => {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeSwitch) themeSwitch.checked = true;
        return 'Switched to dark theme';
    },
    'theme toggle': () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (themeSwitch) themeSwitch.checked = newTheme === 'dark';
        return `Switched to ${newTheme} theme`;
    }
};

// Initialize terminal
function initTerminal() {
    if (!terminal || !terminalInput || !terminalContent) return;
    
    // Add welcome message
    addTerminalLine('Welcome to the terminal! Type "help" for available commands.');
    
    // Set up terminal input
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            if (command) {
                addTerminalLine(`$ ${command}`, 'input');
                processCommand(command);
                terminalInput.value = '';
            }
            e.preventDefault();
        }
    });
    
    // Set up terminal toggle
    if (terminalToggle) {
        terminalToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            terminal.classList.toggle('active');
            if (terminal.classList.contains('active')) {
                terminalInput.focus();
            }
        });
    }
    
    // Close terminal when clicking outside
    document.addEventListener('click', (e) => {
        if (terminal && !e.target.closest('.terminal') && !e.target.closest('.terminal-toggle')) {
            terminal.classList.remove('active');
        }
    });
}

// Process terminal commands
function processCommand(command) {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();
    const response = commands[cmd] || `Command not found: ${cmd}. Type 'help' for available commands.`;
    
    if (typeof response === 'function') {
        const result = response();
        if (result) addTerminalLine(result);
    } else {
        addTerminalLine(response);
    }
}

// Add line to terminal
function addTerminalLine(text, type = 'output') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    terminalContent.appendChild(line);
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeSwitch.checked = savedTheme === 'dark';

// Theme Toggle
if (themeSwitch) {
    themeSwitch.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

// Terminal Toggle
terminalToggle.addEventListener('click', () => {
    terminal.classList.toggle('active');
});

// Terminal Input Handling
terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const command = terminalInput.value.trim().toLowerCase();
        addTerminalLine(`visitor@portfolio:~$ ${command}`, 'input');
        
        // Process command
        let output = 'Command not found. Type "help" for a list of commands.';
        
        if (commands[command] !== undefined) {
            if (typeof commands[command] === 'function') {
                output = commands[command]();
            } else {
                output = commands[command];
            }
        }
        
        // Handle navigation commands
        if (['about', 'resume', 'portfolio', 'blog', 'projects', 'contact'].includes(command)) {
            navigateToPage(command);
        }
        
        if (output) {
            addTerminalLine(output, 'output');
        }
        
        terminalInput.value = '';
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }
});

// Initialize Chatbot
function initChatbot() {
    if (!chatbot || !chatMessages) return;
    
    // Add welcome message if chat is empty
    if (chatMessages.children.length === 0) {
        addMessage('Hello! I\'m your AI assistant. How can I help you today?');
    }
    
    // Chatbot Toggle
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbot.classList.toggle('active');
            if (chatbot.classList.contains('active') && userInput) {
                setTimeout(() => userInput.focus(), 100);
            }
        });
    }
    
    // Close Chatbot when clicking outside
    document.addEventListener('click', (e) => {
        if (chatbot && !e.target.closest('#chatbot') && !e.target.closest('#chatbot-toggle')) {
            chatbot.classList.remove('active');
        }
    });
    
    // Close button
    if (closeChatbot) {
        closeChatbot.addEventListener('click', (e) => {
            e.stopPropagation();
            if (chatbot) chatbot.classList.remove('active');
        });
    }
    
    // Send message on Enter (but allow Shift+Enter for new lines)
    if (userInput) {
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Send button
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
}

// Get bot response
function getBotResponse(input) {
    input = input.toLowerCase();
    
    // Simple responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        return 'Hello! How can I help you today?';
    } else if (input.includes('how are you')) {
        return 'I\'m just a bot, but I\'m functioning well! How can I assist you?';
    } else if (input.includes('thank')) {
        return 'You\'re welcome! Is there anything else I can help with?';
    } else if (input.includes('bye') || input.includes('goodbye')) {
        return 'Goodbye! Feel free to come back if you have more questions.';
    } else if (input.includes('help')) {
        return 'You can ask me about the website, the developer, or use the navigation menu to explore different sections.';
    } else if (input.includes('name')) {
        return 'I\'m your friendly AI assistant for this website. You can call me Assistant.';
    } else if (input.includes('website') || input.includes('site')) {
        return 'This is a personal portfolio website built with HTML, CSS, and JavaScript. It features a terminal, chatbot, and responsive design.';
    } else if (input.includes('contact') || input.includes('email') || input.includes('phone')) {
        return 'You can find contact information on the Contact page. Use the navigation menu to get there.';
    } else if (input.includes('resume') || input.includes('cv')) {
        return 'You can view or download the resume from the Resume page. Use the navigation menu to get there.';
    } else if (input.includes('terminal') || input.includes('command')) {
        return 'You can use the terminal in the sidebar to navigate the website or get information. Try typing "help" in the terminal for available commands.';
    } else {
        return 'I\'m not sure how to respond to that. You can ask me about the website, the developer, or use the navigation menu to explore different sections.';
    }
}

// Add message to chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    addMessage(message, true);
    userInput.value = '';
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot typing';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate typing delay
    setTimeout(() => {
        // Remove typing indicator
        if (typingIndicator.parentNode) {
            typingIndicator.remove();
        }
        
        // Get and display response
        const response = getBotResponse(message);
        addMessage(response);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

// Load page content
async function loadPageContent(page) {
    if (!page) page = 'home';
    
    // Handle terminal page - redirect to the terminal page
    if (page === 'terminal') {
        window.location.href = '/pages/terminal.html';
        return;
    }
    
    // Update URL without page reload
    if (window.location.hash !== `#${page}`) {
        window.history.pushState({}, '', `#${page}`);
    }
    
    // Update active nav link
    if (navLinks && navLinks.length > 0) {
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // If already on the home page and loading home, no need to fetch
    if (page === 'home' && window.location.pathname === '/') {
        // Just ensure home is highlighted
        return;
    }
    
    // Load the page content
    try {
        const response = await fetch(`/pages/${page}.html`);
        if (!response.ok) throw new Error('Page not found');
        const html = await response.text();
        
        // Update the page content
        if (pageContent) {
            pageContent.innerHTML = html;
            // Scroll to top
            window.scrollTo(0, 0);
        }
    } catch (error) {
        console.error('Error loading page:', error);
        if (pageContent) {
            pageContent.innerHTML = `
                <div class="error-message" style="padding: 2rem; text-align: center;">
                    <h2>Page Not Found</h2>
                    <p>The requested page could not be found.</p>
                    <a href="#home" class="btn" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; text-decoration: none; border-radius: 4px;">Return to Home</a>
                </div>
            `;
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeSwitch) {
        themeSwitch.checked = savedTheme === 'dark';
        themeSwitch.addEventListener('change', (e) => {
            const theme = e.target.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }
    
    // Initialize chatbot if on the main page
    if (typeof initChatbot === 'function') {
        initChatbot();
    }
    
    // Set up navigation
    if (navLinks && navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                if (page) {
                    loadPageContent(page);
                }
            });
        });
    }
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const page = window.location.hash.substring(1) || 'home';
        loadPageContent(page);
    });
    
    // Load initial page - only if we're not on the terminal page
    if (!window.location.pathname.includes('terminal.html')) {
        const initialPage = window.location.hash.substring(1) || 'home';
        loadPageContent(initialPage);
    }
});

// Navigation
function navigateToPage(page) {
    // Remove active class from all nav links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked nav link
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Update URL
    history.pushState({}, '', `#${page}`);
    
    // Load page content
    loadPageContent(page);
}

// Load page content
async function loadPageContent(page) {
    // In a real app, you would fetch this content from a server
    const content = {
        home: `
            <section class="hero">
                <h1 class="animate-up">Welcome to My Personal Website</h1>
                <p class="animate-up" style="animation-delay: 0.2s">Web Developer | Problem Solver | Tech Enthusiast</p>
                <div class="cta-buttons animate-up" style="animation-delay: 0.4s">
                    <a href="#about" class="btn btn-primary">About Me</a>
                    <a href="#contact" class="btn btn-secondary">Contact</a>
                </div>
            </section>
            <section class="highlights">
                <h2>What I Do</h2>
                <div class="cards">
                    <div class="card">
                        <i class="fas fa-code"></i>
                        <h3>Web Development</h3>
                        <p>Building responsive and user-friendly websites and web applications.</p>
                    </div>
                    <div class="card">
                        <i class="fas fa-mobile-alt"></i>
                        <h3>Responsive Design</h3>
                        <p>Ensuring your site looks great on all devices.</p>
                    </div>
                    <div class="card">
                        <i class="fas fa-rocket"></i>
                        <h3>Performance</h3>
                        <p>Optimizing for speed and efficiency.</p>
                    </div>
                </div>
            </section>
        `,
        about: `
            <section class="about">
                <h1>About Me</h1>
                <div class="about-content">
                    <div class="about-text">
                        <p>Hello! I'm a passionate web developer with a strong background in creating beautiful and functional websites. I love turning ideas into reality through code.</p>
                        <h3>Skills</h3>
                        <div class="skills">
                            <span class="skill-tag">HTML5</span>
                            <span class="skill-tag">CSS3</span>
                            <span class="skill-tag">JavaScript</span>
                            <span class="skill-tag">React</span>
                            <span class="skill-tag">Node.js</span>
                            <span class="skill-tag">Python</span>
                            <span class="skill-tag">Git</span>
                        </div>
                    </div>
                </div>
            </section>
        `,
        resume: `
            <section class="resume">
                <h1>My Resume</h1>
                <div class="resume-section">
                    <h2>Experience</h2>
                    <div class="timeline">
                        <div class="timeline-item">
                            <h3>Web Developer</h3>
                            <p class="company">Tech Solutions Inc.</p>
                            <p class="date">2020 - Present</p>
                            <ul>
                                <li>Developed and maintained responsive web applications</li>
                                <li>Collaborated with cross-functional teams</li>
                                <li>Implemented new features and optimized performance</li>
                            </ul>
                        </div>
                        <div class="timeline-item">
                            <h3>Junior Developer</h3>
                            <p class="company">Digital Creations</p>
                            <p class="date">2018 - 2020</p>
                            <ul>
                                <li>Assisted in developing and testing web applications</li>
                                <li>Fixed bugs and implemented new features</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="resume-section">
                    <h2>Education</h2>
                    <div class="timeline">
                        <div class="timeline-item">
                            <h3>B.S. in Computer Science</h3>
                            <p class="company">University of Technology</p>
                            <p class="date">2014 - 2018</p>
                        </div>
                    </div>
                </div>
                <div class="download-resume">
                    <a href="#" class="btn btn-primary">Download Resume</a>
                </div>
            </section>
        `,
        portfolio: `
            <section class="portfolio">
                <h1>My Portfolio</h1>
                <div class="portfolio-grid">
                    <div class="portfolio-item">
                        <div class="portfolio-image" style="background-image: url('https://via.placeholder.com/400x300')"></div>
                        <div class="portfolio-info">
                            <h3>Project One</h3>
                            <p>A brief description of the project and the technologies used.</p>
                            <div class="portfolio-links">
                                <a href="#" class="btn btn-small">View Project</a>
                                <a href="#" class="btn btn-small">GitHub</a>
                            </div>
                        </div>
                    </div>
                    <div class="portfolio-item">
                        <div class="portfolio-image" style="background-image: url('https://via.placeholder.com/400x300')"></div>
                        <div class="portfolio-info">
                            <h3>Project Two</h3>
                            <p>A brief description of the project and the technologies used.</p>
                            <div class="portfolio-links">
                                <a href="#" class="btn btn-small">View Project</a>
                                <a href="#" class="btn btn-small">GitHub</a>
                            </div>
                        </div>
                    </div>
                    <div class="portfolio-item">
                        <div class="portfolio-image" style="background-image: url('https://via.placeholder.com/400x300')"></div>
                        <div class="portfolio-info">
                            <h3>Project Three</h3>
                            <p>A brief description of the project and the technologies used.</p>
                            <div class="portfolio-links">
                                <a href="#" class="btn btn-small">View Project</a>
                                <a href="#" class="btn btn-small">GitHub</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `,
        blog: `
            <section class="blog">
                <h1>My Blog</h1>
                <div class="blog-grid">
                    <article class="blog-card">
                        <div class="blog-image" style="background-image: url('https://via.placeholder.com/600x400')"></div>
                        <div class="blog-content">
                            <h2>Getting Started with Web Development</h2>
                            <p class="blog-meta">Published on: <span>June 15, 2023</span></p>
                            <p class="blog-excerpt">A beginner's guide to starting your journey in web development.</p>
                            <a href="#" class="read-more">Read More</a>
                        </div>
                    </article>
                    <article class="blog-card">
                        <div class="blog-image" style="background-image: url('https://via.placeholder.com/600x400')"></div>
                        <div class="blog-content">
                            <h2>Modern JavaScript Features You Should Know</h2>
                            <p class="blog-meta">Published on: <span>May 28, 2023</span></p>
                            <p class="blog-excerpt">Explore the latest JavaScript features that will make your code cleaner and more efficient.</p>
                            <a href="#" class="read-more">Read More</a>
                        </div>
                    </article>
                    <article class="blog-card">
                        <div class="blog-image" style="background-image: url('https://via.placeholder.com/600x400')"></div>
                        <div class="blog-content">
                            <h2>Responsive Design Best Practices</h2>
                            <p class="blog-meta">Published on: <span>April 12, 2023</span></p>
                            <p class="blog-excerpt">Learn how to create websites that look great on any device.</p>
                            <a href="#" class="read-more">Read More</a>
                        </div>
                    </article>
                </div>
            </section>
        `,
        contact: `
            <section class="contact">
                <h1>Get In Touch</h1>
                <div class="contact-container">
                    <div class="contact-info">
                        <h3>Contact Information</h3>
                        <p><i class="fas fa-envelope"></i> email@example.com</p>
                        <p><i class="fas fa-phone"></i> +1 (123) 456-7890</p>
                        <p><i class="fas fa-map-marker-alt"></i> City, Country</p>
                        <div class="social-links">
                            <a href="#" class="social-link"><i class="fab fa-github"></i></a>
                            <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
                            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    <form id="contact-form" class="contact-form">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" name="subject" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </section>
        `
    };
    
    pageContent.innerHTML = content[page] || content['home'];
    
    // Add animation to new content
    const elements = pageContent.querySelectorAll('*:not(script)');
    elements.forEach((el, index) => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
    
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! This is a demo form, so your message was not actually sent.');
            contactForm.reset();
        });
    }
}

// Handle navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        navigateToPage(page);
    });
});

// Handle back/forward navigation
window.addEventListener('popstate', () => {
    const page = window.location.hash.substring(1) || 'home';
    loadPageContent(page);
});

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
    const initialPage = window.location.hash.substring(1) || 'home';
    loadPageContent(initialPage);
    
    // Set active nav link
    const activeLink = document.querySelector(`[data-page="${initialPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
});

// Add animation on scroll
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
});
