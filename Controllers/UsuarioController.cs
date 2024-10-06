using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MiPrimeraAplicacionWeb.Models;
using System.Transactions;
using System.Security.Cryptography;
using System.Text;
using MiPrimeraAplicacionWeb.Filters;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class UsuarioController : Controller
    {
        // GET: Usuario
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult listarPersonas()
        {
            List<PersonaCLS> listaPersona = new List<PersonaCLS>();
            //Lista alumnos
            using (PruebaDataContext bd =new PruebaDataContext())
            {
                List<PersonaCLS> listaAlumno = (from item in bd.Alumno
                                   where item.bTieneUsuario == 0
                                   select new PersonaCLS
                                   {
                                       IID = item.IIDALUMNO,
                                       NOMBRE = item.NOMBRE + " " + item.APPATERNO + " " + item.APMATERNO + " (A)"
                                   }).ToList();
                listaPersona.AddRange(listaAlumno);
                var listaDocente = (from item in bd.Docente
                                   where item.bTieneUsuario == 0
                                   select new PersonaCLS
                                   {
                                       IID = item.IIDDOCENTE,
                                       NOMBRE = item.NOMBRE + " " + item.APPATERNO + " " + item.APMATERNO + " (D)"
                                   }).ToList();
                listaPersona.AddRange(listaDocente);
                 listaPersona= listaPersona.OrderBy(p => p.NOMBRE).ToList();
                return Json(listaPersona, JsonRequestBehavior.AllowGet);

            }


            //lista docentes


        }

        public JsonResult listarUsuarios()
        {
            List<UsuarioCLS> listaUsuario = new List<UsuarioCLS>();
            using (PruebaDataContext bd=new PruebaDataContext())
            {
                List<UsuarioCLS> listaAlumno = (from usuario in bd.Usuario
                                                join alumno in bd.Alumno
                                                on usuario.IID equals alumno.IIDALUMNO
                                                join rol in bd.Rol
                                                on usuario.IIDROL equals rol.IIDROL
                                                where usuario.BHABILITADO == 1 && usuario.TIPOUSUARIO == 'A'
                                                select new UsuarioCLS
                                                {
                                                    idUsuario = usuario.IIDUSUARIO,
                                                    nombrePersona = alumno.NOMBRE + " " + alumno.APPATERNO + " " + alumno.APMATERNO,
                                                    nombreUsuario = usuario.NOMBREUSUARIO,
                                                    nombreRol = rol.NOMBRE,
                                                    nombreTipoEmpleado = "ALUMNO"
                                                }).ToList();
                listaUsuario.AddRange(listaAlumno);
                List<UsuarioCLS> listaDocente = (from usuario in bd.Usuario
                                                join docente in bd.Docente
                                                on usuario.IID equals docente.IIDDOCENTE
                                                join rol in bd.Rol
                                                on usuario.IIDROL equals rol.IIDROL
                                                where usuario.BHABILITADO == 1 && usuario.TIPOUSUARIO == 'D'
                                                select new UsuarioCLS
                                                {
                                                    idUsuario = usuario.IIDUSUARIO,
                                                    nombrePersona = docente.NOMBRE + " " + docente.APPATERNO + " " + docente.APMATERNO,
                                                    nombreUsuario = usuario.NOMBREUSUARIO,
                                                    nombreRol = rol.NOMBRE,
                                                    nombreTipoEmpleado = "DOCENTE"
                                                }).ToList();
                listaUsuario.AddRange(listaDocente);

                listaUsuario= listaUsuario.OrderBy(p => p.idUsuario).ToList();


            }
            return Json(listaUsuario, JsonRequestBehavior.AllowGet);
        }

        public JsonResult recuperarInformacion(int idUsuario)
        {

            using(PruebaDataContext bd=new PruebaDataContext())
            {

                var oUsuario = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario).
                    Select(
                    p => new
                    {
                        p.IIDUSUARIO,
                        p.NOMBREUSUARIO,
                        p.IIDROL
                    }

                    ).First();

                return Json(oUsuario, JsonRequestBehavior.AllowGet);

            }


        }

        public int guardarDatos(Usuario oUsuario,string nombreCompleto)
        {
            int rpta = 0;
            try
            {
               
                int idUsuario = oUsuario.IIDUSUARIO;
                using (PruebaDataContext bd = new PruebaDataContext())
                {

                    using (var transaccion = new TransactionScope())
                    {

                        if (idUsuario == 0)
                        {
                            //vALIDAR QUE NO EXISTA EN LA BD
                            int nveces = bd.Usuario.Where(p => p.NOMBREUSUARIO.ToUpper() == oUsuario.NOMBREUSUARIO.ToUpper()).Count();
                            if(nveces
                                == 1)
                            {
                                rpta = -1;
                                return rpta;
                            }

                            string clave = oUsuario.CONTRA;
                            SHA256Managed sha = new SHA256Managed();
                            byte[] dataNoCifrada = Encoding.Default.GetBytes(clave);
                            byte[] dataCifrada = sha.ComputeHash(dataNoCifrada);
                            //Contraseña
                            oUsuario.CONTRA = BitConverter.ToString(dataCifrada).Replace("-", "");
                            char tipo = char.Parse(nombreCompleto.Substring(nombreCompleto.Length - 2, 1));
                            oUsuario.TIPOUSUARIO = tipo;



                            bd.Usuario.InsertOnSubmit(oUsuario);

                            if (tipo.Equals('A'))
                            {
                                Alumno oAlumno = bd.Alumno.Where(p => p.IIDALUMNO == oUsuario.IID).First();
                                oAlumno.bTieneUsuario = 1;
                            }
                            else
                            {
                                Docente oDocente = bd.Docente.Where(p => p.IIDDOCENTE == oUsuario.IID).First();
                                oDocente.bTieneUsuario = 1;
                            }
                            bd.SubmitChanges();

                            transaccion.Complete();
                            rpta = 1;

                        }else
                        {

                            int nveces = bd.Usuario.Where(p => p.NOMBREUSUARIO.ToUpper() == oUsuario.NOMBREUSUARIO.ToUpper()
                            && p.IIDUSUARIO!= oUsuario.IIDUSUARIO).Count();
                            if (nveces
                                == 1)
                            {
                                rpta = -1;
                                return rpta;
                            }

                            Usuario ousuarioCLS = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario).First();
                            ousuarioCLS.IIDROL = oUsuario.IIDROL;
                            ousuarioCLS.NOMBREUSUARIO = oUsuario.NOMBREUSUARIO;
                            bd.SubmitChanges();
                            transaccion.Complete();
                            rpta = 1;
                        }





                    }



                }
            }catch(Exception ex)
            {
                rpta = 0;

            }



            return rpta;
        }

        public JsonResult listarRol()
        {
            using(PruebaDataContext bd=new PruebaDataContext())
            {
                var lista = bd.Rol.Where(p => p.BHABILITADO == 1)
                    .Select(x => new
                    {
                       IID= x.IIDROL,
                        x.NOMBRE
                    }

                    ).ToList();

                return Json(lista, JsonRequestBehavior.AllowGet);
            }
        }

        //public JsonResult listarPersona()
        //{

        //    using(PruebaDataContext bd=new PruebaDataContext())
        //    {




        //    }


        //}


    }
}