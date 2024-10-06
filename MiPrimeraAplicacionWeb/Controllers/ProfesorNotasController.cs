using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class ProfesorNotasController : Controller
    {
        // GET: ProfesorNotas
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult listarPeriodos()
        {
            PruebaDataContext bd = new PruebaDataContext();
            int idUsuario = (int)Session["idusuario"];
            Usuario oUsuario = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario && p.TIPOUSUARIO == 'D').First();
            //Tenemos el Id Alumno
            int idDocente = (int)oUsuario.IID;
            //var listaPeriodos=   bd.GradoSeccionAula.Where(p => p.IIDDOCENTE == idDocente && p.BHABILITADO==1).
            //       Select(p=>new
            //       {

            //       }).Distinct();
            var listaPeriodos = (from gradoSeccionAula in bd.GradoSeccionAula
                                 join periodo in bd.Periodo
                                 on gradoSeccionAula.IIDPERIODO equals periodo.IIDPERIODO
                                 where gradoSeccionAula.IIDDOCENTE == idDocente &&
                                 gradoSeccionAula.BHABILITADO == 1
                                 select new
                                 {
                                   IID=  periodo.IIDPERIODO,
                                     periodo.NOMBRE
                                 }).Distinct();

            return Json(listaPeriodos, JsonRequestBehavior.AllowGet);
        }

        public JsonResult listarGrados(int iidPeriodo)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int idUsuario = (int)Session["idusuario"];
            Usuario oUsuario = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario && p.TIPOUSUARIO == 'D').First();
            //Tenemos el Id Alumno
            int idDocente = (int)oUsuario.IID;

            var listaGrados = (from gradoSeccionAula in bd.GradoSeccionAula
                               join gradoSeccion in bd.GradoSeccion
                               on gradoSeccionAula.IIDGRADOSECCION
                               equals gradoSeccion.IID
                               join grado in bd.Grado
                                on gradoSeccion.IIDGRADO equals grado.IIDGRADO
                               where gradoSeccionAula.BHABILITADO == 1
                               && gradoSeccionAula.IIDDOCENTE == idDocente
                               && gradoSeccionAula.IIDPERIODO == iidPeriodo
                               select new
                               {
                                   IID = grado.IIDGRADO,
                                   grado.NOMBRE
                               }).Distinct();
            return Json(listaGrados, JsonRequestBehavior.AllowGet);
        }

        public JsonResult listarCursos(int iidPeriodo,int iidGrado)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int idUsuario = (int)Session["idusuario"];
            Usuario oUsuario = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario && p.TIPOUSUARIO == 'D').First();
            //Tenemos el Id Alumno
            int idDocente = (int)oUsuario.IID;

            var listaCurso = (from gradoSeccionAula in bd.GradoSeccionAula
                              join gradoSeccion in bd.GradoSeccion
                              on gradoSeccionAula.IIDGRADOSECCION
                              equals gradoSeccion.IID
                              join grado in bd.Grado
                              on gradoSeccion.IIDGRADO equals grado.IIDGRADO
                              join curso in bd.Curso
                              on gradoSeccionAula.IIDCURSO equals curso.IIDCURSO
                              where gradoSeccionAula.BHABILITADO == 1
                                && gradoSeccionAula.IIDDOCENTE == idDocente
                                && gradoSeccionAula.IIDPERIODO == iidPeriodo
                                && grado.IIDGRADO == iidGrado
                              select new
                              {
                                IID=  curso.IIDCURSO,
                                  curso.NOMBRE
                              }).ToList();
            return Json(listaCurso, JsonRequestBehavior.AllowGet);
        }


        public JsonResult listarAlumnos(int iidPeriodo , int iidGrado , int iidCurso)
        {
            PruebaDataContext bd = new PruebaDataContext();

            var listaAlumnos = (from matricula in bd.Matricula
                                join detalleMatricula in bd.DetalleMatricula
                                on matricula.IIDMATRICULA equals detalleMatricula.IIDMATRICULA
                                join alumno in bd.Alumno
                                on matricula.IIDALUMNO equals alumno.IIDALUMNO
                                where matricula.IIDPERIODO == iidPeriodo
                                && matricula.IIDGRADO == iidGrado
                                && detalleMatricula.IIDCURSO == iidCurso
                                select new
                                {
                                    matricula.IIDALUMNO,
                                    NOMBRECOMPLETO = alumno.NOMBRE + " " + alumno.APPATERNO + " " + alumno.APMATERNO,
                                    detalleMatricula.NOTA1,
                                    detalleMatricula.NOTA2,
                                    detalleMatricula.NOTA3,
                                    detalleMatricula.NOTA4,
                                    detalleMatricula.PROMEDIO,
                                    detalleMatricula.IIDMATRICULA,
                                    detalleMatricula.IIDCURSO

                                }).Distinct();
            return Json(listaAlumnos, JsonRequestBehavior.AllowGet);



        }


        public decimal ingresarNota(DetalleMatricula oDetalleMatriculaForm)
        {
            decimal rpta = 0;
            try
            {
                PruebaDataContext bd = new PruebaDataContext();
                DetalleMatricula oDetalleMatricula = new DetalleMatricula();
                oDetalleMatricula = bd.DetalleMatricula.Where(p => p.IIDMATRICULA == oDetalleMatriculaForm.IIDMATRICULA
                 && p.IIDCURSO == oDetalleMatriculaForm.IIDCURSO).First();
                oDetalleMatricula.NOTA1 = oDetalleMatriculaForm.NOTA1;
                oDetalleMatricula.NOTA2 = oDetalleMatriculaForm.NOTA2;
                oDetalleMatricula.NOTA3 = oDetalleMatriculaForm.NOTA3;
                oDetalleMatricula.NOTA4 = oDetalleMatriculaForm.NOTA4;
                oDetalleMatricula.PROMEDIO = Decimal.Divide((decimal) (oDetalleMatriculaForm.NOTA1 +
                    oDetalleMatriculaForm.NOTA2 + oDetalleMatriculaForm.NOTA3 +
                    oDetalleMatriculaForm.NOTA4) , 4);
                // 21/4 = 5
                bd.SubmitChanges();
                rpta = (decimal)oDetalleMatricula.PROMEDIO;

            }
            catch (Exception ex)
            {
                rpta = 0;

            }
            return rpta;

        }




    }
}