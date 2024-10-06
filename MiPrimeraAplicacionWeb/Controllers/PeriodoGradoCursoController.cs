using MiPrimeraAplicacionWeb.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class PeriodoGradoCursoController : Controller
    {
        // GET: PeriodoGradoCurso
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult listarPeriodoGradoCurso()
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = from pgc in bd.PeriodoGradoCurso
                        join per in bd.Periodo
                        on pgc.IIDPERIODO equals per.IIDPERIODO
                        join grad in bd.Grado
                        on pgc.IIDGRADO equals grad.IIDGRADO
                        join cur in bd.Curso
                        on pgc.IIDCURSO equals cur.IIDCURSO
                        where pgc.BHABILITADO.Equals(1)
                        select new
                        {
                            pgc.IID,
                            NOMBREPERIODO = per.NOMBRE,
                            NOMBREGRADO = grad.NOMBRE,
                            NOMBRECURSO = cur.NOMBRE
                        };

            return Json(lista, JsonRequestBehavior.AllowGet);


        }

        public JsonResult recuperarInformacion(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = bd.PeriodoGradoCurso.Where(p => p.IID.Equals(id)).
                Select(p => new
                {
                    p.IID,
                    p.IIDPERIODO,
                    p.IIDGRADO,
                    p.IIDCURSO

                });
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult listarPeriodo()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Periodo.Where(p => p.BHABILITADO.Equals(1)).
                Select(p => new
                {
                   IID= p.IIDPERIODO,
                    p.NOMBRE
                });
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult listarGrado()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Grado.Where(p => p.BHABILITADO.Equals(1)).
                Select(p => new
                {
                   IID= p.IIDGRADO,
                    p.NOMBRE
                });
            return Json(lista, JsonRequestBehavior.AllowGet);
        }


        public JsonResult listarCurso()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Curso.Where(p => p.BHABILITADO.Equals(1)).
                Select(p => new
                {
                   IID= p.IIDCURSO,
                    p.NOMBRE
                });
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public int eliminar(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();

            int nregistrosAfectados = 0;
            try
            {
                PeriodoGradoCurso obj = bd.PeriodoGradoCurso.Where(p => p.IID.Equals(id)).First();
                obj.BHABILITADO = 0;
                bd.SubmitChanges();
                nregistrosAfectados = 1;
            }
            catch (Exception ex)
            {
                nregistrosAfectados = 0;
            }

            return nregistrosAfectados;
        }

        public int guardarDatos(PeriodoGradoCurso oPeriodoGradoCurso)
        {
            PruebaDataContext bd = new PruebaDataContext();

            int nregistrosAfectados = 0;
            try
            {
                int id = oPeriodoGradoCurso.IID;
                if (oPeriodoGradoCurso.IID.Equals(0))
                {
                    int nveces = bd.PeriodoGradoCurso.Where(p =>
                          p.IIDPERIODO.Equals(oPeriodoGradoCurso.IIDPERIODO)
                          && p.IIDGRADO.Equals(oPeriodoGradoCurso.IIDGRADO)
                          && p.IIDCURSO.Equals(oPeriodoGradoCurso.IIDCURSO)
                        ).Count();
                    if (nveces == 0)
                    {
                        bd.PeriodoGradoCurso.InsertOnSubmit(oPeriodoGradoCurso);
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }else
                    {
                        nregistrosAfectados = -1;
                    }
                }else
                {
                    int nveces = bd.PeriodoGradoCurso.Where(p =>
                        p.IIDPERIODO.Equals(oPeriodoGradoCurso.IIDPERIODO)
                        && p.IIDGRADO.Equals(oPeriodoGradoCurso.IIDGRADO)
                        && p.IIDCURSO.Equals(oPeriodoGradoCurso.IIDCURSO)
                        && !p.IID.Equals(oPeriodoGradoCurso.IID)
                      ).Count();
                    if (nveces == 0)
                    {
                        PeriodoGradoCurso obj = bd.PeriodoGradoCurso.Where(p => p.IID.Equals(id)).First();
                        obj.IIDCURSO = oPeriodoGradoCurso.IIDCURSO;
                        obj.IIDGRADO = oPeriodoGradoCurso.IIDGRADO;
                        obj.IIDPERIODO = oPeriodoGradoCurso.IIDPERIODO;
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