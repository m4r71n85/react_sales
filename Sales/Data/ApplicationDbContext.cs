using Microsoft.EntityFrameworkCore;
using Sales.Models;

namespace Sales.Data
{
    //todo: extract to interface
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Sale> Sales { get; set; }
    }
}
