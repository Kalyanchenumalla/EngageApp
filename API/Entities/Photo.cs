using System.ComponentModel.DataAnnotations.Schema;

namespace API;

[Table("Photos")]
public class Photo
{
    public int Id { get; set; }
    public string Url { get; set; }
    public bool IsMain { get; set; } //specifies users main photo
    public string PublicId { get; set; } // to upload photo 
    public AppUser AppUser { get; set; }
    public int AppUserId { get; set; }

}