using MiPrimeraAplicacionWeb.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class PeriodoController : Controller
    {
        // GET: Periodo
        public ActionResult Index()
        {
                return View();
        }

        public JsonResult listarPeriodo()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (bd.Periodo.Where(p => p.BHABILITADO.Equals(1))
                  .Select(p => new
                  {
                      p.IIDPERIODO,
                      p.NOMBRE,
                      FECHAINICIO = ((DateTime)p.FECHAINICIO).ToShortDateString(),
                      FECHAFIN = ((DateTime)p.FECHAFIN).ToShortDateString()
                  })).ToList();

            return Json(lista, JsonRequestBehavior.AllowGet);

        }


        public JsonResult buscarPeriodoPorNombre(string nombrePeriodo)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (bd.Periodo.Where(p => p.BHABILITADO.Equals(1)
            && p.NOMBRE.Contains(nombrePeriodo))
                  .Select(p => new
                  {
                      p.IIDPERIODO,
                      p.NOMBRE,
                      FECHAINICIO = ((DateTime)p.FECHAINICIO).ToShortDateString(),
                      FECHAFIN = ((DateTime)p.FECHAFIN).ToShortDateString()
                  })).ToList();

            return Json(lista, JsonRequestBehavior.AllowGet);

        }

        public int eliminar(Periodo oPeriodo)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                int idperiodo = oPeriodo.IIDPERIODO;
                Periodo obj = bd.Periodo.Where(p => p.IIDPERIODO.Equals(idperiodo)).First();
                obj.BHABILITADO = 0;
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
            var lista = bd.Periodo.Where(p => p.IIDPERIODO.Equals(id)).Select(
                p => new
                {
                    p.IIDPERIODO,
                    p.NOMBRE,
                   FECHAINICIOCADENA=  ((DateTime)p.FECHAINICIO).ToShortDateString(),
                    FECHAFINCADENA=((DateTime)p.FECHAFIN).ToShortDateString()

                }
                );

            return Json(lista, JsonRequestBehavior.AllowGet);
        }
       

        public int guardarDatos(Periodo oPeriodo)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                int idPeriodo = oPeriodo.IIDPERIODO;
                if (idPeriodo >= 1)
                {
                    int nveces = bd.Periodo.Where(p => p.NOMBRE.Equals(oPeriodo.NOMBRE) && !p.IIDPERIODO.Equals(idPeriodo)).Count();
                    if (nveces == 0)
                    {
                        Periodo obj = bd.Periodo.Where(p => p.IIDPERIODO.Equals(idPeriodo)).First();
                        obj.NOMBRE = oPeriodo.NOMBRE;
                        obj.FECHAINICIO = oPeriodo.FECHAINICIO;
                        obj.FECHAFIN = oPeriodo.FECHAFIN;
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }else
                    {
                        nregistrosAfectados = -1;

                    }

                }
                else
                {
                    //Nuevo
                 int nveces=   bd.Periodo.Where(p => p.NOMBRE.Equals(oPeriodo.NOMBRE)).Count();

                    if (nveces == 0)
                    {
                        bd.Periodo.InsertOnSubmit(oPeriodo);
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }else
                    {
                        //Ya existe en la base de datos
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