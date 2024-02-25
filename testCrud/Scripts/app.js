
let id_delete = "";
let id_edit = "";
const inputNombre = document.getElementById('inputNombre');
const inputApellido = document.getElementById('inputApellido');
const inputEmail = document.getElementById('inputEmail');
const inputTelefono = document.getElementById('inputTelefono');
const inputDireccion = document.getElementById('inputDireccion');
const nameCustomerModal = document.getElementById('nameCustomerModal');
document.addEventListener("DOMContentLoaded", init);
const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
function init() {
    let btn_delete = document.getElementById('btn_delete');
    btn_delete.addEventListener('click', function () {
        deleteCustomer(id_delete);
    });
    let btn_add_customer = document.getElementById('btn_add_customer');
    btn_add_customer.addEventListener('click', function () {
        id_edit = "";
        inputNombre.value = "";
        inputApellido.value = "";
        inputEmail.value = "";
        inputTelefono.value = "";
        inputDireccion.value = "";
        document.getElementById('ModalABMLabel').innerHTML = "Agregar cliente";
        let ModalABM = new bootstrap.Modal(document.getElementById('ModalABM'));
        ModalABM.show();
    });
    let btn_save = document.getElementById('btn_save');
    btn_save.addEventListener('click', function () {
        saveCustomer();
    });
    $('#tableCustomers').DataTable({
        "ordering": true,
        "order": [
            [1, "desc"]
        ],
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningun dato disponible",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            },
            "buttons": {
                "copy": "Copiar",
                "colvis": "Visibilidad"
            }
        }
    });
}
async function getCustomer(idEditar) {
    let url = "Home/getCustomer/"+idEditar;
   
    let result = await fetch(
        url,
        {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            },
        }
    );
    customer = await result.json();
    return customer;
}
function launchConfirmation(id,nameCustomer) {
    id_delete = id;
    nameCustomerModal.innerHTML = nameCustomer;
    $("#ModalConfirmation").modal("show");
}
async function deleteCustomer(id) {
    let url = "Home/Delete/"+id;
    await fetch(
        url,
        {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Acept": "application/json, text/plain"
            }
        }
    ).then(Response => {
        if (Response.ok) {
            Toast.fire({
                icon: "success",
                title: "Se ha eliminado exitosamente."
            });
        } else {
            Toast.fire({
                icon: "error",
                title: "No se pudo eliminar el cliente."
            });
        }
    });
    closeModalConfirmation();
    id_delete = "";
    setTimeout(function(){
        location.reload();
    },3000);
}
function closeModalConfirmation() {
    $("#ModalConfirmation").modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}
async function saveCustomer() {
    let url = '';
    //valido los campos a insertar/editar
    if (inputNombre.value == "") {
        inputNombre.setCustomValidity('El nombre no puede quedar vacio.');
        inputNombre.reportValidity();
        return false;
    }
    if (inputApellido.value == "") {
        inputApellido.setCustomValidity('El apellido no puede quedar vacio.');
        inputApellido.reportValidity();
        return false;
    }
    if (inputEmail.value == "") {
        inputEmail.setCustomValidity('El correo no puede quedar vacio.');
        inputEmail.reportValidity();
        return false;
    }
    if (!validateEmail(inputEmail.value)) {
        inputEmail.setCustomValidity('Formato incorrecto, el email debe tener un formato "nombre@ejemplo.com".');
        inputEmail.reportValidity();
        return false;
    }
    let data = {
        firstName: inputNombre.value,
        lastName: inputApellido.value,
        email: inputEmail.value,
        phone: inputTelefono.value,
        address: inputDireccion.value
    };
    if (id_edit != "") {
        data.id = id_edit;
        url = "Home/saveEdit";
    } else {
        url = "Home/saveNew";
    }
    await fetch(
        url,
        {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
            },
            "body": JSON.stringify(data)
        }
    ).then(Response => {
        if (Response.ok) {
            Toast.fire({
                icon: "success",
                title: "Se guardaron los campos exitosamente "
            });
        } else {
            Toast.fire({
                icon: "error",
                title: "No se pudo guardar los campos"
            });
        }
    });
    id_edit = "";
    closeModalABM();
    setTimeout(function () {
        location.reload();
    }, 3000);
}
function closeModalABM() {
    $("#ModalABM").modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}
async function editCustomer(idEdit) {
    let customerEdit = await getCustomer(idEdit);
    id_edit = customerEdit.id;
    inputNombre.value = customerEdit.firstname;
    inputApellido.value = customerEdit.lastname;
    inputEmail.value = customerEdit.email;
    inputTelefono.value = customerEdit.phone;
    inputDireccion.value = customerEdit.address;
    document.getElementById('ModalABMLabel').innerHTML = "Editar cliente";
    let ModalABM = new bootstrap.Modal(document.getElementById('ModalABM'));
    ModalABM.show();
}
function validateEmail(email) {
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionRegular.test(email);
}
