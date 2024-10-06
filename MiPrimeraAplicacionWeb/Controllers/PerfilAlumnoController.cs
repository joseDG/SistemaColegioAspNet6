using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class PerfilAlumnoController : Controller
    {
        // GET: PerfilAlumno
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult listarComboPeriodo()
        {
            PruebaDataContext bd = new PruebaDataContext();
            int idUsuario = (int)Session["idusuario"];
            Usuario oUsuario = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario && p.TIPOUSUARIO == 'A').First();
            //Tenemos el Id Alumno
            int idAlumno = (int)oUsuario.IID;

            var listaPeriodo = (from matricula in bd.Matricula
                                join periodo in bd.Periodo
                                on matricula.IIDPERIODO equals periodo.IIDPERIODO
                                where matricula.BHABILITADO == 1
                                && matricula.IIDALUMNO== idAlumno
                                select new
                                {
                                 IID=   periodo.IIDPERIODO,
                                    periodo.NOMBRE
                                }).Distinct();
            return Json(listaPeriodo, JsonRequestBehavior.AllowGet);

        }


        public JsonResult listarCursosPorPeriodo(int iidPeriodo)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int idUsuario = (int)Session["idusuario"];
            Usuario oUsuario = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario && p.TIPOUSUARIO == 'A').First();
            //Tenemos el Id Alumno
            int idAlumno = (int)oUsuario.IID;

            var listaPeriodosMatriculados = (from matricula in bd.Matricula
                                             join detalleMatricula in bd.DetalleMatricula
                                              on matricula.IIDMATRICULA equals
                                              detalleMatricula.IIDMATRICULA
                                             join curso in bd.Curso
                                             on detalleMatricula.IIDCURSO equals
                                             curso.IIDCURSO
                                             where matricula.IIDALUMNO == idAlumno
                                             && matricula.IIDPERIODO == iidPeriodo
                                             && detalleMatricula.bhabilitado == 1
                                             select new
                                             {
                                                 matricula.IIDMATRICULA,
                                                 curso.NOMBRE,
                                                 detalleMatricula.NOTA1,
                                                 detalleMatricula.NOTA2,
                                                 detalleMatricula.NOTA3,
                                                 detalleMatricula.NOTA4,
                                                 detalleMatricula.PROMEDIO
                                             }
                                                 ).ToList();
            return Json(listaPeriodosMatriculados, JsonRequestBehavior.AllowGet
                );

        }


    }
}