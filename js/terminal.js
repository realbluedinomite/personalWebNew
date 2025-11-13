// DOM Elements
const terminal = document.getElementById('terminal');
const terminalInput = document.querySelector('.command-input');
const terminalContent = document.querySelector('.terminal-content');

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
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        return 'Switched to light theme';
    },
    'theme dark': () => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        return 'Switched to dark theme';
    },
    'theme toggle': () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
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

    // Focus the input on page load
    terminalInput.focus();
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

// Initialize the terminal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Initialize terminal
    initTerminal();
});
