const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("error")) {
    $('#error_msg').text(urlParams.get("error"));
}

$('form').on('submit', function () {
    let errorMessage = null
    $.each($('input, select').not('#profile'), function () {
        if (!$(this).val()) {
            errorMessage = `${$(this).parent().find('label').text()} cannot be empty`
            return false
        }
    })

    if (errorMessage !== null) {
        $('#error_msg').text(errorMessage)
        return false
    }

    if ($('#password').val().length < 5){
        $('#error_msg').text("Password must have at least 5 characters")
        return false
    }

    if ($('#password').val() !== $('#confirm').val()){
        $('#error_msg').text("Passwords don't match")
        return false
    }

});