﻿using Microsoft.AspNetCore.Identity;

namespace API;

public class AppRole: IdentityRole<int>
{
    public ICollection<AppUserRole> UserRoles { get; set; } // this is to the join table
}