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
          return RestResult.Parse(context, new { error = "Invalid input information" });
        }

        String resetToken = Guid.NewGuid().ToString();

        SQLQuery("UPDATE user SET request_pass = @token WHERE email = @email",
        new { token = resetToken, email = email });

        try
        {
          string resetLink = $"http://localhost:5173/reset-password?token={resetToken}";
          string body = $@"
                    <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fffdc4; border-radius: 15px; padding: 20px; background-color: #660157; color: #fdfff1;'>
                    <h2 style='color: #fffdc4; text-align: center;'>FilmVisaren</h2>
                    <hr style='border: 0; border-top: 1px solid #fffdc4; margin: 20px 0;'>
                    <h3 style='margin-top: 0; text-align: center;'>Återställning av lösenord</h3>
                    <br>
                    <p style='text-align: center;'>Vi har tagit emot en förfrågan om att återställa ditt lösenord.</p>
                    <p style='text-align: center;'>Klicka på länken nedan för att välja ett nytt lösenord:</p>
                    <div style='text-align: center; margin: 30px 0;'>
                      <a href='{resetLink}' 
                        style='background-color: #fffdc4; color: #660157; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;'>
                        Återställ lösenord här
                      </a>
                    </div>                 
                    <br>
                    <p style='font-size: 0.9em; opacity: 0.8; text-align: center;'> Om du inte har begärt detta kan du bortse från detta mejl.</p>
                    <hr style='border: 0; border-top: 1px solid #fffdc4; margin: 20px 0;'>
                    <p style='text-align: center; font-size: 0.8em; text-align: center;'>© 2026 FilmVisaren AB</p>
                    </div>";

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

      return RestResult.Parse(context, new { message = "Successfull" });

    });

  }
}