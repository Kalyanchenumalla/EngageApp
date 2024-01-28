using System.Text;
using API;
using API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var connString = "";
if (builder.Environment.IsDevelopment()) 
    connString = builder.Configuration.GetConnectionString("DefaultConnection");
else 
{
// Use connection string provided at runtime by Flyio.
        var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

        // Parse connection URL to connection string for Npgsql
        connUrl = connUrl.Replace("postgres://", string.Empty);
        var pgUserPass = connUrl.Split("@")[0];
        var pgHostPortDb = connUrl.Split("@")[1];
        var pgHostPort = pgHostPortDb.Split("/")[0];
        var pgDb = pgHostPortDb.Split("/")[1];
        var pgUser = pgUserPass.Split(":")[0];
        var pgPass = pgUserPass.Split(":")[1];
        var pgHost = pgHostPort.Split(":")[0];
        var pgPort = pgHostPort.Split(":")[1];
	    var updatedHost = pgHost.Replace("flycast", "internal");

        connString = $"Server={updatedHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
}
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseNpgsql(connString);
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// if(builder.Environment.IsDevelopment()) {
//     app.UseDeveloperExceptionPage(); //to get rid of Object reference not set to instance of object in dev mode
// }


// Configure the HTTP request pipeline.
//middleware should be at top always
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// app.UseAuthorization();

app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200"));

app.UseAuthentication(); //to have id valid 18 yrs checks
app.UseAuthorization(); //ok you have id

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");
app.MapFallbackToController("Index", "Fallback");
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManaeger = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    // context.Connections.RemoveRange(context.Connections); //this is used for small scale tables not for 1000s 
    // await context.Database.ExecuteSqlRawAsync("DELETE FROM \"Connections\"");
    await Seed.ClearConnections(context);
    await Seed.SeedUsers(userManager, roleManaeger);
}
catch(Exception ex) {
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();
