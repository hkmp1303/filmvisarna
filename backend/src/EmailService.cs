using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Text.Json;
namespace WebApp;

public class EmailConfig

{
    public string smtpServer;
    public string smtpPart;
    public string emailUsername;
    public string emailPassword;
}

static class EmailService
{
    public static EmailConfig GetConfig()
    {
        var configPath = Path.Combine(
        AppContext.BaseDirectory, "..", "..", "..", "db-config.json"
        );

        var configJson = File.ReadAllText(configPath);
        return JsonSerializer.Deserialize<EmailConfig>(configJson);
    }

    public static void SendEmail(string to, string subject, string body)
    {
        var config = GetConfig();

        var message = new MimeMessage()
        {
            From = { MailboxAddress.Parse(config.emailUsername) },
            To = { MailboxAddress.Parse(to) },
            Subject = subject,
            Body = new TextPart("html") { Text = body } //ändra detta om man vill ha html i meddelandet
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
            client.Connect(config.smtpServer, int.Parse(config.smtpPart), SecureSocketOptions.StartTls);
            client.Authenticate(config.emailUsername, config.emailPassword);
            client.Send(message);
            client.Disconnect(true);
        }
    }
}