using MiPrimeraAplicacionWeb.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class AlumnoController : Controller
    {
        // GET: Alumno
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult listarSexo()
        {

            var lista = bd.Sexo.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new { IID= p.IIDSEXO, p.NOMBRE });

            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        PruebaDataContext bd = new PruebaDataContext();

        public JsonResult listarAlumnos()
        {
            var lista = (bd.Alumno.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new
                {
                    p.IIDALUMNO,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
                    p.TELEFONOPADRE
                })).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult filtrarAlumnoPorSexo(int iidsexo)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista= bd.Alumno.Where(p => p.BHABILITADO.Equals(1)
            && p.IIDSEXO.Equals(iidsexo)).Select(p => new
            {
                p.IIDALUMNO,
                p.NOMBRE,
                p.APPATERNO,
                p.APMATERNO,
                p.TELEFONOPADRE
            }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public int eliminar(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
           Alumno oAlumno=     bd.Alumno.Where(p => p.IIDALUMNO.Equals(id)).First();
                oAlumno.BHABILITADO = 0;
                bd.SubmitChanges();
                nregistrosAfectados = 1;
            }
            catch(Exception ex)
            {
                nregistrosAfectados = 0;
            }
            return nregistrosAfectados;
        }

        public JsonResult recuperarInformacion(int id)
        {

            PruebaDataContext bd = new PruebaDataContext();
           var consulta= bd.Alumno.Where(p => p.IIDALUMNO.Equals(id)).
                Select(
                p => new
                {
                    p.IIDALUMNO,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
                    FECHANAC=  ((DateTime) p.FECHANACIMIENTO).ToShortDateString(),
                    p.IIDSEXO,
                    p.NUMEROHERMANOS,
                    p.TELEFONOMADRE,
                    p.TELEFONOPADRE

                }

                );

            return Json(consulta, JsonRequestBehavior.AllowGet);
        }

        public int guardarDatos(Alumno oAlumno)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;

            try
            {
                int idAlumno = oAlumno.IIDALUMNO;
                if (idAlumno == 0)
                {
                    int nveces = bd.Alumno.Where(p => p.NOMBRE.Equals(oAlumno.NOMBRE)
                     && p.APPATERNO.Equals(oAlumno.APPATERNO) && p.APMATERNO.Equals(oAlumno.APMATERNO)).Count();
                    if (nveces == 0)
                    {
                        oAlumno.IIDTIPOUSUARIO = 'A';
                        oAlumno.bTieneUsuario = 0;
                        //Nuevo(Agregar)
                        bd.Alumno.InsertOnSubmit(oAlumno);
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }else
                    {
                        nregistrosAfectados = -1;
                    }

                }else
                {
                    int nveces = bd.Alumno.Where(p => p.NOMBRE.Equals(oAlumno.NOMBRE)
                   && p.APPATERNO.Equals(oAlumno.APPATERNO) && p.APMATERNO.Equals(oAlumno.APMATERNO)
                   && !p.IIDALUMNO.Equals(oAlumno.IIDALUMNO)).Count();
                    //Actualizar
                    if (nveces == 0)
                    {
                        Alumno obj = bd.Alumno.Where(p => p.IIDALUMNO.Equals(idAlumno)).First();
                        obj.NOMBRE = oAlumno.NOMBRE;
                        obj.APPATERNO = oAlumno.APPATERNO;
                        obj.APMATERNO = oAlumno.APMATERNO;
                        obj.IIDSEXO = oAlumno.IIDSEXO;
                        obj.TELEFONOMADRE = oAlumno.TELEFONOMADRE;
                        obj.TELEFONOPADRE = oAlumno.TELEFONOPADRE;
                        obj.FECHANACIMIENTO = oAlumno.FECHANACIMIENTO;
                        obj.NUMEROHERMANOS = oAlumno.NUMEROHERMANOS;
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }else
                    {
                        nregistrosAfectados = -1;
                    }
                }


            }catch(Exception ex)
            {
                nregistrosAfectados = 0;
            }
            return nregistrosAfectados;

        }

    }
}