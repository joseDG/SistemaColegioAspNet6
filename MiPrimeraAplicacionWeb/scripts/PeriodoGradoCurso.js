﻿window.onload = function () {
    voz("Bienvenido al formulario Periodo Grado Curso");
}


function voz(mensaje) {

    var vozHablar = new SpeechSynthesisUtterance(mensaje);
    window.speechSynthesis.speak(vozHablar);


}


listar();
function listar() {

    $.get("PeriodoGradoCurso/listarPeriodoGradoCurso", function (data) {

        crearListado(["Id", "Periodo","Grado", "Curso"], data);
    })

    $.get("PeriodoGradoCurso/listarPeriodo", function (data) {

        llenarCombo(data, document.getElementById("cboPeriodo"), true);

    });


    $.get("PeriodoGradoCurso/listarGrado", function (data) {

        llenarCombo(data, document.getElementById("cboGrado"), true);

    });


    $.get("PeriodoGradoCurso/listarCurso", function (data) {

        llenarCombo(data, document.getElementById("cboCurso"), true);

    });


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



function abrirModal(id) {

    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        controlesObligatorio[i].parentNode.classList.remove("error");
    }

    if (id == 0) {
        borrarDatos();
        document.getElementById("lblTitulo").innerHTML = "Agregando Periodo Grado Curso";
        voz("Agregando Periodo Grado Curso");
    } else {
        voz("Editando Periodo Grado Curso");
        document.getElementById("lblTitulo").innerHTML = "Editando Periodo Grado Curso";

        $.get("PeriodoGradoCurso/recuperarInformacion/?id=" + id, function (data) {

            document.getElementById("txtId").value = data[0].IID;
            document.getElementById("cboPeriodo").value = data[0].IIDPERIODO;
            document.getElementById("cboGrado").value = data[0].IIDGRADO;
            document.getElementById("cboCurso").value = data[0].IIDCURSO;

        });

    }
}


function Agregar() {
    if (datosObligarios() == true) {
        var frm = new FormData();
        var id = document.getElementById("txtId").value;
        var periodo = document.getElementById("cboPeriodo").value;
        var grado = document.getElementById("cboGrado").value;
        var curso = document.getElementById("cboCurso").value;

        
        frm.append("IID", id);
        frm.append("IIDPERIODO", periodo);
        frm.append("IIDGRADO", grado);
        frm.append("IIDCURSO", curso);


        frm.append("BHABILITADO", 1);


        if (confirm("¿Desea realmente guardar?") == 1) {
            $.ajax({
                type: "POST",
                url: "PeriodoGradoCurso/guardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == -1) {
                        alert("Ya existe ese registro")
                        voz("Ya existe ese registro");

                    }else

                    if (data == 1) {
                        listar();
                        alert("Se ejecuto correctamente");
                        voz("Se ejecuto correctamente");
                        document.getElementById("btnCancelar").click();
                    } else {
                        alert("Ocurrio un error")
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

        $.get("PeriodoGradoCurso/eliminar/?id=" + id, function (data) {
            if (data == 0) {
                alert("Ocurrio un error");
            } else {
                alert("Se elimino correctamente");
                listar();
            }


        })


    }

}

function Cerrar() {
    voz("Cerrando el popup Periodo Grado Curso");
}