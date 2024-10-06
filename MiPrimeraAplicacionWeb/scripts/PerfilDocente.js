window.onload = function () {

    $.get("ProfesorNotas/listarPeriodos", function (data) {

        llenarCombo(data, document.getElementById("cboPeriodo"), true);
    })

}

function buscarGrado() {

    var idPeriodo = document.getElementById("cboPeriodo").value;
    if (idPeriodo != "") {
        $.get("ProfesorNotas/listarGrados/?iidPeriodo=" + idPeriodo, function (data) {

            llenarCombo(data, document.getElementById("cboGrado"), true);
        })
    }


}

function buscarCurso() {
    var idPeriodo = document.getElementById("cboPeriodo").value;
    var idGrado = document.getElementById("cboGrado").value;
    if (idPeriodo != "" && idGrado != "") {
        $.get("ProfesorNotas/listarCursos/?iidPeriodo=" + idPeriodo + "&iidGrado=" + idGrado, function (data) {

            llenarCombo(data, document.getElementById("cboCurso"), true);
        })

    }

}


function buscarAlumnos() {
    var idPeriodo = document.getElementById("cboPeriodo").value;
    var idGrado = document.getElementById("cboGrado").value;
    var idCurso = document.getElementById("cboCurso").value;
    if (idPeriodo != "" && idGrado != "" && idCurso != "") {
        $.get("ProfesorNotas/listarAlumnos/?iidPeriodo=" + idPeriodo + "&iidGrado=" + idGrado + "&iidCurso=" + idCurso, function (data) {

            crearListado(["Id Alumno", "Nombre Completo", "Nota 1", "Nota 2", "Nota 3", "Nota 4", "Promedio","Id Matricula","Id Curso"], data);
        })

    } else {
        document.getElementById("tabla").innerHTML = "";
        alert("Debe seleccionar todos los campos para hacer la busqueda");
    }


}

