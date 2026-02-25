using System.Text;
using System.Text.Json;

namespace WebApp;

public static class RecoverPassword
{
  public static void Start()
  {
    App.MapPut("/api/recoverpassword", (HttpContext context, JsonElement bodyJson) =>
    {
      string email = bodyJson.GetProperty("email").GetString();

      var dbUser = SQLQueryOne("SELECT * FROM user WHERE email = @email", new { email });

      if (dbUser == null)
      {
        return RestResult.Parse(context, new { error = "No such user." });
      }

      string pwdList = "123456789qwertyuiopasdfghjklzxcvbnm";
      Random rnd = new();
      StringBuilder newRndPass = new();
      for (int i = 0; i < 10; i++)
      {
        newRndPass.Append(pwdList[rnd.Next(0, pwdList.Length)]);
      }
      string finalPassword = newRndPass.ToString();

      string hashedPassword = Password.Encrypt(finalPassword);

      SQLQuery("UPDATE user SET password = @password WHERE email = @email",
              new { password = hashedPassword, email = email });

      try
      {
        string subject = "Återställning av lösenord";
        string body = $@"
                    <h2>Ditt lösenord har återställts</h2>
                    <p>Du kan nu logga in med ditt nya tillfälliga lösenord:</p>
                    <p><b>{finalPassword}</b></p>
                    <br>
                    <p>Vi rekommenderar att du ändrar lösenordet när du har loggat in.</p>";

        EmailService.SendEmail(email, subject, body);
      }
      catch (Exception ex)
      {
        Console.WriteLine("Error-RP: " + ex.Message);
      }

      return RestResult.Parse(context, new
      {
        message = "Password updated and sent",
      });
    });
  }
}