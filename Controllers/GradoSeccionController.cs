using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class GradoSeccionController : Controller
    {
        // GET: GradoSeccion
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult listarGradoSeccion()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (from gradosec in bd.GradoSeccion
                        join sec in bd.Seccion
                        on gradosec.IIDSECCION equals sec.IIDSECCION
                        join grad in bd.Grado
                        on gradosec.IIDGRADO equals grad.IIDGRADO
                        where gradosec.BHABILITADO.Equals(1)
                         select new
                        {
                            gradosec.IID,
                           NOMBREGRADO= grad.NOMBRE,
                           NOMBRESECCION= sec.NOMBRE
                        }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult recuperarInformacion(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();

            var consulta = bd.GradoSeccion.Where(p => p.IID.Equals(id)).
                Select(
                p => new
                {
                    p.IID,
                    p.IIDGRADO,
                    p.IIDSECCION
                }

                );

            return Json(consulta, JsonRequestBehavior.AllowGet);
        }

        public int guardarDatos(GradoSeccion oGradoSeccion)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistradosAfectados = 0;
            try
            {
                int id = oGradoSeccion.IID;
                if (id == 0)
                {
                    int nveces = bd.GradoSeccion.Where(p => p.IIDGRADO.Equals(oGradoSeccion.IIDGRADO)
                      && p.IIDSECCION.Equals(oGradoSeccion.IIDSECCION)).Count();
                    if (nveces == 0)
                    {
                        bd.GradoSeccion.InsertOnSubmit(oGradoSeccion);
                        bd.SubmitChanges();
                        nregistradosAfectados = 1;
                    }else
                    {
                        nregistradosAfectados = -1;
                    }
                }else
                {
                    int nveces = bd.GradoSeccion.Where(p => p.IIDGRADO.Equals(oGradoSeccion.IIDGRADO)
                     && p.IIDSECCION.Equals(oGradoSeccion.IIDSECCION) && !p.IID.Equals(oGradoSeccion.IID)).Count();
                    if (nveces == 0)
                    {
                        GradoSeccion obj = bd.GradoSeccion.Where(p => p.IID.Equals(id)).First();
                        obj.IIDGRADO = oGradoSeccion.IIDGRADO;
                        obj.IIDSECCION = oGradoSeccion.IIDSECCION;
                        bd.SubmitChanges();
                        nregistradosAfectados = 1;
                    }else
                    {
                        nregistradosAfectados = -1;
                    }
                }

            }catch(Exception ex)
            {
                nregistradosAfectados = 0;
            }
            return nregistradosAfectados;
        }

        public JsonResult listarSeccion()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Seccion.Where(p => p.BHABILITADO.Equals(1)).
                Select(
                p => new
                {
                   IID= p.IIDSECCION,
                    p.NOMBRE
                }

                );
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult listarGrado()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Grado.Where(p => p.BHABILITADO.Equals(1)).
              Select(
              p => new
              {
                IID=  p.IIDGRADO,
                  p.NOMBRE
              }

              );
            return Json(lista, JsonRequestBehavior.AllowGet);
        }


        public int eliminar(int id)
        {
            int nregistrosAfectados = 0;
            PruebaDataContext bd = new PruebaDataContext();

            try
            {
                GradoSeccion obj = bd.GradoSeccion.Where(p => p.IID.Equals(id)).First();
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


    }
}