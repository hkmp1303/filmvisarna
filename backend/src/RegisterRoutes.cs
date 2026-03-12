
namespace WebApp;

public static class RegisterRoutes
{
  public static void Start()
  {
    App.MapPost("/api/user", (HttpContext context, JsonElement bodyJson) =>
    {
      try
      {

        var body = JSON.Parse(bodyJson.ToString());
        string email = body.email;
        string password = body.password;
        string firstname = body.firstname;
        string lastname = body.lastname;
        string phone = body.phone;


        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password) ||
                string.IsNullOrEmpty(firstname) || string.IsNullOrEmpty(lastname))
        {
          return RestResult.Parse(context, new { error = "Alla obligatoriska fält måste fyllas i." });
        }

        var existingUser = SQLQueryOne("SELECT userid FROM user WHERE email = @email", new { email });

        if (existingUser != null)
        {
          return RestResult.Parse(context, new { message = "E-postadressen är redan registrerad." });
        }

        string hashedPassword = Password.Encrypt(password);

        var insertQuery = @"
                    INSERT INTO user (email, password, firstname, lastname, phone) 
                    VALUES (@email, @password, @firstname, @lastname, @phone)";

        var result = SQLQueryOne(insertQuery, new
        {
          email,
          password = hashedPassword,
          firstname,
          lastname,
          phone
        });

        if (result == null || result.rowsAffected == 0)
        {

          return RestResult.Parse(context, new { message = "Kunde inte spara användaren i databasen." });
        }

        return RestResult.Parse(context, new { success = true, message = "Konto skapat!" });
      }
      catch (Exception ex)
      {
        Console.WriteLine("Register Error: " + ex.Message);
        return RestResult.Parse(context, new { message = "Ett internt serverfel uppstod." });
      }
    });
  }
}