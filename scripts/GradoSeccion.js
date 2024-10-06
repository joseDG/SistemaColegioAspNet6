
listar();

function listar() {

    $.get("GradoSeccion/listarGradoSeccion", function (data) {

        crearListado(["Id Grado Seccion", "Nombre Grado", "Nombre Seccion"], data);
    })
    
    $.get("GradoSeccion/listarSeccion", function (data) {
        llenarCombo(data, document.getElementById("cboSeccion"), true);

    })

    $.get("GradoSeccion/listarGrado", function (data) {
        llenarCombo(data, document.getElementById("cboGrado"), true);

    })

}


function llenarCombo(data, control, primerElemento) {
    var contenido = "";
    if (primerElemento == true) {
        contenido += "<option value=''>--Seleccione--</option>";
    }
    for (var i = 0; i < data.length; i++) {
        contenido += "<option value='" + data[i].IID + "'>";

        contenido += data[i].NOMBRE;

        contenido += "</option>";

    }
    control.innerHTML = contenido;
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

        $.get("GradoSeccion/recuperarInformacion/?id=" + id, function (data) {

            document.getElementById("txtIdGradoSeccion").value = data[0].IID;
            document.getElementById("cboGrado").value = data[0].IIDGRADO;
            document.getElementById("cboSeccion").value = data[0].IIDSECCION;

        });

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

function borrarDatos() {
    var controles = document.getElementsByClassName("borrar");
    var ncontroles = controles.length;
    for (var i = 0; i < ncontroles; i++) {
        controles[i].value = "";
    }

}


function Agregar() {
    if (datosObligarios() == true) {
        var frm = new FormData();
        var id = document.getElementById("txtIdGradoSeccion").value;
        var grado = document.getElementById("cboGrado").value;
        var seccion = document.getElementById("cboSeccion").value;
        frm.append("IID", id);
        frm.append("IIDGRADO", grado);
        frm.append("IIDSECCION", seccion);
        frm.append("BHABILITADO", 1);
        if (confirm("¿Desea realmente guardar?") == 1) {
            $.ajax({
                type: "POST",
                url: "GradoSeccion/guardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {

                    if (data == -1) {
                        alert("Ya existe ese registro");
                    }else
                    if (data == 1) {
                        listar();
                        alert("Se ejecuto correctamente");
                        document.getElementById("btnCancelar").click();
                    } else {
                        alert("Ocurrio un error;")
                    }

                }


            });
        }


    }
    else {

    }
}

function eliminar(id) {

    if (confirm("Desea eliminar?") == 1) {

        $.get("GradoSeccion/eliminar/?id=" + id, function (data) {
            if (data == 0) {
                alert("Ocurrio un error");
            } else {
                alert("Se elimino correctamente");
                listar();
            }


        })


    }

}