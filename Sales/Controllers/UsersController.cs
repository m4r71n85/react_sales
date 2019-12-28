using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sales.Data;
using Sales.ViewModels;

namespace Sales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepo userRepo;

        public UsersController(IUserRepo userRepo)
        {
            this.userRepo = userRepo;
        }

        // GET: api/users/list
        [HttpGet("list")]
        public async Task<ActionResult<UsersGridViewModel>> GetUsers(int pageSize, int page, string sortField = null, string sortOrder = null)
        {
            try
            {
                var usersVm = new UsersGridViewModel
                {
                    TotalSize = await userRepo.GetAllUsersCountAsync(),
                    UsersData = await userRepo.GetFilteredUsersAsync(pageSize, page, sortField, sortOrder)
                };

                return usersVm;
            }
            catch
            {
                return BadRequest("An error has occured.");
            }
        }

        // GET: api/users/compare
        [HttpGet("compare")]
        public async Task<ActionResult<CompareUserVm>> GetUserCompareData(int userId)
        {
            try
            {
                var user = await userRepo.GetUserCompareAsync(userId);

                if (user == null)
                {
                    return NotFound();
                }

                return user;
            }
            catch
            {
                return BadRequest("An error has occured.");
            }
        }

        // GET: api/users/top
        [HttpGet("top")]
        public async Task<ActionResult<List<TopUserVm>>> GetUser()
        {
            try
            {
                return await userRepo.GetTopUsersAsync();
            }
            catch
            {
                return BadRequest("An error has occured.");
            }
        }


        // POST: api/Users/reset
        [HttpPost("/api/reset")]
        public async Task<ActionResult> ResetData()
        {

            try
            {
                await userRepo.ResetDataAsync();
                return Ok();
            }
            catch
            {
                return BadRequest("An error has occured.");
            }
        }
    }
}
