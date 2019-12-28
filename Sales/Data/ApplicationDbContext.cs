using Microsoft.EntityFrameworkCore;
using Sales.Models;
using Sales.ViewModels;

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
        public DbQuery<TopUserVm> TopUserVms { get; set; }
    }
}
