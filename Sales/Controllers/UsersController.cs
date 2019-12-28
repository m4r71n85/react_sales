using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sales.Data;
using Sales.ViewModels;

namespace Sales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepo userRepo;
        private readonly ILogger<UsersController> logger;

        public UsersController(IUserRepo userRepo, ILogger<UsersController> logger)
        {
            this.userRepo = userRepo;
            this.logger = logger;
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
            catch(Exception ex)
            {
                logger.LogError(ex, null);
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
                    logger.LogWarning("User with UserId: {userId} not found", userId);
                    return NotFound();
                }

                return user;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, null);
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
            catch (Exception ex)
            {
                logger.LogError(ex, null);
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
            catch (Exception ex)
            {
                logger.LogError(ex, null);
                return BadRequest("An error has occured.");
            }
        }
    }
}
