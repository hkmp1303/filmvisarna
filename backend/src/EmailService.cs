using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Text.Json;
namespace WebApp;

public class EmailConfig

{
  public string smtpServer { get; set; }
  public int smtpPort { get; set; }
  public string emailUsername { get; set; }
  public string emailPassword { get; set; }
}

static class EmailService
{
  public static EmailConfig GetConfig()
  {
    try
    {
      var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "db-config.json");
      var configJson = File.ReadAllText(configPath);

      var options = new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true
      };

      var config = JsonSerializer.Deserialize<EmailConfig>(configJson, options);

      // if (config != null)
      // {
      //   Console.WriteLine($"Config laddad: Server={config.smtpServer}, User={config.emailUsername}");
      // }

      if (config == null || string.IsNullOrEmpty(config.smtpServer))
      {
        throw new Exception("Could not read json file");
        throw new Exception("Email configuration is missing values (check db-config.json)");
      }

      return config;
    }
    catch (Exception ex)
    {
      Console.WriteLine("Crash: " + ex.Message);
      throw;
    }
  }

  public static void SendEmail(string to, string subject, string body)
  {
    var config = GetConfig();

    var message = new MimeMessage();

    message.From.Add(new MailboxAddress("Filmvisarna", config.emailUsername));
    message.To.Add(new MailboxAddress("", to));
    message.Subject = subject;
    message.Body = new TextPart("html") { Text = body };

    using (var client = new SmtpClient())
    {
      client.Connect(config.smtpServer, config.smtpPort, SecureSocketOptions.StartTls);
      client.Authenticate(config.emailUsername, config.emailPassword);
      client.Send(message);
      client.Disconnect(true);
    }
  }

  public static void ReceiveEmail(string name, string from, string subject, string body)
  {
    var config = GetConfig();

    var message = new MimeMessage();
    message.From.Add(MailboxAddress.Parse(from));
    message.To.Add(MailboxAddress.Parse(config.emailUsername));
    message.Subject = subject;

    message.Body = new TextPart("html")
    {
      Text = $@"
                    <h3>Du har fått ett meddelande från {name}</h3>
                    <br>
                    <p><b>Ämne: {subject}</b></p>
                    <br>
                    <p>{body}</p>"

    };

    using (var client = new SmtpClient())
    {
      client.Connect(config.smtpServer, config.smtpPort, SecureSocketOptions.StartTls); client.Authenticate(config.emailUsername, config.emailPassword);
      client.Send(message);
      client.Disconnect(true);
    }
  }


}