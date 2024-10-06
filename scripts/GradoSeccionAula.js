﻿
listar();


    var periodo = document.getElementById("cboPeriodo");
    var gradoseccion = document.getElementById("cboGradoSeccion");





    periodo.onchange = function () {

        if (periodo.value != "" && gradoseccion.value != "") {

            $.get("GradoSeccionAula/listarCursos/?IIDPERIODO=" + periodo.value + "&IIDGRADOSECCION=" + gradoseccion.value, function (data) {
                llenarCombo(data, document.getElementById("cboCurso"), true);
            })


        } 

    }
    gradoseccion.onchange = function () {

        if (periodo.value != "" && gradoseccion.value != "") {
            $.get("GradoSeccionAula/listarCursos/?IIDPERIODO=" + periodo.value + "&IIDGRADOSECCION=" + gradoseccion.value, function (data) {
                llenarCombo(data, document.getElementById("cboCurso"), true);
            })
        }
    }





function listar() {

    $.get("GradoSeccionAula/listar", function (data) {

        crearListado(["Id", "Nombre periodo", "Nombre grado", "Nombre Curso", "Nombre docente"], data);

    })

    $.get("GradoSeccionAula/listarPeriodos", function (data) {

        llenarCombo(data, document.getElementById("cboPeriodo"), true);
    })

    $.get("GradoSeccionAula/listarGradoSeccion", function (data) {

        llenarCombo(data, document.getElementById("cboGradoSeccion"), true);
    })




    $.get("GradoSeccionAula/listarAulas", function (data) {

        llenarCombo(data, document.getElementById("cboAula"), true);
    })

    $.get("GradoSeccionAula/listarDocentes", function (data) {

        llenarCombo(data, document.getElementById("cboDocente"), true);
    })

   
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



function abrirModal(id) {

    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        controlesObligatorio[i].parentNode.classList.remove("error");
    }

    if (id == 0) {
        borrarDatos();
    } else {

        $.get("GradoSeccionAula/recuperarInformacion/?iid=" + id, function (data) {

            document.getElementById("txtId").value = data[0].IID;
          
            document.getElementById("cboGradoSeccion").value = data[0].IIDGRADOSECCION;
            document.getElementById("cboPeriodo").value = data[0].IIDPERIODO;

            $.get("GradoSeccionAula/listarCursos/?IIDPERIODO=" + periodo.value + "&IIDGRADOSECCION=" + gradoseccion.value, function (rpta) {
                llenarCombo(rpta, document.getElementById("cboCurso"), true);
                document.getElementById("cboCurso").value = data[0].IIDCURSO;
            })

            document.getElementById("cboDocente").value = data[0].IIDDOCENTE;
            document.getElementById("cboAula").value = data[0].IIDAULA;


        });

    }
}

function Agregar() {
    if (datosObligarios() == true) {
        var frm = new FormData();
        var id = document.getElementById("txtId").value;
        var periodo = document.getElementById("cboPeriodo").value;
        var gradoSeccion = document.getElementById("cboGradoSeccion").value;

        var curso = document.getElementById("cboCurso").value;
        var docente = document.getElementById("cboDocente").value;
        var aula = document.getElementById("cboAula").value;

        
        frm.append("IID", id);
        frm.append("IIDPERIODO", periodo);
        frm.append("IIDGRADOSECCION", gradoSeccion);

        frm.append("IIDAULA", aula);
        frm.append("IIDDOCENTE", docente);
        frm.append("IIDCURSO", curso);


        frm.append("BHABILITADO", 1);



        if (confirm("¿Desea realmente guardar?") == 1) {
            $.ajax({
                type: "POST",
                url: "GradoSeccionAula/guardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == -1) {
                        alert("Ya existe el registro");

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


function eliminar(id) {

    if (confirm("Desea eliminar?") == 1) {

        $.get("GradoSeccionAula/eliminar/?id=" + id, function (data) {
            if (data == 0) {
                alert("Ocurrio un error");
            } else {
                alert("Se elimino correctamente");
                listar();
            }


        })


    }

}