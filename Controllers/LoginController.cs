using MiPrimeraAplicacionWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        public int validarUsuario(string usuario , string contra)
        {
            //error
            int rpta = 0;
            try
            {

                using (PruebaDataContext bd = new PruebaDataContext())
                {
                    SHA256Managed sha = new SHA256Managed();
                    byte[] dataNoCifrada = Encoding.Default.GetBytes(contra);
                    byte[] dataCifrada = sha.ComputeHash(dataNoCifrada);
                    //Contraseña
                   string contraCifrada = BitConverter.ToString(dataCifrada).Replace("-", "");

                    rpta = bd.Usuario.Where(p => p.NOMBREUSUARIO == usuario && p.CONTRA == contraCifrada).Count();
                    if (rpta == 1)
                    {
                     Usuario oUsuario   = bd.Usuario.Where(p => p.NOMBREUSUARIO == usuario && p.CONTRA == contraCifrada).First();
                       int idUsuario = oUsuario.IIDUSUARIO;
                       Session["idusuario"] = idUsuario;
                       Session["iid"] = oUsuario.IID;
                        var roles = from usu in bd.Usuario
                                    join rol in bd.Rol
                                    on usu.IIDROL equals rol.IIDROL
                                    join rolpagina in bd.RolPagina
                                    on rol.IIDROL equals rolpagina.IIDROL
                                    join pagina in bd.Pagina
                                    on rolpagina.IIDPAGINA equals pagina.IIDPAGINA
                                    where usu.BHABILITADO == 1 && rolpagina.BHABILITADO == 1
                                    && usu.IIDUSUARIO == idUsuario
                                    select new
                                    {
                                        accion = pagina.ACCION,
                                        controlador = pagina.CONTROLADOR,
                                        mensaje = pagina.MENSAJE
                                    };
                        //Inicializar
                        Variable.acciones = new List<string>();
                        Variable.controladores = new List<string>();
                        Variable.mensaje = new List<string>();
                        //Llenar los valores
                        foreach(var item in roles)
                        {
                            Variable.acciones.Add(item.accion);
                            Variable.controladores.Add(item.controlador);
                            Variable.mensaje.Add(item.mensaje);

                        }

                    }
                }

            }
            catch(Exception ex)
            {
                rpta = 0;
            }
            return rpta;


        }

        public ActionResult Cerrar()
        {
            return RedirectToAction("Index");
        }


    }
}