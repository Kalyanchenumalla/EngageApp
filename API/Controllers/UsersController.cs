using API.Data;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

// [Authorize]

public class UsersController : BaseApiController
{
    // private readonly DataContext _context;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    public UsersController(IUserRepository userRepository, IMapper mapper)
    // public UsersController(DataContext context)
    {
        // _context = context;
        _mapper = mapper;
        _userRepository = userRepository;
    }
    // [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        // var users = await _context.Users.ToListAsync();
        var users = await _userRepository.GetMembersAsync(); 
        // var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
        return Ok(users);
        // return users;
    }
    [HttpGet("{username}")] //api/users/2
    public async Task <ActionResult<MemberDto>> GetUser(string username) 
    {
        // return await _context.Users.FindAsync(id);
        //tasty burger to order to kitchen (line by line) // shift+alt+f
        return await _userRepository.GetMemberAsync(username);
        // return _mapper.Map<MemberDto>(user);
    }
}
