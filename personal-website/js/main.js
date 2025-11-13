// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const html = document.documentElement;
const terminal = document.getElementById('terminal');
const terminalToggle = document.querySelector('.terminal-toggle');
const terminalInput = document.querySelector('.command-input');
const terminalContent = document.querySelector('.terminal-content');
const chatbot = document.getElementById('chatbot');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const navLinks = document.querySelectorAll('.nav-link');
const pageContent = document.getElementById('page-content');

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
        return 'Switched to light theme';
    },
    'theme dark': () => {
        html.setAttribute('data-theme', 'dark');
        return 'Switched to dark theme';
    },
    'theme toggle': () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeSwitch.checked = newTheme === 'dark';
        return `Switched to ${newTheme} theme`;
    }
};

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

// Add line to terminal
function addTerminalLine(text, type = 'output') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    
    if (type === 'input') {
        line.innerHTML = `<span class="prompt">visitor@portfolio:~$</span> ${text.replace('visitor@portfolio:~$', '').trim()}`;
    } else {
        line.textContent = text;
    }
    
    terminalContent.appendChild(line);
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

// Chatbot Toggle
chatbotToggle.addEventListener('click', () => {
    chatbot.classList.toggle('active');
});

// Close Chatbot
document.querySelector('.chatbot-close').addEventListener('click', () => {
    chatbot.classList.remove('active');
});

// Chatbot Responses
const botResponses = {
    'hello': 'Hello! How can I help you today?',
    'hi': 'Hi there! How can I assist you?',
    'what can you do': 'I can answer questions about this website, provide information about the owner, and help you navigate through different sections. Try asking about skills, experience, or projects!',
    'skills': 'Here are some of the skills: Web Development, JavaScript, React, Node.js, and more. Check the About section for details!',
    'experience': 'The owner has experience in various web technologies and frameworks. Visit the Resume section for a detailed work history.',
    'projects': 'There are several projects in the portfolio. Check the Projects section to see them!',
    'contact': 'You can reach out through the Contact section. There\'s a form you can fill out.',
    'default': 'I\'m not sure how to respond to that. Could you rephrase your question?'
};

// Get bot response
function getBotResponse(input) {
    input = input.toLowerCase();
    
    for (const [key, value] of Object.entries(botResponses)) {
        if (input.includes(key)) {
            return value;
        }
    }
    
    return botResponses['default'];
}

// Add message to chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    addMessage(message, true);
    userInput.value = '';
    
    // Simulate typing
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response);
    }, 500);
}

// Event Listeners for chat
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
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
