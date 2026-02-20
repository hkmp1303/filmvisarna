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
        var body = await context.Request.ReadFromJsonAsync<JsonElement>();
        //innehål
        string name = body.GetProperty("name").GetString();
        string email = body.GetProperty("email").GetString();
        string subject = body.GetProperty("subject").GetString();
        string message = body.GetProperty("message").GetString();

        EmailService.ReceiveEmail(name, email, subject, message);

        return Results.Ok(new { message = "Mail sent" });
      }
      catch (Exception ex)
      {
        Console.WriteLine("crash " + ex.Message);
        return Results.Problem("error: " + ex.Message);
      }
    });

    // App.MapPost("api/PassRecovery", (HttpContent context, JsonElement bodyJson) =>
    // {
    //   try
    //   {
    //     System.Console.WriteLine("text to see if api connection works. you now have a new password");
    //   }
    //   catch (Exception ex)
    //   {
    //     System.Console.WriteLine("password crash" + ex.Message);
    //   }
    // });

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
            f.filmid AS filmid, 
            sc.start AS start, 
            sa.description AS description 
           FROM {table} AS f 
           JOIN screening AS sc ON f.filmid = sc.filmid 
           JOIN salon AS sa ON sc.salonid = sa.salonid 
           WHERE f.filmid = @id",
            ReqBodyParse(table, Obj(new { id })).body,
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



