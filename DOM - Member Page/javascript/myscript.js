$.ajax({
    url: 'data/members.csv',
    dataType: 'text'
}).done(processData);

let data;

function processData(raw) {
    data = Papa.parse(raw.trim(), {header: true}).data;
    console.log(data);

    const memberListRoot = document.querySelector('#member_list')

    for (member of data) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        memberListRoot.appendChild(li);

        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        li.appendChild(rowDiv);

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('col-lg-3');
        rowDiv.appendChild(imgDiv);

        const bioDiv = document.createElement('div');
        bioDiv.classList.add('col-lg-9');
        rowDiv.appendChild(bioDiv);

        const face_img = document.createElement('img')
        face_img.setAttribute('src', member.picture);
        imgDiv.appendChild(face_img);

        const name = document.createElement('h1');
        name.innerText = member.first_name + " " + member.last_name;
        bioDiv.appendChild(name);

        const major = document.createElement('h5');
        major.innerText = member.major;
        bioDiv.appendChild(major);

        const email = document.createElement('h5');
        email.innerText = member.email;
        bioDiv.appendChild(email);

        const address = document.createElement('h5');
        address.innerText = member.address;
        bioDiv.appendChild(address);

        const pet_img = document.createElement('img')
        pet_img.classList.add('pet_img');
        pet_img.setAttribute('src', 'img/' + member.pet + '.svg');
        bioDiv.appendChild(pet_img)
    }

    const allName = document.querySelectorAll('#member_list h1')
    allName.forEach(h1 => {
        h1.classList.add('name_text')
    })

    document.querySelectorAll('#member_list h5').forEach(h5 => {
        h5.classList.add('main_text')
    })

    const allMembers = document.querySelector('#member_list').children;

    for (let i = 0; i < allMembers.length; i++) {
        allMembers[i].addEventListener('click', function () {
            allMembers[i].classList.toggle('italic_text');
        })
    }
}

function showList(clickedCheckbox) {
    const allMembers = document.querySelector('#member_list').children;
    for (let i = 0; i < allMembers.length; i++) {
        if (data[i].pet === clickedCheckbox.id) {
            allMembers[i].classList.toggle('gold_bg');
        }
    }
}
