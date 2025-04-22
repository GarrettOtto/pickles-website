document.addEventListener('DOMContentLoaded', function() {
    // Load header
    const headerElement = document.querySelector('[data-include="header"]');
    if (headerElement) {
        fetch('includes/header.html')
            .then(response => response.text())
            .then(data => {
                headerElement.innerHTML = data;
                
                // Highlight current page in navigation
                const currentPage = window.location.pathname.split('/').pop();
                const navLinks = document.querySelectorAll('.navbar-links a');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === currentPage) {
                        link.classList.add('active');
                    }
                });
            });
    }
    
    // Load footer
    const footerElement = document.querySelector('[data-include="footer"]');
    if (footerElement) {
        fetch('includes/footer.html')
            .then(response => response.text())
            .then(data => {
                footerElement.innerHTML = data;
            });
    }
});
