// Simple HTML include system
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    const headerElement = document.querySelector('#header-include');
    if (headerElement) {
        fetch('includes/header.html')
            .then(response => response.text())
            .then(data => {
                headerElement.innerHTML = data;
                
                // Activate current page in navigation after header is loaded
                activateCurrentPageNav();
                
                // Setup mobile menu toggle
                setupMobileMenu();
            })
            .catch(error => console.error('Error loading header:', error));
    }
    
    // Load footer
    const footerElement = document.querySelector('#footer-include');
    if (footerElement) {
        fetch('includes/footer.html')
            .then(response => response.text())
            .then(data => {
                footerElement.innerHTML = data;
            })
            .catch(error => console.error('Error loading footer:', error));
    }
});

// Function to highlight current page in navigation
function activateCurrentPageNav() {
    // Get current page filename
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    // Set active class for main navigation
    if (page === "index.html" || page === "") {
        document.getElementById("nav-home")?.classList.add("active");
    } else if (page === "why-choose-us.html") {
        document.getElementById("nav-about")?.classList.add("active");
    } else if (page === "our-services.html") {
        document.getElementById("nav-activities")?.classList.add("active");
    } else if (page === "testimonials.html") {
        document.getElementById("nav-stories")?.classList.add("active");
    } else if (page === "contact.html") {
        document.getElementById("nav-friends")?.classList.add("active");
    }
    
    // Handle friend pages
    const friendPages = {
        "noah-perkins.html": "nav-noah",
        "chance-wiese.html": "nav-chance",
        "ashlyn-hall.html": "nav-ashlyn",
        "abbie-barker.html": "nav-abbie",
        "konner-clawson.html": "nav-konner",
        "mckenly-day.html": "nav-mckenly",
        "spencer-nay.html": "nav-spencer",
        "ridge-poll.html": "nav-ridge",
        "grace-richardson.html": "nav-grace",
        "julia-wasden.html": "nav-julia",
        "abby-bartholomew.html": "nav-abby",
        "garrett-otto.html": "nav-garrett"
    };
    
    if (friendPages[page]) {
        document.getElementById("nav-friends")?.classList.add("active");
        document.getElementById(friendPages[page])?.classList.add("active");
    }
}

// Function to setup mobile menu toggle
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    
    if (menuToggle && navbarLinks) {
        menuToggle.addEventListener('click', function() {
            navbarLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Setup dropdown toggles for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        if (dropdownLink && window.innerWidth <= 768) {
            dropdownLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
}
