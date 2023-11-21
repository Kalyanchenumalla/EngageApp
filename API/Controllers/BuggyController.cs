using API.Controllers;
using API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace API;

public class BuggyController: BaseApiController
{
    private readonly DataContext _context;
    public BuggyController(DataContext context)
    {
        _context = context; //to initialize
    }
    [Authorize]
    [HttpGet("auth")] //returning various types of errors
    public ActionResult<string> GetSecret()
    {
        return "secret text";
    }
    [HttpGet("not-found")] //returning various types of errors
    public ActionResult<AppUser> GetNotFound()
    {
        var thing = _context.Users.Find(-1); //findinguser doesnt exist
        if(thing == null) return NotFound();
        return thing;
    }
    [HttpGet("server-error")] //returning various types of errors
    public ActionResult<string> GetSecretError()
    {
        // try {
        var thing = _context.Users.Find(-1); //findinguser doesnt exist
        var thingToReturn = thing.ToString(); //we cannot assign null to string so it will generate null execption
        return thingToReturn;
        // }
        // catch(Exception ex) {
        //     return StatusCode(500, "Computer says no!");
        // }
        //try and catch is not the correct way for exception , we need to create a middleware
    }
    [HttpGet("bad-request")] //returning various types of errors
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest("This was not a good request");
    }
    //validation error type now 400 
}
