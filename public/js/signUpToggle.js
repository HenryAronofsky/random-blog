// var cookies = document.cookie.split(";");

// for (var i = 0; i < cookies.length; i++) {
//     var cookie = cookies[i];
//     var eqPos = cookie.indexOf("=");
//     var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//     document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
// }

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// if (!document.cookie.includes("login_displayed")) {
//     document.cookie = "login_displayed=false"
// } else {
//     if (document.cookie.includes("login_displayed=true")) {
//         $('.account-container').removeClass('active');
//     } else {
//         $('.account-container').addClass('active');
//     }
// }

function toggleForm() {
    // if (document.cookie.includes("login_displayed=true")) {
    //     $('.account-container').removeClass('active');
    //     document.cookie = "login_displayed=false"
    // } else {
    //     $('.account-container').addClass('active');
    //     document.cookie = "login_displayed=true"
    // }

    $('.account-container').toggleClass('active');

    document.querySelectorAll('.SwitchForm').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.alert').forEach(alert => {
                alert.remove();
            })
            document.querySelectorAll('input[type="text"]').forEach(text => {
                text.value = "";
            })
        })
    })
}