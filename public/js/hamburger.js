if ($(window).innerWidth() < 768) {
    $(".navbar-nav").hide();
}

$(".navbar-collapse").addClass('show');
$('.icon').on('click', function() {
    $('.icon').toggleClass('active');
    $(".navbar-nav").fadeToggle();
})

$(window).on('resize', function() {
    if ($(window).innerWidth() > 768) {
        $(".navbar-nav").fadeIn();
        return
    }
    $(".navbar-nav").hide();
    $('.icon').removeClass('active');  
})