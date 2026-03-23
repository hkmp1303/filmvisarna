using MailKit;

namespace WebApp;

public static class BookingRoutes
{
    private static void SendBookingConfirmation(string email, string guid)
    {
        try {
            EmailService.SendEmail(email, "Filmvisarna Bokningsbekräftelse",
                $"Se din bokningsbekräftelse online <a href=\"http://localhost:5173/confirmbooking/{guid}\">här</a>."
            );
        } catch {}
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
            HttpContext context, string screeningid, string guid = ""
        ) =>
        {
            Console.WriteLine("guid: " + guid);
            return RestResult.Parse(context, SQLQuery(
                $@"SELECT
                    `seat_number`,
                    `row_number`,
                    IF(`guid`=@guid AND `status`='reserved', `status`, 'booked') AS `status`
                FROM booking
                    INNER JOIN reservation USING(bookingid)
                WHERE screeningid = @screeningid
                    AND( `status`='booked'
                        OR (`status`='reserved' /*AND NOW() < DATE_ADD(`date`, INTERVAL 15 MINUTE)*/)
                    )
                ORDER BY `seat_number` ASC
                ;",
                ReqBodyParse("booking", Obj(new { guid, screeningid })).body,
                context
            ));
        });

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
            body.userid = currUser != null && currUser.userid ? currUser.userid : null; // session check
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

            result = SQLQueryOne(
                $@"SELECT bookingid, userid, salonid FROM booking
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
                WHERE screeningid = @screeningid AND(`status` = 'booked'
                    OR(`status` = 'reserved' /*AND DATE_ADD(`date`, INTERVAL 15 MINUTE) < NOW()*/)
                );",
                Obj(new { screeningid = body.screeningid }),
                context
            );
            try
            {
                var selectedSeats = new List<UInt32>(); // from ui
                foreach (var seat in body.seat)
                    selectedSeats.Add((UInt32)seat);
                var reservedSeats = new List<UInt32>(); // from db
                Console.WriteLine("count: "+selectedSeats.Count);
                foreach (dynamic res in result) {
                    if (res.bookingid == body.bookingid)
                    {
                        reservedSeats.Add((UInt32)res.seat_number);
                    }
                    else if (selectedSeats.Contains((UInt32)res.seat_number))
                    {
                        return RestResult.Parse(context, Obj(new{ error = "Seat already taken" }));
                    }
                }
                Console.WriteLine("test");
                var seatsNotFound = selectedSeats.Except(reservedSeats); // to insert
                Console.WriteLine("test2");
                var seatsFound = reservedSeats.Except(selectedSeats); // to delete

                foreach (var seatNum in seatsFound)
                {
                    SQLQueryOne(
                        $@"DELETE FROM reservation WHERE seat_number = @seat_number AND bookingid = @bookingid",
                        Obj(new { seat_number = seatNum, bookingid = body.bookingid }),
                        context
                    );
                }
                foreach (var seatNum in seatsNotFound)
                {
                    SQLQueryOne(
                        $@"INSERT INTO reservation (seat_number, `row_number`, bookingid) VALUES (
                            @seat_number,
                            0,
                            @bookingid
                        );
                        CALL calc_row_number(@salonid, @seat_number, LAST_INSERT_ID());",
                        Obj(new { seat_number = seatNum, body.salonid, bookingid = body.bookingid }),
                        context
                    );
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