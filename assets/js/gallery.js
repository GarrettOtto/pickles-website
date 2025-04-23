/**
 * Pickles Website - Gallery Enhancement Script
 * This script adds interactive features to the photo galleries
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the lightbox functionality
    initLightbox();
    
    // Add hover effects to gallery items
    initHoverEffects();
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Initialize carousel functionality
    initCarousel();
});

/**
 * Initialize lightbox functionality for gallery images
 */
function initLightbox() {
    // Get all gallery images
    const galleryItems = document.querySelectorAll('.photo-item');
    
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img class="lightbox-image" src="" alt="">
            <div class="lightbox-caption"></div>
            <button class="lightbox-prev">&#10094;</button>
            <button class="lightbox-next">&#10095;</button>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    // Get lightbox elements
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    
    // Add click event to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const img = item.querySelector('img');
            const caption = item.querySelector('.photo-overlay span');
            
            lightboxImg.src = img.src;
            lightboxCaption.textContent = caption ? caption.textContent : '';
            lightbox.style.display = 'flex';
            currentIndex = index;
            
            // Show/hide navigation buttons based on position
            updateNavButtons();
        });
    });
    
    // Close lightbox when clicking close button
    closeBtn.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
    
    // Previous button functionality
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            const prevItem = galleryItems[currentIndex];
            const img = prevItem.querySelector('img');
            const caption = prevItem.querySelector('.photo-overlay span');
            
            lightboxImg.src = img.src;
            lightboxCaption.textContent = caption ? caption.textContent : '';
            updateNavButtons();
        }
    });
    
    // Next button functionality
    nextBtn.addEventListener('click', function() {
        if (currentIndex < galleryItems.length - 1) {
            currentIndex++;
            const nextItem = galleryItems[currentIndex];
            const img = nextItem.querySelector('img');
            const caption = nextItem.querySelector('.photo-overlay span');
            
            lightboxImg.src = img.src;
            lightboxCaption.textContent = caption ? caption.textContent : '';
            updateNavButtons();
        }
    });
    
    // Update navigation buttons visibility
    function updateNavButtons() {
        prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
        nextBtn.style.display = currentIndex < galleryItems.length - 1 ? 'block' : 'none';
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                prevBtn.click();
            } else if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) {
                nextBtn.click();
            } else if (e.key === 'Escape') {
                lightbox.style.display = 'none';
            }
        }
    });
}

/**
 * Add hover effects to gallery items
 */
function initHoverEffects() {
    const galleryItems = document.querySelectorAll('.photo-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
        
        // Add a subtle animation on hover
        item.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            this.style.transform = `perspective(1000px) rotateY(${deltaX * 5}deg) rotateX(${-deltaY * 5}deg) scale(1.05)`;
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
        });
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        // Get all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Initialize carousel functionality for photo grids
 */
function initCarousel() {
    const photoGrids = document.querySelectorAll('.photo-grid');
    
    photoGrids.forEach(grid => {
        // Only apply carousel if there are multiple items
        const items = grid.querySelectorAll('.photo-item');
        if (items.length > 1) {
            // Convert the grid to a carousel
            grid.classList.add('carousel');
            
            // Create carousel controls
            const controls = document.createElement('div');
            controls.className = 'carousel-controls';
            controls.innerHTML = `
                <button class="carousel-prev">&#10094;</button>
                <div class="carousel-indicators"></div>
                <button class="carousel-next">&#10095;</button>
            `;
            
            // Create indicators
            const indicators = controls.querySelector('.carousel-indicators');
            for (let i = 0; i < items.length; i++) {
                const dot = document.createElement('span');
                dot.className = 'carousel-dot';
                dot.setAttribute('data-index', i);
                if (i === 0) dot.classList.add('active');
                indicators.appendChild(dot);
            }
            
            // Add controls after the grid
            grid.parentNode.insertBefore(controls, grid.nextSibling);
            
            // Hide all items except the first one
            for (let i = 1; i < items.length; i++) {
                items[i].style.display = 'none';
            }
            
            // Set up automatic rotation
            let currentIndex = 0;
            const autoRotate = setInterval(() => {
                showNextSlide();
            }, 5000); // Change slide every 5 seconds
            
            // Previous button click
            const prevBtn = controls.querySelector('.carousel-prev');
            prevBtn.addEventListener('click', () => {
                clearInterval(autoRotate); // Stop auto rotation when manually navigating
                showPrevSlide();
            });
            
            // Next button click
            const nextBtn = controls.querySelector('.carousel-next');
            nextBtn.addEventListener('click', () => {
                clearInterval(autoRotate); // Stop auto rotation when manually navigating
                showNextSlide();
            });
            
            // Indicator dots click
            const dots = controls.querySelectorAll('.carousel-dot');
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    clearInterval(autoRotate); // Stop auto rotation when manually navigating
                    const index = parseInt(dot.getAttribute('data-index'));
                    showSlide(index);
                });
            });
            
            // Show previous slide
            function showPrevSlide() {
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = items.length - 1;
                showSlide(newIndex);
            }
            
            // Show next slide
            function showNextSlide() {
                let newIndex = currentIndex + 1;
                if (newIndex >= items.length) newIndex = 0;
                showSlide(newIndex);
            }
            
            // Show specific slide
            function showSlide(index) {
                // Hide current slide
                items[currentIndex].style.display = 'none';
                dots[currentIndex].classList.remove('active');
                
                // Show new slide
                items[index].style.display = 'block';
                dots[index].classList.add('active');
                
                // Animate the new slide
                items[index].style.animation = 'fadeIn 0.5s ease';
                
                // Update current index
                currentIndex = index;
            }
        }
    });
}
