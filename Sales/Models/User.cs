using System.Collections.Generic;

namespace Sales.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public virtual List<Sale> Sales { get; set; } = new List<Sale>();
    }
}
