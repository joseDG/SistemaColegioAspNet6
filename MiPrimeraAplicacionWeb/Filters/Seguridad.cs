using MiPrimeraAplicacionWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Filters
{
    public class Seguridad : ActionFilterAttribute
    {

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var usuario = HttpContext.Current.Session["idusuario"];
            List<string> controladores= Variable.controladores.Select(p=>p.ToUpper()).ToList();
            string nombreControlador = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;
            


            if (usuario == null /*|| !controladores.Contains(nombreControlador.ToUpper())*/)
            {
                filterContext.Result = new RedirectResult("~/Login/Index");
            }

            base.OnActionExecuting(filterContext);
        }

    }
}