using MimeKit;

namespace WebApp;

public static class RestApi
{
  public static void Start()
  {
    //sending contact email to email
    App.MapPost("/api/contact", async (HttpContext context) =>
    {
      try
      {
        var body = await context.Request.ReadFromJsonAsync<ContactRequest>();
        bool hasDotAfterAt = Regex.IsMatch(body.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        if (string.IsNullOrEmpty(body.Email) || !MailboxAddress.TryParse(body.Email, out _) || !hasDotAfterAt)
        {
          return Results.BadRequest(new { error = "Ogiltig E-mail." });
        }
        if (body.Subject == "None")
        {
          return Results.BadRequest(new { error = "vänligen välj ett ärende." });
        }
        if (string.IsNullOrEmpty(body.Message))
        {
          return Results.BadRequest(new { error = "Meddelande kan inte vara tomt" });
        }
        if (body.Message.Length < 10)
        {
          int BML = body.Message.Length;
          int charLeft = 10 - BML;
          return Results.BadRequest(new { error = $"Meddelande är för kort. Du behöver {charLeft} fler karaktärer." });
        }

        EmailService.ReceiveEmail(body.Name, body.Email, body.Subject, body.Message);

        return Results.Ok(new { success = true, message = "Ditt meddelande har skickats." });
      }
      catch (Exception ex)
      {
        Console.WriteLine("error: " + ex.Message);
        return Results.Problem("error: " + ex.Message);
      }
    });

    App.MapPost("/api/{table}", (
        HttpContext context, string table, JsonElement bodyJson
    ) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      body.Delete("id");
      var parsed = ReqBodyParse(table, body);
      var columns = parsed.insertColumns;
      var values = parsed.insertValues;
      var sql = $"INSERT INTO {table}({columns}) VALUES({values})";
      var result = SQLQueryOne(sql, parsed.body, context);
      if (!result.HasKey("error"))
      {
        // Get the insert id and add to our result
        result.insertId = SQLQueryOne(
                @$"SELECT id AS __insertId
                       FROM {table} ORDER BY id DESC LIMIT 1"
            ).__insertId;
      }
      return RestResult.Parse(context, result);
    });

    App.MapGet("/api/{table}", (
        HttpContext context, string table
    ) =>
    {
      var query = RestQuery.Parse(context.Request.Query);
      if (query.error != null)
      {
        return RestResult.Parse(context, Arr(Obj(new { error = query.error })));
      }
      var sql = $"SELECT * FROM {table}" + query.sql;
      return RestResult.Parse(context, SQLQuery(sql, query.parameters, context));
    });

    App.MapGet("/api/{table}/{id}", (
        HttpContext context, string table, string id
    ) =>
        RestResult.Parse(context, SQLQueryOne(
            $"SELECT * FROM {table} WHERE {table}id = @id",
            ReqBodyParse(table, Obj(new { id })).body,
            context
        ))
    );

    App.MapPut("/api/{table}/{id}", (
        HttpContext context, string table, string id, JsonElement bodyJson
    ) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      body.id = id;
      var parsed = ReqBodyParse(table, body);
      var update = parsed.update;
      var sql = $"UPDATE {table} SET {update} WHERE {table}id = @id";
      var result = SQLQueryOne(sql, parsed.body, context);
      return RestResult.Parse(context, result);
    });

    App.MapDelete("/api/{table}/{id}", (
         HttpContext context, string table, string id
    ) =>
        RestResult.Parse(context, SQLQueryOne(
            $"DELETE FROM {table} WHERE {table}id = @id",
            ReqBodyParse(table, Obj(new { id })).body,
            context
        ))
    );

    App.MapGet("/api/selectScreening/{table}/{id}", (
        HttpContext context, string table, string id
      ) =>
        RestResult.Parse(context, SQLQuery(
            $@"SELECT
          screeningid,
          filmid,
          start,
          room_number,
          description
          FROM screening
          JOIN salon USING(salonid)
          WHERE filmid = @id",
            ReqBodyParse(table, Obj(new { id })).body,
            context
        ))
      );

    App.MapDelete("/api/resetdb", (
      HttpContext context
    ) =>
    {
      var result = SQLQuery(
        $@"SET FOREIGN_KEY_CHECKS = 0;
          DROP TABLE IF EXISTS
            user,
            price,
            film,
            salon,
            screening,
            booking,
            reservation;
          SET FOREIGN_KEY_CHECKS = 1;");
      return RestResult.Parse(context, result);
    });
    App.MapGet("/api/bookedSeatRes/{screeningid}", (
      HttpContext context, string screeningid
    ) =>
      RestResult.Parse(context, SQLQuery(
        $@"SELECT
          `seat_number`,
          `row_number`
        FROM booking
          INNER JOIN reservation USING(bookingid)
        WHERE screeningid = @screeningid
          AND `status`!='canceled'
        ORDER BY `seat_number`
        ;",
          ReqBodyParse("booking", Obj(new { screeningid })).body,
          context
      ))
    );
  }

  //this class i so the contactform
  public class ContactRequest
  {
    public string Name { get; set; }
    public string Email { get; set; }
    public string Subject { get; set; }
    public string Message { get; set; }
  }
}



