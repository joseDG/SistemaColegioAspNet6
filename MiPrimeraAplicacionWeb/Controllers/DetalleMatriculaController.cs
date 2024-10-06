using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MiPrimeraAplicacionWeb.Models;
namespace MiPrimeraAplicacionWeb.Controllers
{
    public class DetalleMatriculaController : Controller
    {
        // GET: DetalleMatricula
        public ActionResult Index()
        {
            return View();
        }
        PruebaDataContext bd = new PruebaDataContext();
        public JsonResult listarPeriodos()
        {
            int iid = (int)Session["iid"];

            var periodos = (from matricula in bd.Matricula
                            join periodo in bd.Periodo
                            on matricula.IIDPERIODO equals periodo.IIDPERIODO
                            where matricula.BHABILITADO == 1
                            && matricula.IIDALUMNO == iid
                            select new ComboCLS
                            {
                                IID = periodo.IIDPERIODO,
                                NOMBRE = periodo.NOMBRE

                            }
                          ).ToList();
            return Json(periodos, JsonRequestBehavior.AllowGet);


        }

    }
}