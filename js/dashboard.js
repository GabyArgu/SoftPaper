//Nav bar fixed
navbar = document.getElementById('navbar-dashboard');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
        navbar.classList.add('nav-fixed', 'shadow', 'fixed-top');
    } else {
        navbar.classList.remove('nav-fixed', 'shadow', 'fixed-top');
    }
});
// window.addEventListener('scroll', function () {
//     if (window.pageYOffset > 100) {
//         navbar.classList.add('shrink', 'shadow');
//     } else {
//         navbar.classList.remove('shrink', 'shadow');
//     }
// });