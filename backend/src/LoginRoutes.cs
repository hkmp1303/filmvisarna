namespace WebApp;

public static class LoginRoutes
{
  const string LOGIN_FAIL_MSG = "Fel e-post eller lösenord.";
  private static Obj GetUser(HttpContext context)
  {
    return Session.Get(context, "user");
  }

  public static void Start()
  {
    App.MapPost("/api/login", async (HttpContext context, JsonElement bodyJson) =>
    {
      Obj user = GetUser(context); // try get user session from sessions table
      var body = JSON.Parse(bodyJson.ToString());

      // If there is a user logged in already
      if (user != null)
      {
        var already = new { error = "A user is already logged in." };
        return RestResult.Parse(context, already);
      }

      // Find the user in the DB
      var dbUser = SQLQueryOne(
        "SELECT * FROM user WHERE email = @email",
        new { body.email }
      );
      if (dbUser == null)
      {
        return RestResult.Parse(context,
          Obj(new { msg = LOGIN_FAIL_MSG }));
      }

      // If the password doesn't match
      if (!Password.Verify(
        (string)body.password,
        (string)dbUser.password
      ))
      {
        context.Response.StatusCode = 403;
        return RestResult.Parse(context,
          Obj(new { msg = LOGIN_FAIL_MSG }));
      }

      // Add the user to the session, without password
      dbUser.Delete("password");
      Session.Set(context, "user", dbUser);

      // Return the user
      return RestResult.Parse(context, dbUser!);
    });

    App.MapGet("/api/login", async (HttpContext context) =>
    {
      var user = GetUser(context);
      return RestResult.Parse(context, user != null ?
        user : new { msg = "Användaren ej inloggad" }
      );
    });

    App.MapDelete("/api/login", async (HttpContext context) =>
    {
      var user = GetUser(context);

      // Delete the user from the session
      Session.Set(context, "user", null);

      return RestResult.Parse(context, user == null ?
        new { error = "No user is logged in." } :
        new { status = "Successful logout." }
      );
    });
  }
}