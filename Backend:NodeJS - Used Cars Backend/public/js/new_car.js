function validateInputs() {
    console.log('validating inputs')
    let empty_error = true;
    $.each($('.user_input'), function (i) {
        const user_input_value = $(this).val()

        if (user_input_value === '' || user_input_value === 'Select a color') {
            let alter_text = $(this).parent().find('label').text() + ' cannot be empty!'

            if (i === 4) {
                alter_text = 'Color cannot be empty!'
            }

            $('#alert').text(alter_text)

            empty_error = false
            return false
        }
    })
    return empty_error
}





