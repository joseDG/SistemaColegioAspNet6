window.onload = function () {

    voz("Bienvenido a la pantalla usuario");
}

listar();


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




function listar() {

    $.get("Usuario/listarUsuarios", function (data) {
        crearListado(["Id Usuario", "Nombre usuario", "Nombre completo persona", "Nombre Rol", "Tipo"], data);

    })


    $.get("Usuario/listarRol", function (data) {
        llenarCombo(data, document.getElementById("cboRol"), true);
    })


    $.get("Usuario/listarPersonas", function (data) {
        llenarCombo(data, document.getElementById("cboPersona"), true);
    })

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

function voz(mensaje) {

    var vozHablar = new SpeechSynthesisUtterance(mensaje);
    window.speechSynthesis.speak(vozHablar);


}



function Agregar() {
    if (datosObligarios() == true) {
        var frm = new FormData();
        var IIDUSUARIO = document.getElementById("txtIdUsuario").value;
        var nombreUsuario = document.getElementById("txtNombreUsuario").value;
        var contra = document.getElementById("txtcontra").value;
        var persona = document.getElementById("cboPersona").value;
        var rol = document.getElementById("cboRol").value;
        var nombrePersona = document.getElementById("cboPersona").options[document.getElementById("cboPersona").selectedIndex].text;
        frm.append("IIDUSUARIO", IIDUSUARIO);
        frm.append("NOMBREUSUARIO", nombreUsuario);
        frm.append("CONTRA", contra);
        frm.append("IID", persona);
        frm.append("IIDROL", rol);
        frm.append("nombreCompleto", nombrePersona);
        frm.append("BHABILITADO", 1);

        alert(nombrePersona);

        if (confirm("¿Desea realmente guardar?") == 1) {
            $.ajax({
                type: "POST",
                url: "Usuario/guardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == 1) {
                        alert("Se guardo correctamente");
                        document.getElementById("btnCancelar").click();
                        voz("Se registro correctamente el usuario " + nombreUsuario);
                        listar();
                    } else {
                        if (data == -1) {
                            alert("Ya existe en la base de datos");
                            voz("Ya existe en la base de datos el usuario " + nombreUsuario);
                        }else
                        alert("Ocurrio un error");

                    }

                }


            });
        }


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

function abrirModal(id) {

    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        controlesObligatorio[i].parentNode.classList.remove("error");
    }

    if (id == 0) {
        document.getElementById("lblTitulo").innerHTML = "Agregar Usuario";
        voz("Agregando un nuevo usuario");
        document.getElementById("lblContra").style.display = "block";
        document.getElementById("txtcontra").style.display = "block";

        document.getElementById("lblPersona").style.display = "block";
        document.getElementById("cboPersona").style.display = "block";


        borrarDatos();
    } else {
        document.getElementById("lblTitulo").innerHTML = "Editar Usuario";

        document.getElementById("txtcontra").value = "1";
        document.getElementById("cboPersona").value = "2";

        document.getElementById("lblContra").style.display = "none";
        document.getElementById("txtcontra").style.display = "none";

        document.getElementById("lblPersona").style.display = "none";
        document.getElementById("cboPersona").style.display = "none";
     

        $.get("Usuario/recuperarInformacion/?idUsuario="+id, function (data) {
            document.getElementById("txtIdUsuario").value = data.IIDUSUARIO;

            document.getElementById("txtNombreUsuario").value = data.NOMBREUSUARIO;

            voz("Editando el  usuario " + data.NOMBREUSUARIO);
            document.getElementById("cboRol").value = data.IIDROL;

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