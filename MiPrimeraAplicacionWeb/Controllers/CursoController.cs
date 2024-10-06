using MiPrimeraAplicacionWeb.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class CursoController : Controller
    {
        // GET: Curso
        public ActionResult Index()
        {
            return View();
        }

        public string mensaje()
        {
            return "Bienvenido al curso ASP.NET MVC";
        }

        public JsonResult recuperarDatos(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Curso.Where(p => p.BHABILITADO.Equals(1)
            && p.IIDCURSO.Equals(id))
                  .Select(p => new { p.IIDCURSO, p.NOMBRE, p.DESCRIPCION }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public string saludo(string nombre)
        {
            return "Hola como estas " + nombre;
        }

        public string nombreCompleto(string nombre , string apellido)
        {
            return "Hola como estas " + nombre + " " + apellido;
        }




        public JsonResult listarCurso()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Curso.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new { p.IIDCURSO, p.NOMBRE, p.DESCRIPCION }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult buscarCursoPorNombre(string nombre)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Curso.Where(p => p.BHABILITADO.Equals(1) && 
                p.NOMBRE.Contains(nombre))
                .Select(p => new { p.IIDCURSO, p.NOMBRE, p.DESCRIPCION }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public int guardarDatos(Curso ocurso)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                //Nuevo
                if (ocurso.IIDCURSO == 0)
                {
                    int nveces = bd.Curso.Where(p => p.NOMBRE.Equals(ocurso.NOMBRE)).Count();
                    if (nveces == 0)
                    {
                        bd.Curso.InsertOnSubmit(ocurso);
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }else
                    {
                        nregistrosAfectados = -1;
                    }
                }
                //editar
                else
                {
                    int nveces = bd.Curso.Where(p => p.NOMBRE.Equals(ocurso.NOMBRE) && !p.IIDCURSO.Equals(ocurso.IIDCURSO)).Count();
                    if (nveces == 0)
                    {
                        Curso cursoSel = bd.Curso.Where(p => p.IIDCURSO.Equals(ocurso.IIDCURSO)).First();
                        cursoSel.NOMBRE = ocurso.NOMBRE;
                        cursoSel.DESCRIPCION = ocurso.DESCRIPCION;
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }else
                    {
                        nregistrosAfectados = -1;

                    }

                }
            }
            catch(Exception ex)
            {
                nregistrosAfectados = 0;

            }


            return nregistrosAfectados;

        }


        public int eliminar(Curso ocurso)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                Curso cursoSel = bd.Curso.Where(p => p.IIDCURSO.Equals(ocurso.IIDCURSO)).First();
                cursoSel.BHABILITADO = 0;
                bd.SubmitChanges();
                nregistrosAfectados = 1;
            }
            catch (Exception ex)
            {
                nregistrosAfectados = 0;
            }


            return nregistrosAfectados;

        }



    }
}