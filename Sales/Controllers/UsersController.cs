using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sales.Data;
using Sales.Models;
using Sales.ViewModels;

namespace Sales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet("{pageSize}/{page}/{sortBy}/{sortType}")]
        public async Task<ActionResult<UsersGridViewModel>> GetUsers(int pageSize, int page, string sortBy, string sortType)
        {
            var usersVm = new UsersGridViewModel();
            //todo: move to repo
            usersVm.TotalSize = await _context.Users.CountAsync();
            var usersQuery = _context.Users.AsQueryable();
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                if (sortBy == "firstName")
                    if (sortType == "asc")
                        usersQuery = usersQuery.OrderBy(u => u.FirstName);
                    else
                        usersQuery = usersQuery.OrderByDescending(u => u.FirstName);

                if (sortBy == "surname")
                    if (sortType == "asc")
                        usersQuery = usersQuery.OrderBy(u => u.Surname);
                    else
                        usersQuery = usersQuery.OrderByDescending(u => u.Surname);

                if (sortBy == "email")
                    if (sortType == "asc")
                        usersQuery = usersQuery.OrderBy(u => u.Email);
                    else
                        usersQuery = usersQuery.OrderByDescending(u => u.Email);
            }
            usersVm.UsersData = await usersQuery.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return usersVm;
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }
    }
}
