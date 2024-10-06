
$("#dtFechaContrato").datepicker(
     {
         dateFormat: "dd/mm/yy",
         changeMonth: true,
         changeYear: true
     }
    );


listar();
listarComboModalidad();


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

function eliminar(id) {

    if (confirm("Desea eliminar?")==1) {

        $.get("Docente/eliminar/?id=" + id, function (data) {
            if (data == -1) {
                alert("Ya existe el docente");
            }else
            if (data == 0) {
                alert("Ocurrio un error");
            } else {
                alert("Se elimino correctamente");
                listar();
            }


        })


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




$.get("Alumno/listarSexo", function (data) {

    llenarCombo(data, document.getElementById("cboSexoPopup"), true)
})

function listarComboModalidad() {

    $.get("Docente/listarModalidadContrato", function (data) {

        llenarCombo(data, document.getElementById("cboTipoModalidad"), true);
        llenarCombo(data, document.getElementById("cboModalidadContratoPopup"), true);
    })

}

var cboTipoModalidad = document.getElementById("cboTipoModalidad");
cboTipoModalidad.onchange = function () {
    var iidmodalidad = document.getElementById("cboTipoModalidad").value;
    if (iidmodalidad == "") {
        listar();
    } else {
        $.get("Docente/filtrarDocentePorModalidad/?iidmodalidad=" + iidmodalidad, function (data) {
            crearListado(["Id Docente", "Nombre", "Apellido Paterno",
                "Apellido Materno", "Email"
            ], data);
        });
    }
}

function listar() {

    $.get("Docente/listarDocente", function (data) {

        crearListado(["Id Docente", "Nombre", "Apellido Paterno",
            "Apellido Materno","Email"
        ], data

        )
    });

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

        $.get("Docente/recuperarInformacion/?id=" + id, function (data) {

            document.getElementById("txtIdDocente").value = data[0].IIDDOCENTE;
            document.getElementById("txtnombre").value = data[0].NOMBRE;
            document.getElementById("txtApPaterno").value = data[0].APPATERNO;

            document.getElementById("txtApMaterno").value = data[0].APMATERNO;
            document.getElementById("txtdireccion").value = data[0].DIRECCION;
            document.getElementById("txttelefonoFijo").value = data[0].TELEFONOFIJO;

            document.getElementById("txttelefonocelular").value = data[0].TELEFONOCELULAR;
            document.getElementById("txtemail").value = data[0].EMAIL;
            document.getElementById("cboSexoPopup").value = data[0].IIDSEXO;

            document.getElementById("dtFechaContrato").value = data[0].FECHACONTRACT;
            document.getElementById("cboModalidadContratoPopup").value = data[0].IIDMODALIDADCONTRATO;

            document.getElementById("imgFoto").src = "data:image/png;base64,"+data[0].FOTOMOSTRAR;
        });

    }
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

function Agregar() {

    if (datosObligarios() == true) {

        if (confirm("Desea realiar los cambios?") == 1) {

          var iddocente=  document.getElementById("txtIdDocente").value ;
         var nombre=   document.getElementById("txtnombre").value ;
          var apPaterno=  document.getElementById("txtApPaterno").value ;

         var apMaterno=   document.getElementById("txtApMaterno").value ;
         var direccion=   document.getElementById("txtdireccion").value ;
         var telFijo=   document.getElementById("txttelefonoFijo").value ;

         var telCelular=   document.getElementById("txttelefonocelular").value ;
         var email=   document.getElementById("txtemail").value ;
         var iidsexo=   document.getElementById("cboSexoPopup").value;

          var fechaContrato=  document.getElementById("dtFechaContrato").value ;
          var idmodalidad=  document.getElementById("cboModalidadContratoPopup").value ;
          var imgFoto = document.getElementById("imgFoto").src.replace("data:image/png;base64,", "");

          var frm = new FormData();
          frm.append("IIDDOCENTE", iddocente);
          frm.append("NOMBRE", nombre);
          frm.append("APPATERNO", apPaterno);
          frm.append("APMATERNO", apMaterno);
          frm.append("DIRECCION", direccion);
          frm.append("TELEFONOCELULAR", telCelular);
          frm.append("TELEFONOFIJO", telFijo);
          frm.append("EMAIL", email);
          frm.append("IIDSEXO", iidsexo);
          frm.append("FECHACONTRATO", fechaContrato);
          frm.append("CADENAFOTO", imgFoto);
          frm.append("IIDMODALIDADCONTRATO", idmodalidad);
          frm.append("BHABILITADO", 1);


          $.ajax({
              type: "POST",
              url: "Docente/guardarDatos",
              data: frm,
              contentType: false,
              processData: false,
              success: function (data) {
                  if (data == 0) {
                      alert("Ocurrio un error");
                  } else if (data == -1) {
                      alert("Ya existe el docente");

                  }else

                  {
                      alert("Se ejecuto correctamente");
                      listar();
                      document.getElementById("btnCancelar").click();
                  }

              }
          })



        }

    }


}

var btnFoto = document.getElementById("btnFoto");
btnFoto.onchange = function (e) {

  var file=  document.getElementById("btnFoto").files[0];
  var reader = new FileReader();
  if (reader != null) {
      reader.onloadend = function () {
          var img = document.getElementById("imgFoto");
          img.src = reader.result;
          alert(reader.result.replace("data:image/png;base64,",""));
      }
  }
  reader.readAsDataURL(file);
}