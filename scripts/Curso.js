window.onload = function () {

    voz("Bienvenido a la pantalla Curso");
}


listar();
function listar() {
    $.get("Curso/listarCurso", function (data) {

        crearListado(["Id Curso", "Nombre Curso", "Descripcion"], data);
    }
     );
}

function voz(mensaje) {

    var vozHablar = new SpeechSynthesisUtterance(mensaje);
    window.speechSynthesis.speak(vozHablar);


}


var btnBuscar = document.getElementById("btnBuscar");
btnBuscar.onclick = function () {
    //Aqui
    var nombre = document.getElementById("txtnombre").value;
    $.get("Curso/buscarCursoPorNombre/?nombre=" + nombre, function (data) {
        crearListado(["Id Curso", "Nombre Curso", "Descripcion"], data);


        voz("Buscando en la base de datos los registros que contengan la palabra " + nombre);

    });
}

var btnLimpiar = document.getElementById("btnLimpiar");
btnLimpiar.onclick = function () {
    //Aqui
    $.get("Curso/listarCurso", function (data) {

        crearListado(["Id Curso", "Nombre Curso", "Descripcion"],data);
    }
 );
    document.getElementById("txtnombre").value = "";
    voz("Borrando los filtros y listando todo");
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
        contenido+="</td>"

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

function eliminar(id, obj) {
    var nombreCurso=obj.parentNode.parentNode.childNodes[1].innerHTML;
    var frm = new FormData();
    voz("Desea eliminar realmente el curso " + nombreCurso);
    frm.append("IIDCURSO", id);
    if (confirm("¿Desea realmente guardar?") == 1) {
        $.ajax({
            type: "POST",
            url: "Curso/eliminar",
            data: frm,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data == 1) {
                    listar();
                    alert("Se ejecuto correctamente");
                    voz("Se elimino el curso " + nombreCurso);
                    document.getElementById("btnCancelar").click();
                } else {
                    if (data == -1) {
                        alert("Ya existe el curso");

                    } else {
                        alert("Ocurrio un error;")
                    }
                }

            }


        });
    }
}




function abrirModal(id) {

    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        controlesObligatorio[i].parentNode.classList.remove("error");
    }

    if (id == 0) {
        borrarDatos();
        document.getElementById("lblTitulo").innerHTML = "Agregar Curso";
        voz("Agregar Curso");
    } else {
        document.getElementById("lblTitulo").innerHTML = "Editar Curso";
      
        $.get("Curso/recuperarDatos/?id=" + id, function (data) {
            document.getElementById("txtIdCurso").value = data[0].IIDCURSO;
            document.getElementById("txtNombre").value = data[0].NOMBRE;
            voz("Editar Curso" + data[0].NOMBRE);
            document.getElementById("txtDescripcion").value = data[0].DESCRIPCION;

        });

    }
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
        var id = document.getElementById("txtIdCurso").value;
        var nombre = document.getElementById("txtNombre").value;
        var descripcion = document.getElementById("txtDescripcion").value;
        frm.append("IIDCURSO", id);
        frm.append("NOMBRE", nombre);
        frm.append("DESCRIPCION", descripcion);
        frm.append("BHABILITADO", 1);
        if (confirm("¿Desea realmente guardar?") == 1) {
            $.ajax({
                type: "POST",
                url: "Curso/guardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == 1) {
                        listar();
                        alert("Se ejecuto correctamente");
                        //Logica para la voz
                        if (id == 0) {
                            voz("Se registro correctamente el curso llamado " + nombre);
                        } else {
                            voz("Se edito correctamente el curso llamado " + nombre);
                        }

                        document.getElementById("btnCancelar").click();
                    } else {
                        if (data == -1) {
                            alert("Ya existe el curso;")

                        }else
                        alert("Ocurrio un error;")
                    }

                }


            });
        }


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