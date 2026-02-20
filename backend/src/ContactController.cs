using Microsoft.AspNetCore.Mvc;
namespace WebApp.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    [HttpPost]
    public IActionResult SendContactForm([FromBody] ContactRequest data)
    {
        EmailService.ReceiveEmail(data.Name, data.Email, data.Subject, data.Message);

        return Ok(new { message = "Mailet har skickats till oss!" });
    }
}

public class ContactRequest
{
    public string Name;
    public string Email;
    public string Subject;
    public string Message;
}