function crearListado(arrayColumnas, data) {
    var contenido = "";
    contenido += "<table id='tablas'  class='table' >";
    contenido += "<thead>";
    contenido += "<tr>";
    for (var i = 0; i < arrayColumnas.length; i++) {
        if (i < arrayColumnas.length - 2) {
            contenido += "<td>";
            contenido += arrayColumnas[i];
            contenido += "</td>";
        } else {
            contenido += "<td style='display:none'>";
            contenido += arrayColumnas[i];
            contenido += "</td>";
        }
    }
    contenido += "<td>Operaciones";
    contenido += "</td>";
    //contenido += "<td>Operaciones</td>";
    contenido += "</tr>";
    contenido += "</thead>";
    var llaves = Object.keys(data[0]);
    contenido += "<tbody>";
    //Condicion

    if (data.length == 0) {
        contenido += "";
    } else {

        for (var i = 0; i < data.length; i++) {
            contenido += "<tr>";
            for (var j = 0; j < llaves.length; j++) {
                var valorLLaves = llaves[j];
                if (j < llaves.length - 2) {

                    contenido += "<td>";
                    contenido += data[i][valorLLaves];
                    contenido += "</td>";
                } else {
                    contenido += "<td style='display:none'>";
                    contenido += data[i][valorLLaves];
                    contenido += "</td>";
                }

            }
            var llaveId = llaves[0];
            var idAlumno = data[i][llaveId];
            contenido += "<td>";
            contenido += "<button class='btn btn-primary' id='btnEditar" + idAlumno + "' onclick='HabilitarEdicion(this," + idAlumno + ")'>Editar</button>";
            contenido += "<button class='btn btn-success' onclick='Guardar(this)' style='display:none' id='btnGuardar" + idAlumno + "'>Guardar</button>";
            contenido += "<button class='btn btn-danger' style='display:none' id='btnCancelar" + idAlumno + "' onclick='Cancelar(this," + idAlumno + ")'>Cancelar</button>";
            contenido += "</td>"

            contenido += "</tr>";
        }
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


function voz(mensaje) {

    var vozHablar = new SpeechSynthesisUtterance(mensaje);
    window.speechSynthesis.speak(vozHablar);


}

function Guardar(button) {

  var celda=  button.parentNode;
  var fila = celda.parentNode;
  var iidMatricula = fila.cells[7].innerHTML;
  var iidCurso = fila.cells[8].innerHTML;
  var iidAlumno = fila.cells[0].innerHTML;
  var frm = new FormData();

  var nota1 = fila.cells[2].childNodes[0].value;
  var nota2 = fila.cells[3].childNodes[0].value;
  var nota3 = fila.cells[4].childNodes[0].value;
  var nota4 = fila.cells[5].childNodes[0].value;


  frm.append("NOTA1", nota1);
  frm.append("NOTA2", nota2);
  frm.append("NOTA3", nota3);
  frm.append("NOTA4", nota4);
  frm.append("IIDMATRICULA", iidMatricula);
  frm.append("IIDCURSO", iidCurso);

    
  if (confirm("Desea guardar los cambios") == 1) {

      $.ajax({
          type: "POST",
          url: "ProfesorNotas/ingresarNota",
          data: frm,
          contentType: false,
          processData: false,
          success: function (data) {
              if (data != 0) {
                 
                  voz("Se guardo la nota correctamente");
                  document.getElementById("btnEditar" + iidAlumno).style.display = "inline-block";
                  document.getElementById("btnGuardar" + iidAlumno).style.display = "none";
                  document.getElementById("btnCancelar" + iidAlumno).style.display = "none";

                  fila.cells[2].innerHTML = nota1;
                  fila.cells[3].innerHTML = nota2;
                  fila.cells[4].innerHTML = nota3;
                  fila.cells[5].innerHTML = nota4;
                  fila.cells[6].innerHTML = data;
              } else {
   
                      alert("Ocurrio un error;")
              }

          }


      });


  }

}

function Cancelar(button,idAlumno) {
    document.getElementById("btnEditar" + idAlumno).style.display = "inline-block";
    document.getElementById("btnGuardar" + idAlumno).style.display = "none";
    document.getElementById("btnCancelar" + idAlumno).style.display = "none";

    var celda = button.parentNode;
    var fila = celda.parentNode;

   var nota1= fila.cells[2].childNodes[0].getAttribute("data-val");
   var nota2 = fila.cells[3].childNodes[0].getAttribute("data-val");
   var nota3 = fila.cells[4].childNodes[0].getAttribute("data-val");
   var nota4 = fila.cells[5].childNodes[0].getAttribute("data-val");

   fila.cells[2].innerHTML = nota1;
   fila.cells[3].innerHTML = nota2;
   fila.cells[4].innerHTML = nota3;
   fila.cells[5].innerHTML = nota4;



}

function HabilitarEdicion(button,idAlumno) {

    document.getElementById("btnEditar" + idAlumno).style.display = "none";
    document.getElementById("btnGuardar" + idAlumno).style.display = "inline-block";
    document.getElementById("btnCancelar" + idAlumno).style.display = "inline-block";

    //Vamos a poner celdas editables
    var celda= button.parentNode;
    var fila = celda.parentNode;

   var nota1= fila.cells[2].innerHTML;
   var nota2 = fila.cells[3].innerHTML;
   var nota3 = fila.cells[4].innerHTML;
   var nota4 = fila.cells[5].innerHTML;

   fila.cells[2].innerHTML = "<input data-val='"+ nota1 +"' type='number' value='" + nota1 + "' min='0' max='20' />";
   fila.cells[3].innerHTML = "<input data-val='" + nota2 + "' type='number' value='" + nota2 + "' min='0' max='20' />";
   fila.cells[4].innerHTML = "<input data-val='" + nota3 + "'  type='number' value='" + nota3 + "' min='0' max='20' />";
   fila.cells[5].innerHTML = "<input data-val='" + nota4 + "' type='number' value='" + nota4 + "' min='0' max='20' />";

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