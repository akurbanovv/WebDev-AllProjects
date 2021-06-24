function load_user(user) {
    $('#name').text(user.fullname);
    $('#brand').text(user.brand);

    $('#profile_img').attr('src', user.profile);

    user.likes.forEach(car =>{
        $('#car_list').append(`<li class="list-group-item">${car.year} ${car.make} ${car.model}, ${car.color}, $${car.price}</li>`)
    })
}

$.getJSON('/get_current_user').done(function (data){
    load_user(data.data)
})


