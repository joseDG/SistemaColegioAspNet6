listar();
function listar() {
    $.get("Pagina/listarPaginas", function (data) {

        crearListado(["Id Pagina", "Mensaje", "Controlador","Accion"], data);
    }
     );
}


function crearListado(arrayColumnas, data) {
    var contenido = "";
    contenido += "<table id='tablas'  class='table' >";
    contenido += "<thead>";
    contenido += "<tr>";
    for (var i = 0; i < arrayColumnas.length; i++) {
        contenido += "<td>";
        contenido += arrayColumnas[i];
        contenido += "</td>";

    }
    contenido += "<td>Operaciones</td>";
    contenido += "</tr>";
    contenido += "</thead>";
    var llaves = Object.keys(data[0]);
    contenido += "<tbody>";
    for (var i = 0; i < data.length; i++) {
        contenido += "<tr>";
        for (var j = 0; j < llaves.length; j++) {
            var valorLLaves = llaves[j];
            contenido += "<td>";
            contenido += data[i][valorLLaves];
            contenido += "</td>";

        }
        var llaveId = llaves[0];
        contenido += "<td>";
        contenido += "<button class='btn btn-primary' onclick='abrirModal(" + data[i][llaveId] + ")' data-toggle='modal' data-target='#myModal'><i class='glyphicon glyphicon-edit'></i></button> "
        contenido += "<button class='btn btn-danger' onclick='eliminar(" + data[i][llaveId] + ")' ><i class='glyphicon glyphicon-trash'></i></button>"
        contenido += "</td>"

        contenido += "</tr>";
    }
    contenido += "</tbody>";
    contenido += "</table>";
    document.getElementById("tabla").innerHTML = contenido;
    $("#tablas").dataTable(
        {
            searching: false
        }

        );
}

function abrirModal(id) {

    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        controlesObligatorio[i].parentNode.classList.remove("error");
    }

    if (id == 0) {
        borrarDatos();
    } else {

        $.get("Pagina/recuperarDatos/?id=" + id, function (data) {
          
            document.getElementById("txtIdPagina").value = data.IIDPAGINA;

            document.getElementById("txtMensaje").value = data.MENSAJE;
            document.getElementById("txtControlador").value = data.CONTROLADOR;
            document.getElementById("txtAccion").value = data.ACCION;


        });

    }
}

function Agregar() {
    if (datosObligarios() == true) {
        var frm = new FormData();
        //Capturar los valores
        var id = document.getElementById("txtIdPagina").value;
        var mensaje = document.getElementById("txtMensaje").value;
        var controlador = document.getElementById("txtControlador").value;
        var accion = document.getElementById("txtAccion").value;


        frm.append("IIDPAGINA", id);
        frm.append("MENSAJE", mensaje);
        frm.append("CONTROLADOR", controlador);
        frm.append("ACCION", accion);

        frm.append("BHABILITADO", 1);
        if (confirm("¿Desea realmente guardar?") == 1) {
            $.ajax({
                type: "POST",
                url: "Pagina/guardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == 1) {
                        listar();
                        alert("Se ejecuto correctamente");
                        document.getElementById("btnCancelar").click();
                    } else {
                        if (data == -1) {
                            alert("Ya existe el curso;")

                        } else
                            alert("Ocurrio un error;")
                    }

                }


            });
        }


    }

}


function borrarDatos() {
    var controles = document.getElementsByClassName("borrar");
    var ncontroles = controles.length;
    for (var i = 0; i < ncontroles; i++) {
        controles[i].value = "";
    }

}

function datosObligarios() {
    var exito = true;
    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        if (controlesObligatorio[i].value == "") {
            exito = false;
            controlesObligatorio[i].parentNode.classList.add("error");
        }
        else {
            controlesObligatorio[i].parentNode.classList.remove("error");
        }
    }

    return exito;
}
