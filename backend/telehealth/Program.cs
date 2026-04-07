using telehealth;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<LiveKitService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.MapGet("/", () => "API Running ✅");


app.MapPost("/api/token/provider", (LiveKitService liveKit, ProviderTokenRequest request) =>
{
    var roomName = request.RoomName ?? $"room-{Guid.NewGuid():N}";
    var identity = request.Name ?? "Provider";  
    var token = liveKit.CreateToken(roomName, identity, identity, true);
    
    return Results.Ok(new { token, roomName });
});

app.MapPost("/api/token/patient", (LiveKitService liveKit, PatientTokenRequest request) =>
{
    if (string.IsNullOrEmpty(request.RoomName))
    {
        return Results.BadRequest("RoomName is required");
    }
    
    var identity = request.Name ?? "Patient";
    var token = liveKit.CreateToken(request.RoomName, identity, identity, false);
    
    return Results.Ok(new { token });
});

app.Run();

record ProviderTokenRequest(string? Name, string? RoomName);
record PatientTokenRequest(string RoomName, string? Name);
