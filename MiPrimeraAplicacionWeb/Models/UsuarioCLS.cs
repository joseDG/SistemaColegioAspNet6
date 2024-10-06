using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MiPrimeraAplicacionWeb.Models
{
    public class UsuarioCLS
    {
        public int idUsuario { get; set; }
        public string nombrePersona { get; set; }
        public string nombreUsuario { get; set; }
        public string nombreRol { get; set; }
        public string nombreTipoEmpleado { get; set; }
    }
}