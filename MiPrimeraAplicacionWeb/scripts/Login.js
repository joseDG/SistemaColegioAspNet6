

function voz(mensaje) {

    var vozHablar = new SpeechSynthesisUtterance(mensaje);
    window.speechSynthesis.speak(vozHablar);


}

var btnIngresar = document.getElementById("btnIngresar");
btnIngresar.onclick = function () {

    var usuario=document.getElementById("txtusuario").value;
    var contra = document.getElementById("txtcontra").value;

    if (usuario == "") {
        alert("Ingrese un usuario");
        return;
    }

    if (contra == "") {
        alert("Ingrese contraseña");
        return;
    }



    $.get("Login/validarUsuario/?usuario=" + usuario + "&contra=" + contra, function (data) {
        //Entro
        if (data == 1) {

            document.location.href = "PaginaPrincipal";

            $.get("PaginaPrincipal/obtenerNombreCompleto", function (data) {

                voz("Bienvenido " + data + " al sistema");

            })



        } else {
            alert("Usuario o contraseña incorrecta");
        }


    })


}


