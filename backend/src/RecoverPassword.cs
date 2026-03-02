using System.Text;
using System.Text.Json;

namespace WebApp;

public static class RecoverPassword
{
  public static void Start()
  {
    App.MapPut("/api/recoverpassword", (HttpContext context, JsonElement bodyJson) =>
    {
      try
      {


        if (!bodyJson.TryGetProperty("email", out JsonElement emailElement))
        {
          return RestResult.Parse(context, new { error = "Email is missing in request." });
        }

        string email = bodyJson.GetProperty("email").GetString();

        var dbUser = SQLQueryOne("SELECT * FROM user WHERE email = @email", new { email });

        if (dbUser == null)
        {
          return RestResult.Parse(context, new { error = "Connection failed" });
        }

        String resetToken = Guid.NewGuid().ToString();

        SQLQuery("UPDATE user SET request_pass = @token WHERE email = @email",
        new { token = resetToken, email = email });

        try
        {
          string resetLink = $"http://localhost:5173/reset-password?token={resetToken}";
          string body = $@"
                    <h2>Återställning av lösenord.</h2>
                    <br>
                    <p>Vi har tagit emot en förfrågan om att återställa ditt lösenord.</p>
                    <p>Klicka på länken nedan för att välja ett nytt lösenord:</p>
                    <a href='{resetLink}'>Återställ lösenord här</a>                    
                    <br>
                    <p>Vi rekommenderar att du ändrar lösenordet när du har loggat in.</p>
                    <p> Om du inte har begärt detta kan du bortse från detta mejl.</p>";

          EmailService.SendEmail(email, "Återställ lösenord", body);

        }
        catch (Exception ex)
        {
          Console.WriteLine("Error-RP: " + ex.Message);
        }

        return RestResult.Parse(context, new
        {
          message = "Successfull",
        });
      }
      catch (Exception exx)
      {
        Console.WriteLine("CRITICAL ERROR: " + exx.Message);
        return RestResult.Parse(context, new { error = "Internal server error." });
      }
    });

    App.MapPost("/api/reset-password", (HttpContext context, JsonElement bodyJson) =>
    {

      string token = bodyJson.GetProperty("token").GetString();
      string newPassword = bodyJson.GetProperty("password").GetString();

      var dbUser = SQLQueryOne("SELECT * FROM user WHERE request_pass = @token", new { token });

      if (dbUser == null)
      {
        return RestResult.Parse(context, new { error = "Länken är ogiltlig eller har gått ut." });
      }

      string hashedPassword = Password.Encrypt(newPassword);

      SQLQuery("UPDATE user SET password = @password, request_pass = NULL WHERE request_pass = @token",
      new { password = hashedPassword, token = token });

      return RestResult.Parse(context, new { message = "Ditt lösenord har ändrats." });

    });

  }
}