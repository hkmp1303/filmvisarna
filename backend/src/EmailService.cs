using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Text.Json;
namespace WebApp;

public class EmailConfig

{
    public string smtpServer { get; set; }
    public string smtpPart { get; set; }
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

            if (config == null || string.IsNullOrEmpty(config.smtpServer))
            {
                throw new Exception("Could not read json file");
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

        var message = new MimeMessage()
        {
            From = { MailboxAddress.Parse(config.emailUsername) },
            To = { MailboxAddress.Parse(to) },
            Subject = subject,
            Body = new TextPart("html") { Text = body } //change this if you want to write html in the email :)
        };

        using (var client = new SmtpClient())
        {
            client.Connect(config.smtpServer, int.Parse(config.smtpPart), SecureSocketOptions.StartTls);
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
            int port = string.IsNullOrEmpty(config.smtpPart) ? 587 : int.Parse(config.smtpPart);
            client.Connect(config.smtpServer, port, SecureSocketOptions.StartTls); client.Authenticate(config.emailUsername, config.emailPassword);
            client.Send(message);
            client.Disconnect(true);
        }
    }


}