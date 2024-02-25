using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace testCrud.Models
{
    public class Customer
    {
        public int id { get; set; }
        [Required(ErrorMessage = "El campo Nombre es obligatorio")]
        public string firstname { get; set; }
        [Required(ErrorMessage = "El campo Apellido es obligatorio")]
        public string lastname { get; set; }
        [Required(ErrorMessage = "El campo Correo es obligatorio")]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "La dirección de correo electrónico no es válida")]
        public string email { get; set; }
        public string phone { get; set; }
        public string address { get; set; }

    }
}