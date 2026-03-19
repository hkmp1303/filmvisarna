namespace WebApp;

public static class BookingRoutes
{
    public static void Start()
    {
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
                try
                {
                    body.bookingid = result.bookingid;
                    bookingok = true;
                }
                catch { }
                if (bookingok)
                {
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
                else
                {
                    context.Response.StatusCode = 404;
                    return RestResult.Parse(context, Obj(new { error = "Invalid reservation guid." }));
                }
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
            try
            {
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
            catch (Exception e)
            {
                return RestResult.Parse(context, Obj(new { error = "Kunde inte spara reservation" }));
            }
            return RestResult.Parse(context, oreturny);
        });
    }
}