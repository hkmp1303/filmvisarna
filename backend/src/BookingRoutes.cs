using MailKit;

namespace WebApp;

public static class BookingRoutes
{
    private static void SendBookingConfirmation(string email, string guid)
    {
        EmailService.SendEmail(email, "Filmvisarna Bokningsbekräftelse",
            $"Se din bokningsbekräftelse online <a href=\"http://localhost:5173/confirmbooking/{guid}\">här</a>."
        );
    }
    public static void Start()
    {
        App.MapGet("/api/bookingByGuid/{guid}", async (HttpContext context, string guid) => RestResult.Parse(context,
            SQLQueryOne("SELECT * FROM booking WHERE guid=@guid AND `status`='booked' LIMIT 1;", Obj(new { guid }), context)
        ));

        App.MapPost("/api/resendBookingLink", async (
            HttpContext context, JsonElement bodyJson
        ) =>
        {
            var currUser = Session.Get(context, "user");
            var body = JSON.Parse(bodyJson.ToString());
            body.userid = currUser == null ? null : currUser.userid; // session check
            if (body.userid == null)
            {
                context.Response.StatusCode = 404;
                return RestResult.Parse(context, Obj(new { message = "Användare inte inloggad." }));
            }
            var result = SQLQueryOne(
                $@"SELECT email FROM booking JOIN user USING(userid) WHERE `guid` = @guid AND userid = @userid;",
                Obj(new { guid = body.guid, userid = body.userid }),
            context);
            if (!result.HasKey("email"))
            {
                context.Response.StatusCode = 404;
                return RestResult.Parse(context, Obj(new { message = "Användaren måste vara inloggad." }));
            }
            SendBookingConfirmation(result.email, body.guid);
            return RestResult.Parse(context, Obj(new { message = "E-post har skickats." }));

        });

        App.MapGet("/api/bookedSeatRes/{screeningid}", async (
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
            var result = SQLQueryOne(
                $@"UPDATE booking SET `status` = 'booked', total_cost = @total_cost
                WHERE `status` = 'reserved' AND `guid` = @guid;",
                Obj(new { total_cost = body.total_cost, guid = body.guid }),
            context);
            // prevent sending duplicate emails
            if (result.HasKey("rowsAffected") && result.rowsAffected == 1)
            {
                SendBookingConfirmation(body.email, body.guid);
            }
            return RestResult.Parse(context, result);
        });

        App.MapPost("/api/cancelBooking", async (
            HttpContext context, JsonElement bodyJson
        ) =>
        {
            var body = JSON.Parse(bodyJson.ToString());
            return RestResult.Parse(context,
                SQLQueryOne(
                    $@"UPDATE booking SET `status` = 'canceled', total_cost = @total_cost
                    WHERE `status` = 'booked' AND `guid` = @guid;",
                    Obj(new { guid = body.guid }),
                context)
            );
        });

        App.MapGet("/api/reservedSeatRes/{guid}", async (
            HttpContext context, string guid
        ) =>
        {
            return RestResult.Parse(context, SQLQuery(
                $@"SELECT reservationid, seat_number, `row_number`
                FROM booking
                    JOIN reservation USING(bookingid)
                WHERE `guid` = @guid
            ;", Obj(new { guid }), context));
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
            body.userid = currUser == null ? null : currUser.userid; // session check
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


            result = SQLQueryOne($@"SELECT bookingid, userid, salonid FROM booking
                    JOIN screening USING(screeningid)
                WHERE screeningid=@screeningid AND `guid`=@guid AND `status`='reserved';",
                Obj(new { screeningid = body.screeningid, guid = body.guid }),
                context
            );
            bool bookingok = false;
            try
            {
                body.bookingid = (UInt32)result.bookingid;
                body.salonid = (UInt32)result.salonid;
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
            }

            result = SQLQuery(
                $@"SELECT seat_number, bookingid
                FROM reservation
                    JOIN booking USING(bookingid)
                WHERE screeningid = @screeningid;",
                Obj(new { screeningid = body.screeningid }),
                context
            );
            try
            {
                var selectedSeats = body.seat as Arr;
                body.selected_seat = (UInt32)selectedSeats[0];
                Console.WriteLine("salonid " + body.salonid);
                Console.WriteLine("selectedSeat " + selectedSeats.Count());
                string seatFound = "";
                Console.WriteLine("result " + result);
                if (result.Length > 0)
                {
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
                        $@"DELETE FROM reservation WHERE seat_number = @seat_number ABD bookingid = @bookingid",
                        Obj(new { seat_number = body.seat_number, bookingid = body.bookingid }),
                        context
                    );
                }
                else
                {
                    Console.WriteLine("selectedSeats " + selectedSeats[0]);
                    result = SQLQueryOne(
                        $@"INSERT INTO reservation (seat_number, `row_number`, bookingid) VALUES (
                            @seat_number,
                            0,
                            @bookingid
                        );
                        CALL calc_row_number(@salonid, @seat_number, LAST_INSERT_ID());",
                        Obj(new { seat_number = body.selected_seat, body.salonid, bookingid = body.bookingid }),
                        context
                    );
                    Console.WriteLine("res " + result);
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