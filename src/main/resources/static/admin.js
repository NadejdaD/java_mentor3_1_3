let map = new Map();
$user = $('#adminInfo')
$users = $('#usersTable');
$info = $('#navBarAdmin')
$(document).ready(function () {
    showInfoAdmin();
    showUsers();
});


function showInfoAdmin() {
    $.ajax({
        method: 'GET',
        url: '/admin/infoAdmin/',
        success: function (user) {
            let infoNavBarAdmin = "<b>" + user.email + "</b> with role: ";
            let a = "";
            for (let b of user.roles) {
                a += b.name.substr(5) + " ";
            }
            $info.append('<th>' + infoNavBarAdmin + a + '</th>')
        }
    });
}

$(document).ready(function () {
    $.ajax({
        method: 'GET',
        url: '/admin/infoAdmin/',
        success: function (user) {
            let a = "";
            for (let b of user.roles) {
                a += b.name.substr(5) + " ";
            }

            $user.append('<td>' + user.id + '</td>')
            $user.append('<td>' + user.firstName + '</td>')
            $user.append('<td>' + user.lastName + '</td>')
            $user.append('<td>' + user.age + '</td>')
            $user.append('<td>' + user.email + '</td>')
            $user.append('<td>' + a + '</td>')
        }
    });
})

function showUsers() {
    $.ajax({
        method: 'GET',
        url: '/admin/home/',
        success: function (users) {
            map.clear();
            $.each(users, function (i, user) {
                map.set(user.id, user);

                let a = new String();
                for (let b of user.roles) {
                    a += b.name.substr(5) + " ";
                }
                var rowTable = "<tr>";
                rowTable += '<td >' + users[i].id + '</td>';
                rowTable += '<td >' + users[i].firstName + '</td>';
                rowTable += '<td >' + users[i].lastName + '</td>';
                rowTable += '<td >' + users[i].age + '</td>';
                rowTable += '<td >' + users[i].email + '</td>';
                rowTable += '<td >' + a + '</td>';
                rowTable += '<td><button data-toggle="modal" data-target="#editModal" data-id="' + users[i].id + '" class="btn btn-info btn-sm">Edit</button></td>' +
                    '<td><button data-toggle="modal" data-target="#modalDelete" data-id="' + users[i].id + '" class="btn btn-danger btn-sm">Delete</button></td></tr>';
                $users.append(rowTable);
            });
        }
    });
}

$(document).ready(function () {
    $("#editModal").on('show.bs.modal', function (event) {

        let updateId = $(event.relatedTarget).data('id');
        let updateFirstName = map.get(updateId).firstName;
        let updateLastName = map.get(updateId).lastName;
        let updateAge = map.get(updateId).age;
        let updateEmail = map.get(updateId).email;
        let updatePassword = map.get(updateId).password;
        let updateRoles = map.get(updateId).roles;

        $(".modal-body #idEdit").val(updateId);
        $(".modal-body #firstNameEdit").val(updateFirstName);
        $(".modal-body #lastNameEdit").val(updateLastName);
        $(".modal-body #ageEdit").val(updateAge);
        $(".modal-body #emailEdit").val(updateEmail);
        $(".modal-body #roleEdit").val(updateRoles);

        $("#submitEdit").on('click', function (event) {

            let user = {
                'id': $("#idEdit").val(),
                'firstName': $('#firstNameEdit').val(),
                'lastName': $('#lastNameEdit').val(),
                'age': $('#ageEdit').val(),
                'email': $('#emailEdit').val(),
                'password': updatePassword,
                'roles': $("#roleEdit").val()
            };
            $.ajax({
                method: 'PUT',
                url: `/admin/edit/`,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(user),
                success: function (data) {
                    $("#editModal").modal('hide');
                    map.clear();
                    $('#usersTable').empty();
                    showUsers(data);
                },
                error: console.log('error')
            });
        });
    });
})

$(document).ready(function () {
    $("#modalDelete").on('show.bs.modal', function (event) {
        let deleteId = $(event.relatedTarget).data('id');
        let deleteFirstName = map.get(deleteId).firstName;
        let deleteLastName = map.get(deleteId).lastName;
        let deleteAge = map.get(deleteId).age;
        let deleteEmail = map.get(deleteId).email;

        $(".modal-body #idDelete").val(deleteId);
        $(".modal-body #firstNameDelete").val(deleteFirstName);
        $(".modal-body #lastNameDelete").val(deleteLastName);
        $(".modal-body #ageDelete").val(deleteAge);
        $(".modal-body #emailDelete").val(deleteEmail);

        $("#submitDelete").on('click', function (event) {
            let user = {'id': $("#idDelete").val()};
            $.ajax({
                method: 'DELETE',
                url: `/admin/delete/`,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(user),
                success: function (data) {
                    $("#modalDelete").modal('hide');
                    map.clear();
                    $users.empty()
                    showUsers(data);
                },
            });
        });
    });
})

$(document).ready(function () {
    $(function () {
        $("#submitAdd").on('click', function (event) {
            let user = {
                'firstName': $('#firstNameAdd').val(),
                'lastName': $('#lastNameAdd').val(),
                'age': $('#ageAdd').val(),
                'email': $('#emailAdd').val(),
                'password': $('#passwordAdd').val(),
                'roles': $('#roleAdd').val()
            };

            $.ajax({
                type: 'POST',
                url: '/admin/addUser',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(user),
                success: function (data) {
                    $users.empty()
                    $('#admin_panel').tab('show')
                }
            });
        });
    });
})
