
listar();

function listar() {


    $.get("Matricula/listar", function (data) {
        crearListado(["Id", "Periodo", "Grado", "Seccion", "Alumno"], data);
    });


    $.get("Matricula/listarPeriodos", function (data) {
        llenarCombo(data, document.getElementById("cboPeriodo"), true);
    })

    $.get("Matricula/listarGradoSeccion", function (data) {
        llenarCombo(data, document.getElementById("cboGradoSeccion"), true);
    })

    $.get("Matricula/listarAlumnos", function (data) {
        llenarCombo(data, document.getElementById("cboAlumno"), true);
    })


}

function recuperar(idPeriodo , idGradoSeccion) {

    $.get("Matricula/listarCursosPorPeriodoYGrado/?iidPeriodo=" + idPeriodo + "&iidGradoSeccion=" + idGradoSeccion, function (data) {
        var contenido = "<tbody>";
        for (var i = 0; i < data.length; i++) {
            contenido += "<tr>";

            contenido += "<td>";
 
            contenido += "<input class='checkbox' id=" + data[i].IIDCURSO + " type='checkbox' checked='true' />"
           
            contenido += "</td>";

            contenido += "<td>";
            contenido += data[i].NOMBRE;
            contenido += "</td>";


            contenido += "</tr>";

        }

        contenido += "</tbody>";
        document.getElementById("tablaCurso").innerHTML = contenido;
    })

}



var cboPeriodo = document.getElementById("cboPeriodo");
var cboGradoSeccion = document.getElementById("cboGradoSeccion");
cboPeriodo.onchange = function () {

    if (cboGradoSeccion.value != "" && cboPeriodo.value != "") {

        recuperar(cboPeriodo.value, cboGradoSeccion.value);
    }

}
cboGradoSeccion.onchange = function () {
    if (cboGradoSeccion.value != "" && cboPeriodo.value != "") {

        recuperar(cboPeriodo.value, cboGradoSeccion.value);
    }

}

function Agregar() {
    if (datosObligarios() == true) {

        //Validaremos si es que hay cursos o no
       var checkBoxes= document.getElementsByClassName("checkbox");
       if (checkBoxes.length == 0) {
           alert("No hay cursos asignados a ese periodo y grado");
           return;
       }
        //Vamos a ver cuantos estan seleccionados
       var c = 0;
       for (var i = 0; i < checkBoxes.length; i++) {

           if (checkBoxes[i].checked == true) {
               c++;
           }

       }
       if (c == 0) {
           alert("No ha seleccionado ningun curso");
           return;
       }

        var frm = new FormData();
        var id = document.getElementById("txtId").value;
        var periodo = document.getElementById("cboPeriodo").value;
        var gradoseccion = document.getElementById("cboGradoSeccion").value;
        var alumno = document.getElementById("cboAlumno").value;

        frm.append("IIDMATRICULA", id);
        frm.append("IIDPERIODO", periodo);
        frm.append("IIDGRADOSECCION", gradoseccion);
        frm.append("IIDALUMNO", alumno);

        //Los campos habilitados
        var valorAEnviar="";
        var valorADeshabilitar = "";
        var checkbox = document.getElementsByClassName("checkbox");
        var ncheckbox = checkbox.length;
        for (var i = 0; i < ncheckbox; i++) {
            if (checkbox[i].checked == true) {
                valorAEnviar += checkbox[i].id;
                valorAEnviar += "$";
            } else {
                valorADeshabilitar += checkbox[i].id;
                valorADeshabilitar += "$";
            }
        }

        if(valorAEnviar!="")
        valorAEnviar = valorAEnviar.substring(0, valorAEnviar.length - 1);
        
        if (valorADeshabilitar != "") {
            valorADeshabilitar = valorADeshabilitar.substring(0, valorADeshabilitar.length - 1);
        }

        frm.append("valorAEnviar", valorAEnviar);
        frm.append("valorADeshabilitar", valorADeshabilitar);
        //Son los Id de los check seleccionados  5$2$6

        frm.append("BHABILITADO", 1);
        if (confirm("¿Desea realmente guardar?") == 1) {
            $.ajax({
                type: "POST",
                url: "Matricula/guardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == -1) {
                        alert("Ya existe matricula")

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


function eliminar(idMatricula) {

    if (confirm("¿Desea eliminar realmente?") == 1) {
        $.get("Matricula/eliminar/?idMatricula=" + idMatricula, function (data) {

            if (data == 1) {
                alert("Se elimino correctamente");
                listar();
            } else {
                alert("Ocurrio un error");

            }


        })
    }



}

function abrirModal(idMatricula) {
  
    borrarDatos();
    document.getElementById("tablaCurso").innerHTML = "";

    if (idMatricula != 0) {
        $.get("Matricula/obtenerMatricula/?iidmatricula=" + idMatricula, function (data) {

            document.getElementById("cboAlumno").style.display = "none";
            document.getElementById("spnContenido").style.display = "none";

            document.getElementById("txtId").value = data.IIDMATRICULA;
            document.getElementById("cboPeriodo").value = data.IIDPERIODO;
            document.getElementById("cboGradoSeccion").value = data.IIDSECCION;
            document.getElementById("cboAlumno").value = data.IIDALUMNO;

        })

    } else {
        document.getElementById("cboAlumno").style.display = "block";
        document.getElementById("spnContenido").style.display = "block";
    }

    if (idMatricula != 0) {
        $.get("Matricula/Cursos/?iidmatricula=" + idMatricula, function (data) {
            var contenido = "<tbody>";
            for (var i = 0; i < data.length; i++) {
                contenido += "<tr>";

                contenido += "<td>";
                if (data[i].bhabilitado == 1)
                    contenido += "<input class='checkbox' id=" + data[i].IIDCURSO + " type='checkbox' checked='true' />"
                else
                    contenido += "<input type='checkbox' id=" + data[i].IIDCURSO + " class='checkbox'  />"
                contenido += "</td>";

                contenido += "<td>";
                contenido += data[i].NOMBRE;
                contenido += "</td>";


                contenido += "</tr>";

            }

            contenido += "</tbody>";
            document.getElementById("tablaCurso").innerHTML = contenido;
        })
    }


}