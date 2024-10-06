window.onload = function () {
    voz("Bienvenido a la pagina Alumno");
}
function voz(mensaje) {

    var vozHablar = new SpeechSynthesisUtterance(mensaje);
    window.speechSynthesis.speak(vozHablar);


}

$("#dtFechaNacimiento").datepicker(
    {
        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear: true
    }

    );

listar();
function listar() {


    $.get("Alumno/listarAlumnos", function (data) {

        crearListado(["Id", "Nombre", "Apellido Paterno", "Apellido Materno",
        "Telefono Padre"], data);

    });
}

$.get("Alumno/listarSexo", function (data) {

    llenarCombo(data, document.getElementById("cboSexo"), true)
   // llenarCombo(data, document.getElementById("cboSexoPopup"), true)
})

var btnBuscar = document.getElementById("btnBuscar");
btnBuscar.onclick = function () {
    var iidsexo=document.getElementById("cboSexo").value;
    //Todo .................................
    if (iidsexo == "") {
        listar();
        voz("Indicar un sexo para buscar");
    }else
    $.get("Alumno/filtrarAlumnoPorSexo/?iidsexo=" + iidsexo, function (data) {
        voz("Buscando todos los alumnos con sexo " +
            document.getElementById("cboSexo").options[document.getElementById("cboSexo").selectedIndex].text);
        crearListado(["Id", "Nombre", "Apellido Paterno", "Apellido Materno",
    "Telefono Padre"], data);
    });
}

var btnLimpiar = document.getElementById("btnLimpiar");
btnLimpiar.onclick = function () {
    listar();
    voz("Listando todos los registros");
}

function llenarCombo(data, control , primerElemento) {
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
        contenido += "<button class='btn btn-danger' onclick='eliminar(" + data[i][llaveId] + ",this)' ><i class='glyphicon glyphicon-trash'></i></button>"
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

function eliminar(id,obj) {
    var nombreAlumno = obj.parentNode.parentNode.childNodes[1].innerHTML + " "
    + obj.parentNode.parentNode.childNodes[2].innerHTML+" "+
         obj.parentNode.parentNode.childNodes[3].innerHTML;
    voz("Desea eliminar el alumno " + nombreAlumno);
    if (confirm("Desea eliminar?") == 1) {

        $.get("Alumno/eliminar/?id=" + id, function (data) {
            if (data == 0) {
                alert("Ocurrio un error");
                voz("Ocurrio un error");
            } else {
                alert("Se elimino correctamente");
                voz("Se elimino correctamente el alumno con nombre "+nombreAlumno);
                listar();
            }


        })
        ;


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

function abrirModal(id) {

    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        controlesObligatorio[i].parentNode.classList.remove("error");
    }

    if (id == 0) {
        borrarDatos();
        document.getElementById("lblTitulo").innerHTML = "Agregar Alumno";
        voz("Agregar Alumno");
    } else {
        document.getElementById("lblTitulo").innerHTML = "Editar Alumno";

        $.get("Alumno/recuperarInformacion/?id=" + id, function (data) {
           
            document.getElementById("txtIdAlumno").value = data[0].IIDALUMNO;
            document.getElementById("txtnombre").value = data[0].NOMBRE;
            document.getElementById("txtapPaterno").value = data[0].APPATERNO;

            document.getElementById("txtapMaterno").value = data[0].APMATERNO;
            //document.getElementById("cboSexoPopup").value = data[0].IIDSEXO;

            var nombreCompleto= data[0].NOMBRE+" "+ data[0].APPATERNO+" "+data[0].APMATERNO;
            voz("Editando el alumno llamado "+nombreCompleto);

            if (data[0].IIDSEXO == 1)
                document.getElementById("rbMasculino").checked = true;
                else
                document.getElementById("rbFemenino").checked = true;


            document.getElementById("dtFechaNacimiento").value = data[0].FECHANAC;

            document.getElementById("txttelefonoPadre").value = data[0].TELEFONOPADRE;
            document.getElementById("txttelefonoMadre").value = data[0].TELEFONOMADRE;
            document.getElementById("txtnumeroHermanos").value = data[0].NUMEROHERMANOS;

            
        });

    }
}

function Agregar() {

    if (datosObligarios() == true) {

        var frm = new FormData();
        var idAlumno=document.getElementById("txtIdAlumno").value;
        var nombre=document.getElementById("txtnombre").value;
        var apPaterno=document.getElementById("txtapPaterno").value;
        var apMaterno=document.getElementById("txtapMaterno").value;

        var nombreCompleto= nombre+" "+apPaterno+" "+apMaterno;
        var fechaNac = document.getElementById("dtFechaNacimiento").value;
        // var idsexo = document.getElementById("cboSexoPopup").value;
        var idsexo;
        if (document.getElementById("rbMasculino").checked == true) {
            idsexo = 1;
        } else {
            idsexo = 2;
        }

        var telefonoPadre = document.getElementById("txttelefonoPadre").value;
        var telefonoMadre = document.getElementById("txttelefonoMadre").value;
        var numeroHermanos = document.getElementById("txtnumeroHermanos").value;


        frm.append("IIDALUMNO", idAlumno);
        frm.append("NOMBRE", nombre);
        frm.append("APPATERNO", apPaterno);
        frm.append("APMATERNO", apMaterno);

        frm.append("FECHANACIMIENTO", fechaNac);
        frm.append("IIDSEXO", idsexo);
        frm.append("TELEFONOPADRE", telefonoPadre);
        frm.append("TELEFONOMADRE", telefonoMadre);
        frm.append("NUMEROHERMANOS", numeroHermanos);

        frm.append("BHABILITADO", 1);
        voz("Desea guardar los cambios");
        if (confirm("Desea guardar los cambios?") == 1) {

            $.ajax({
                type: "POST",
                url: "Alumno/guardarDatos",
                data: frm,
                contentType:false,
                processData:false,
                success: function (data) {

                    if (data == -1) {
                        alert("Ya existe el alumno");
                        voz("Ya existe el alumno llamado "+nombreCompleto);

                    }else  if (data == 0) {
                        alert("Ocurrio un error");
                        voz("Ocurrio un error");
                    } else {
                        alert("Se ejecuto correctamente");
                        voz("Se registro correctamente el alumno con nombre "+nombreCompleto);
                        listar();
                        document.getElementById("btnCancelar").click();
                    }

               }

            })



        }

       





    }


}
