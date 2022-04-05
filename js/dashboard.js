// $(document).ready(function() {
//     $('#example').DataTable( {
//         "dom": '<"top"i>rt<"bottom"flp><"clear">'
//     } );
// } );

navbar = document.getElementById('navbar-dashboard');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 100) {
        navbar.classList.add('shrink', 'shadow');
    } else {
        navbar.classList.remove('shrink', 'shadow');
    }
});