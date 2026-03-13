namespace WebApp;

public static class ProfileRoutes
{
  public static void Start()
  {
    App.MapGet("/api/profile", (HttpContext context) =>
    {
      var user = Session.Get(context, "user");

      if (user == null)
      {
        return RestResult.Parse(context, new { error = "Inte inloggad" });
      }

      var activeBookings = DbQuery.SQLQuery(
              "SELECT * FROM booking WHERE userid = @id AND status = 'booked'",
              new { id = user.id }
          );

      var history = DbQuery.SQLQuery(
              "SELECT * FROM booking WHERE userid = @id AND status != 'booked'",
              new { id = user.id }
          );

      return RestResult.Parse(context, new
      {
        user,
        activeBookings,
        history
      });
    });
  }
}