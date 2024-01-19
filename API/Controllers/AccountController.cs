﻿using System.Security.Cryptography;
using System.Text;
using API.Controllers;
using API.Data;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API;

public class AccountController: BaseApiController
{
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AccountController(DataContext context, ITokenService tokenService, IMapper mapper) {
        _tokenService = tokenService;
        _mapper = mapper;
        _context = context;
    }
    [HttpPost("register")] // POST: api/account/register?username=sam&password=password
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto) {
    // public async Task<ActionResult<AppUser>> Register(string username, string password) {

        if(await UserExists(registerDto.Username)) return BadRequest("Username is taken");
        var user = _mapper.Map<AppUser>(registerDto);
        using var hmac = new HMACSHA512(); //for password hashing || using will allocate some memory automatically for garbage collection
        //to call dispose() method
        // var user = new AppUser
        // {
            user.UserName = registerDto.Username.ToLower();
            // UserName = username,
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;
        // };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return new UserDto
        {
            Username= user.UserName,
            Token = _tokenService.CreateToken(user),
            KnownAs = user.KnownAs
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login (LoginDto loginDto) {
        var user = await _context.Users.Include(p => p.Photos).SingleOrDefaultAsync(x => x.UserName == loginDto.Username);
        if(user == null) return Unauthorized("invalid username");

        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
        for(int i = 0; i < computedHash.Length; i++) {
            if(computedHash[i] != user.PasswordHash[i]) return Unauthorized("invalid password");
        }
        return new UserDto
        {
            Username= user.UserName,
            Token = _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x =>x.IsMain)?.Url,
            KnownAs = user.KnownAs
        };
    }
    //To check whether user is already registered, 34th line Users is a table
    private async Task<bool> UserExists(string username) {
        return await _context.Users.AnyAsync(x => x.UserName == username.ToLower()); //if username exists=> true, else it returns false
        //comparing like by like for toLower() 
    }

}
