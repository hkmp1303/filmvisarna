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

    App.MapPost("/api/reserveSeatRes/{screeningid}", (
      HttpContext context, string screeningid, JsonElement bodyJson
    ) =>
    {
    var body = JSON.Parse(bodyJson.ToString());
    dynamic result;
    dynamic oreturny = new Obj();
    body.screeningid = screeningid;
    body.userid = null; // TODO sesion
    bool isFirstRes = string.IsNullOrEmpty(body.guid);
    if (isFirstRes == true)
    {
      body.guid = Guid.NewGuid().ToString();
      SQLQueryOne(
        $@"INSERT INTO booking (total_cost, `date`, `guid`, `status`, screeningid, userid) VALUES(
            @total_cost,
            NOW(),
            @guid,
            'reserved',
            @screeningid,
            @userid
          );",
        Obj(new
        {
          total_cost = body.total_cost,
          guid = body.guid,
          userid = body.userid,
          screeningid = body.screeningid
        }),
        context
      );
      result = Obj(new { guid = body.guid });
    }
    else
    {
      result = SQLQueryOne($@"SELECT bookingid FROM booking
          WHERE screeningid=@screeningid AND `guid`=@guid AND `status`='reserved';",
        Obj(new { screeningid = body.screeningid, guid = body.guid }),
        context
      );
      bool bookingok = false;
      try {
        body.bookingid = result.bookingid;
        bookingok = true;
      }
      catch { }
      if (bookingok) {
        result = SQLQueryOne(
          $@"UPDATE booking SET
              total_cost = @total_cost,
              `date` = NOW(),
              userid = @userid
            WHERE bookingid=@bookingid;",
          Obj(new { total_cost = body.total_cost, userid = body.userid, bookingid = body.bookingid }),
          context
        );
        Console.WriteLine(result);
      }
      else {
        context.Response.StatusCode = 404;
        return RestResult.Parse(context, Obj(new { error = "Invalid reservation guid." }));
      };
    }
    result = SQLQuery($@"SELECT seat_number
        FROM reservation
        WHERE screeningid = @screeningid AND bookingid = @bookingid;",
      Obj(new { bookingid = body.bookingid, screeningid = body.screeningid }),
      context
    );
    Console.WriteLine(bodyJson.GetProperty("seat"));
    //Console.WriteLine(body.GetValue("seat[]"));
    // foreach(dynamic i in body) {
    try {
      var selectedSeats = body.seat;
      foreach (dynamic res in result)
      {
        if (body.seat.Contains(res.seat_number))
        {
          continue;
        }
          SQLQuery($@"INSERT INTO reservation (seat_number, `row_number`, bookingid) VALUES (
          @seat_number,
          @row_number,
          @bookingid
          )",
          Obj(new { seat_number = res.seat_number, row_number = res.row_number, bookingid = res.bookingid }),
          context
        );
      }
      oreturny.guid = body.guid;
      }
      catch (Exception e) {
        return RestResult.Parse(context, Obj(new { error = "Kunde inte spara reservation" }));
      }
      return RestResult.Parse(context, oreturny);
    });
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



