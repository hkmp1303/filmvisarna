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
                    `row_number`,
                    `status`
                FROM booking
                    INNER JOIN reservation USING(bookingid)
                WHERE screeningid = @screeningid
                    AND( `status`='booked'
                        OR (`status`='reserved' /*AND NOW() < DATE_ADD(`date`, INTERVAL 15 MINUTE)*/)
                    )
                ORDER BY `seat_number` ASC
                ;",
                ReqBodyParse("booking", Obj(new { screeningid })).body,
                context
            ))
        );
        App.MapPost("/api/finalizeBooking", async (
            HttpContext context, JsonElement bodyJson
        ) =>
        {
            var body = JSON.Parse(bodyJson.ToString());
            SQLQueryOne($@"UPDATE booking SET `status` = 'booked' WHERE `guid` = @guid;", Obj(new { guid = body.guid }), context);
            return RestResult.Parse(context, Obj(new { ok = "ok" }));
        });
        App.MapPost("/api/reserveSeatRes/{screeningid}", async (
            HttpContext context, string screeningid, JsonElement bodyJson
        ) =>
        {
            var body = JSON.Parse(bodyJson.ToString());
            dynamic result;
            dynamic oreturny = new Obj();
            body.screeningid = screeningid;
            var currUser = Session.Get(context, "user");
            body.userid = currUser == null ? null: currUser.userid; // session check
            Console.WriteLine("userid "+ body.userid);
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
                        screeningid = body.screeningid,
                        userid = body.userid
                    }),
                    context
                );

            }


            result = SQLQueryOne($@"SELECT bookingid, userid FROM booking
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
            if (!bookingok)
            {
                context.Response.StatusCode = 404;
                return RestResult.Parse(context, Obj(new { error = "Invalid reservation guid." }));
            }
            if (!isFirstRes)
            {
                result = SQLQueryOne(
                    $@"UPDATE booking SET
                        total_cost = @total_cost,
                        `date` = NOW(),
                        userid = @userid
                    WHERE bookingid=@bookingid;",
                    Obj(new { total_cost = body.total_cost, userid = body.userid ?? result.userid, bookingid = body.bookingid }),
                    context
                );
                Console.WriteLine(result);
            }

            result = SQLQuery(
                $@"SELECT seat_number, bookingid
                FROM reservation
                    JOIN booking USING(bookingid)
                WHERE screeningid = @screeningid;",
                Obj(new { screeningid = body.screeningid }),
                context
            );
            Console.WriteLine(bodyJson.GetProperty("seat"));
            //Console.WriteLine(body.GetValue("seat[]"));
            // foreach(dynamic i in body) {
            try
            {
                Console.WriteLine("FUCKKKK");
                var selectedSeats = body.seat as Arr;
                Console.WriteLine("selectedSeat "+ selectedSeats.Count());
                string seatFound = "";
                Console.WriteLine("result "+result);
                if (result.Length > 0) {
                    foreach (dynamic res in result)
                    {
                        Console.WriteLine(res.seat_number);
                        if (selectedSeats.Contains(res.seat_number) && body.bookingid == res.bookingid)
                        {
                            seatFound = res.seat_number;
                            continue;
                        }

                    }
                }
                if (seatFound.Length > 0)
                {
                    SQLQueryOne(
                            $@"DELTE FROM reservation WHERE seat_number = @seat_number ABD bookingid = @bookingid",
                            Obj(new { seat_number = body.seat_number, bookingid = body.bookingid }),
                            context
                        );
                }
                else
                {
                    Console.WriteLine("selectedSeats "+ selectedSeats[0]);
                    result = SQLQueryOne(
                        $@"INSERT INTO reservation (seat_number, `row_number`, bookingid) VALUES (
                            @seat_number,
                            @row_number,
                            @bookingid
                        )",
                        Obj(new { seat_number = UInt32.Parse(""+selectedSeats[0]), row_number = 0, bookingid = body.bookingid }),
                        context
                    );
                    Console.WriteLine("res "+ result);
                }
                oreturny.guid = body.guid;
            }
            catch (Exception e)
            {
                return RestResult.Parse(context, Obj(new { error = e.Message }));
            }
            return RestResult.Parse(context, oreturny);
        });
    }
}