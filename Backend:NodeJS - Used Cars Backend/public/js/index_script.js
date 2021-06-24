$.getJSON('data/data10.json', function () {
    console.log("success")
}).done(function (data) {
    for (const car of data) {
        const carDiv = $('<div class="row"></div>')
        const carImgDiv = $('<div class="car_img col-sm-4"></div>')
        const carInfoDiv = $('<div class="car_info col-sm-7"></div>')
        const carCheckDiv = $('<div class="car_chbox col-sm-1"></div>')


        carImgDiv.append(`<img src=${car.url} alt="car logo">`)

        carInfoDiv
            .append(createCarInfoTable(car))
            .append(`<button style="margin-bottom: 20px" class="btn btn-danger delete_btn single_del">Delete</button>`)

        carCheckDiv.append(`<form><input type="checkbox" class="checkbox"></form>`)


        carDiv.append(carImgDiv).append(carInfoDiv).append(carCheckDiv)
        $('#car_list').append(carDiv)

    }

    $.each($('.row'), function (idx) {
        if (idx % 2 === 0) {
            $(this).addClass('even_row car_item')
        } else {
            $(this).addClass('odd_row car_item')
        }
    })

    $('.delete_btn').on('click', function () {
        const stock_number = $(this).parent().find('.id').text();

        $.post('/delete-car', {id: stock_number})
            .done(function () {
                location.reload();
            });
    });

    $('#delete_all').on('click', function () {
        $.each($('.row'), function () {
            const checked = $(this).find('input').is(":checked")

            if (checked) {
                const stock_number = $(this).find('.id').text();

                $.post('/delete-car', {id: stock_number})
                    .done(function () {
                        location.reload();
                    });
            }
        })
    })
})

function createCarInfoTable(car) {
    let table = "<table class='car_table'>"

    table +=
        `<tr>
            <td style="width:10em">Stock Number:</td>
            <td class="id">${car.stock_num}</td>
        </tr>
        <tr>
            <td style="width:10em">Make:</td>
            <td>${car.make}</td>
        </tr>
        <tr>
            <td style="width:10em">Model:</td>
            <td>${car.model}</td>
        </tr>
        <tr>
            <td style="width:10em">Year:</td>
            <td>${car.year}</td>
        </tr>
        <tr>
            <td style="width:10em">Price:</td>
            <td>$${car.price}</td>
        </tr>`
    table += '</table>'

    return table
}