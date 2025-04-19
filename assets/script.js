// Slider functionality
let slideIndex = 0;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  const slides = document.querySelectorAll('.slide');
  if (n >= slides.length) slideIndex = 0;
  if (n < 0) slideIndex = slides.length - 1;
  slides.forEach(slide => slide.classList.remove('active'));
  slides[slideIndex].classList.add('active');
}

// Auto advance every 3 seconds
setInterval(() => {
  plusSlides(1);
}, 3000);

// Update footer year automatically
const yearSpan = document.getElementById('year');
yearSpan.textContent = new Date().getFullYear();

// Reorder navbar links to desired sequence site‑wide
function reorderNavbar() {
  const nav = document.querySelector('.navbar-links');
  if (!nav) return;

  const desiredOrder = ['Why', 'Staff', 'Services', 'Testimonials'];

  const getKey = (li) => {
    const text = li.textContent.trim();
    if (text.startsWith('Why')) return 'Why';
    if (text.startsWith('Our Staff')) return 'Staff';
    if (text.startsWith('Our Services')) return 'Services';
    if (text.startsWith('Testimonials')) return 'Testimonials';
    return '';
  };

  const lis = Array.from(nav.children);
  lis.sort((a, b) => desiredOrder.indexOf(getKey(a)) - desiredOrder.indexOf(getKey(b)));
  lis.forEach(li => nav.appendChild(li));
}

// Run immediately (in case DOM is already loaded)
reorderNavbar();

// Ensure runs after DOM content loaded too (covers earlier script placement)
document.addEventListener('DOMContentLoaded', reorderNavbar);

// Insert Employee of the Month link at top of staff dropdown
function ensureEmployeeOfMonth() {
  const dropdown = document.querySelector('.navbar-links .dropdown .dropdown-content');
  if (!dropdown) return;

  // Check if link already exists
  let li = dropdown.querySelector('a[href="employee-of-the-month.html"]');
  if (li) {
    // ensure it's first
    dropdown.prepend(li.closest('li'));
    return;
  }

  // Create new link
  const liElem = document.createElement('li');
  const a = document.createElement('a');
  a.href = 'employee-of-the-month.html';
  a.textContent = 'Employee of the Month';
  liElem.appendChild(a);
  dropdown.prepend(liElem);
}

// Run immediately & on DOM ready
ensureEmployeeOfMonth();
document.addEventListener('DOMContentLoaded', ensureEmployeeOfMonth);
