$(".comment-make-form").on("submit", function(e) {
    e.preventDefault()
    const queryUrl = $(this)[0].action.split("/")

    let data = {};
    data.content = $("#content").val();
    $("#content").val("");

    if ($.trim(data.content) == '') {
        $(this).prepend('<div class="alert alert-danger alert-dismissible fade show"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Error!</strong> Please fill out field')
        return
    }

    $.ajax({
        type: "POST",
        url: `/account/${queryUrl[4]}/posts/${queryUrl[6]}`,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8"
    });

    let userName = $('#inputUser').val()
    $('.comment-section').prepend(`<p><b>${userName}</b> ${sanitizeData(data.content)}</p>`)
});

$(".comment-delete-form").on("submit", function(e) {
    e.preventDefault()
    const queryUrl = $(this)[0].action.split("/")

    $(this).parent().remove()
    console.log($(this))
    $(this).siblings('a').remove();

    $.ajax({
        type: "POST",
        url: `/account/${queryUrl[4]}/posts/${queryUrl[6]}/comments/${queryUrl[8]}`,
        contentType: "application/json; charset=utf-8"
    });
});

$(".toggleEdit").on("click", function(e) {
    $(this).css('display', 'none')
    if ($(this).text() == 'Cancel') {
        $(this).parent().hide();
        $(this).parent().siblings('a').show();
        return
    }
    $(this).next().show();
    $(this).next().children().show();
})

$(".comment-edit-form").on("submit", function(e) {
    e.preventDefault()
    const queryUrl = $(this)[0].action.split("/")

    let data = {};
    data.updatedComment = $(this).children().first().val();

    $.ajax({
        type: "POST",
        url: `/account/${queryUrl[4]}/posts/${queryUrl[6]}/comments/${queryUrl[8]}`,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8"
    });

    $(this).siblings('a').show();
    $(this).hide();
    $(this).siblings('h5').text(data.updatedComment);
});

$(".reply-make-form").on("submit", function(e) {
    e.preventDefault()
    const queryUrl = $(this)[0].action.split("/")

    let data = {};
    data.reply = $(this).children().first().val();

    if ($.trim(data.reply) == '') {
        $(this).prepend('<div class="alert alert-danger alert-dismissible fade show"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Error!</strong> Please fill out field')
        return
    }

    let userName = $('#inputUser').val()
    if ($(this).next()[0] != undefined) {
        $(this).next().prepend(`<br>--- <b>${userName}</b> ${sanitizeData(data.reply)}`)
    } else {
        data.reply = `@${$(this).siblings('b').text()} ${$(this).children().first().val()}`;
        $(this).parent().parent().prepend(`<br>--- <b>${userName}</b> ${sanitizeData(data.reply)}`)
    }
    
    $(this).children().first().val("");

    $.ajax({
        type: "POST",
        url: `/account/${queryUrl[4]}/posts/${queryUrl[6]}/comments/${queryUrl[8]}/reply`,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8"
    });

    $(this).siblings('a').show();
    $(this).hide();
});

$(".reply-delete-form").on("submit", function(e) {
    e.preventDefault()
    const queryUrl = $(this)[0].action.split("/")
    console.log(queryUrl)

    $(this).parent().remove()

    $.ajax({
        type: "POST",
        url: `/account/${queryUrl[4]}/posts/${queryUrl[6]}/comments/${queryUrl[8]}/reply/${queryUrl[10]}`,
        contentType: "application/json; charset=utf-8"
    });
});

$(".reply-edit-form").on("submit", function(e) {
    e.preventDefault()
    const queryUrl = $(this)[0].action.split("/")

    let data = {};
    data.updatedReply = $(this).children().first().val();

    $.ajax({
        type: "POST",
        url: `/account/${queryUrl[4]}/posts/${queryUrl[6]}/comments/${queryUrl[8]}/reply/${queryUrl[10]}`,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8"
    });

    $(this).siblings('a').show();
    $(this).hide();
    $(this).siblings('p').text(data.updatedReply);
});

function sanitizeData(data) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return data.replace(reg, (match) => (map[match]));
}