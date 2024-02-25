using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using testCrud.Models;
using System.Data.SqlClient;
using System.Data;

namespace testCrud.Controllers
{
    public class HomeController : Controller
    {
        private static string conexion = ConfigurationManager.ConnectionStrings["cadena"].ToString();
        private static List<Customer> olista = new List<Customer>();
        public ActionResult Index()
        {
            olista = new List<Customer>();
            using (SqlConnection oconexion = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM  customer", oconexion);
                cmd.CommandType = CommandType.Text;
                oconexion.Open();
                using (SqlDataReader dr = cmd.ExecuteReader()) 
                {
                    while (dr.Read())
                    {
                        Customer customer = new Customer();
                        customer.id = Convert.ToInt32(dr["id"]);
                        customer.firstname = dr["firstname"].ToString();
                        customer.lastname = dr["lastname"].ToString();
                        customer.email = dr["email"].ToString();
                        customer.phone = dr["phone"].ToString();
                        customer.address = dr["address"].ToString();
                        olista.Add(customer);
                    }
                }
            }
                return View(olista);
        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Kuasniski Fabricio";

            return View();
        }
        public ActionResult getCustomer(int? id)
        {
            if(id == null)
            {
                return RedirectToAction("Index", "Home");
            }
            Customer customer = olista.Where(x => x.id == id).FirstOrDefault();
            return Json(customer, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult SaveNew(Customer customer)
        {
            if (customer.phone == null)
            {
                customer.phone = "";
            }
            if (customer.address == null)
            {
                customer.address = "";
            }
            using (SqlConnection oconexion = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_Registrar", oconexion);
                cmd.Parameters.AddWithValue("firstname", customer.firstname);
                cmd.Parameters.AddWithValue("lastname", customer.lastname);
                cmd.Parameters.AddWithValue("phone", customer.phone);
                cmd.Parameters.AddWithValue("email", customer.email);
                cmd.Parameters.AddWithValue("address", customer.address);
                cmd.CommandType = CommandType.StoredProcedure;
                oconexion.Open();
                cmd.ExecuteNonQuery();
            }
            return RedirectToAction("Index", "Home");
        }
        [HttpPost]
        public ActionResult SaveEdit(Customer customer)
        {
            if (customer.phone == null)
            {
                customer.phone = "";
            }
            if (customer.address == null)
            {
                customer.address = "";
            }
            using (SqlConnection oconexion = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_Editar", oconexion);
                cmd.Parameters.AddWithValue("id", customer.id);
                cmd.Parameters.AddWithValue("firstname", customer.firstname);
                cmd.Parameters.AddWithValue("lastname", customer.lastname);
                cmd.Parameters.AddWithValue("phone", customer.phone);
                cmd.Parameters.AddWithValue("email", customer.email);
                cmd.Parameters.AddWithValue("address", customer.address);
                cmd.CommandType = CommandType.StoredProcedure;
                oconexion.Open();
                cmd.ExecuteNonQuery();
            }
            return RedirectToAction("Index", "Home");
        }
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return RedirectToAction("Index", "Home");
            }
            Customer customer = olista.Where(x => x.id == id).FirstOrDefault();
            using (SqlConnection oconexion = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_Eliminar", oconexion);
                cmd.Parameters.AddWithValue("id", customer.id);
                cmd.CommandType = CommandType.StoredProcedure;
                oconexion.Open();
                cmd.ExecuteNonQuery();
            }
            return RedirectToAction("Index", "Home");
        }
    }
}