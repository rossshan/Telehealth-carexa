using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;

namespace telehealth;

public class LiveKitService
{
    private readonly string _apiKey;
    private readonly string _apiSecret;

    public LiveKitService(IConfiguration configuration)
    {
        _apiKey = configuration["LiveKit:ApiKey"];
        _apiSecret = configuration["LiveKit:ApiSecret"];
    }
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };

    public string CreateToken(string roomName, string identity, string name, bool isProvider)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_apiSecret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var videoGrant = new
        {
            RoomJoin = true,
            Room = roomName,
            CanPublish = true,
            CanSubscribe = true,
            CanPublishData = true,
            Name = name
        };

        var jsonGrant = JsonSerializer.Serialize(videoGrant, JsonOptions);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Iss, _apiKey),
            new(JwtRegisteredClaimNames.Sub, identity),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            // Crucial: Use JsonClaimValueTypes.Json to ensure the grant is encoded as an object, not a string
            new("video", jsonGrant, JsonClaimValueTypes.Json)
        };

        var token = new JwtSecurityToken(
            issuer: _apiKey,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
