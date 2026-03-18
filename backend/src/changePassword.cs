namespace WebApp;

public static class ChangePasswordRoutes
{
  public static void Start()
  {
    App.MapPost("/api/change-password", (HttpContext context, JsonElement bodyJson) =>
    {
      // Get the logged in user from session - same as LoginRoutes.GetUser()
      var user = Session.Get(context, "user");

      if (user == null)
      {
        return RestResult.Parse(context, new { error = "Ingen användare är inloggad." });
      }

      var body = JSON.Parse(bodyJson.ToString());
      string currentPassword = body.currentPassword;
      string newPassword = body.newPassword;

      if (string.IsNullOrEmpty(currentPassword) || string.IsNullOrEmpty(newPassword))
      {
        return RestResult.Parse(context, new { error = "Alla fält måste fyllas i." });
      }


      // Get the full user row including password - same as LoginRoutes does
      var dbUser = SQLQueryOne(
              "SELECT * FROM user WHERE userid = @userid",
              new { userid = (int)user.userid }
          );

      if (dbUser == null)
      {
        return RestResult.Parse(context, new { error = "Användaren hittades inte." });
      }

      // Verify current password - same as LoginRoutes does
      if (!Password.Verify((string)currentPassword, (string)dbUser.password))
      {
        return RestResult.Parse(context, new { error = "Nuvarande lösenord är felaktigt." });
      }

      // Hash new password - same as RegisterRoutes does
      string newHash = Password.Encrypt(newPassword);

      var result = SQLQueryOne(
              "UPDATE user SET password = @password WHERE userid = @userid",
              new { password = newHash, userid = (int)user.userid }
          );

      if (result == null || result.rowsAffected == 0)
      {
        return RestResult.Parse(context, new { error = "Kunde inte uppdatera lösenordet." });
      }

      return RestResult.Parse(context, new { success = true, message = "Lösenordet har uppdaterats!" });
    });
  }
}