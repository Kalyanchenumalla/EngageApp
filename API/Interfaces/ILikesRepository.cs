namespace API;

public interface ILikesRepository
{
        Task<UserLike> GetUserLike(int SourceUserId, int TargetUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams); 
}
