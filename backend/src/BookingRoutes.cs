namespace WebApp;

public static class BookingRoutes
{
    public static void Start()
    {
        App.MapGet("/api/bookedSeatRes/{screeningid}", (
            HttpContext context, string screeningid
        ) =>
            RestResult.Parse(context, SQLQuery(
                $@"SELECT r.seat_number, r.row_number
                FROM booking b
                    INNER JOIN reservation r ON b.bookingid = r.bookingid
                WHERE b.screeningid = @screeningid
                    AND b.status != 'canceled'
                ORDER BY r.seat_number;",
                Obj(new { screeningid }),
                context
            ))
        );

        App.MapPost("/api/reserveSeatRes/{screeningid}", (
            HttpContext context, string screeningid, JsonElement bodyJson
        ) =>
        {
            var body = JSON.Parse(bodyJson.ToString());
            body.screeningid = screeningid;

            var sessionUser = Session.Get(context, "user");
            int? userid = null;
            try { userid = (int?)sessionUser?.userid; } catch { }

            string guid = (string)body.guid;
            if (string.IsNullOrEmpty(guid)) guid = Guid.NewGuid().ToString();

            int bookingid;

            bool isFirstRes = true;
            var checkExisting = SQLQueryOne(
                "SELECT bookingid FROM booking WHERE guid = @guid;",
                Obj(new { guid }),
                context
            );
            if (checkExisting != null)
            {
                isFirstRes = false;
            }

            if (isFirstRes)
            {
                SQLQuery(
                    @"INSERT INTO booking (total_cost, `date`, `guid`, `status`, screeningid, userid)
                      VALUES (@total_cost, NOW(), @guid, 'reserved', @screeningid, @userid);",
                    Obj(new {
                        total_cost = body.total_cost,
                        guid,
                        userid,
                        screeningid
                    }),
                    context
                );
                var newBooking = SQLQueryOne(
                    "SELECT bookingid FROM booking WHERE guid = @guid;",
                    Obj(new { guid }),
                    context
                );
                bookingid = (int)newBooking.bookingid;
            }
            else
            {
                guid = (string)body.guid;
                var existing = SQLQueryOne(
                    @"SELECT bookingid FROM booking
                      WHERE screeningid = @screeningid AND guid = @guid AND `status` = 'reserved';",
                    Obj(new { screeningid, guid }),
                    context
                );
                if (existing == null)
                {
                    context.Response.StatusCode = 404;
                    return RestResult.Parse(context, Obj(new { error = "Ogiltig bokningsreferens." }));
                }
                bookingid = (int)existing.bookingid;
                SQLQuery(
                    @"UPDATE booking SET total_cost = @total_cost, `date` = NOW(), userid = @userid
                      WHERE bookingid = @bookingid;",
                    Obj(new { total_cost = body.total_cost, userid, bookingid }),
                    context
                );
            }

            var selectedSeats = new List<int>();
            try { foreach (var s in body.seat) selectedSeats.Add((int)s); } catch { }

            var existingSeats = SQLQuery(
                "SELECT seat_number FROM reservation WHERE bookingid = @bookingid;",
                Obj(new { bookingid }),
                context
            );
            var existingSeatNums = new List<int>();
            try { foreach (var r in existingSeats) existingSeatNums.Add((int)r.seat_number); } catch { }

            foreach (var seatNum in existingSeatNums)
            {
                if (!selectedSeats.Contains(seatNum))
                    SQLQuery(
                        "DELETE FROM reservation WHERE bookingid = @bookingid AND seat_number = @seat_number;",
                        Obj(new { bookingid, seat_number = seatNum }),
                        context
                    );
            }

            foreach (var seatNum in selectedSeats)
            {
                if (!existingSeatNums.Contains(seatNum))
                    SQLQuery(
                        @"INSERT INTO reservation (seat_number, `row_number`, bookingid)
                          VALUES (@seat_number, 0, @bookingid);",
                        Obj(new { seat_number = seatNum, bookingid }),
                        context
                    );
            }

            return RestResult.Parse(context, Obj(new { guid }));
        });

        App.MapPost("/api/sendBookingEmail", (
            HttpContext context, JsonElement bodyJson
        ) =>
        {
            var body = JSON.Parse(bodyJson.ToString());
            string email = (string)body.email;
            string guid = (string)body.guid;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(guid))
            {
                context.Response.StatusCode = 400;
                return RestResult.Parse(context, Obj(new { error = "E-post och boknings-ID krävs." }));
            }

            var booking = SQLQueryOne(
                @"SELECT b.bookingid, b.total_cost, b.guid,
                         s.start, f.title, sa.room_number
                  FROM booking b
                  INNER JOIN screening s USING(screeningid)
                  INNER JOIN film f USING(filmid)
                  INNER JOIN salon sa USING(salonid)
                  WHERE b.guid = @guid AND b.status = 'reserved';",
                Obj(new { guid }),
                context
            );

            if (booking == null)
            {
                context.Response.StatusCode = 404;
                return RestResult.Parse(context, Obj(new { error = "Bokning hittades inte." }));
            }

            var seats = SQLQuery(
                "SELECT seat_number FROM reservation WHERE bookingid = @bookingid ORDER BY seat_number;",
                Obj(new { bookingid = booking.bookingid }),
                context
            );

            var seatList = new List<string>();
            foreach (var s in seats) seatList.Add(((int)s.seat_number).ToString());
            string seatStr = string.Join(", ", seatList);

            string subject = $"Din bokning hos Filmvisarna – {booking.title}";
            string htmlBody = $@"
                <h2>Tack för din bokning!</h2>
                <p><b>Film:</b> {booking.title}</p>
                <p><b>Salong:</b> {booking.room_number}</p>
                <p><b>Datum:</b> {booking.start}</p>
                <p><b>Platser:</b> {seatStr}</p>
                <p><b>Totalt:</b> {booking.total_cost} kr</p>
                <p><b>Boknings-ID:</b> {guid}</p>
                <br>
                <p>Välkommen till Filmvisarna!</p>";

            try
            {
                EmailService.SendEmail(email, subject, htmlBody);
                return RestResult.Parse(context, Obj(new { success = true }));
            }
            catch (Exception ex)
            {
                Console.WriteLine("Email error: " + ex.Message);
                context.Response.StatusCode = 500;
                return RestResult.Parse(context, Obj(new { error = "Kunde inte skicka e-post." }));
            }
        });

        App.MapGet("/api/booking/byid/{bookingid}", (
            HttpContext context, string bookingid
        ) =>
        {
            var booking = SQLQueryOne(
                "SELECT guid FROM booking WHERE bookingid = @bookingid AND status != 'canceled';",
                Obj(new { bookingid }),
                context
            );
            if (booking == null)
            {
                context.Response.StatusCode = 404;
                return RestResult.Parse(context, Obj(new { error = "Bokning hittades inte." }));
            }
            return RestResult.Parse(context, Obj(new { guid = booking.guid }));
        });

        App.MapGet("/api/booking/{guid}", (
            HttpContext context, string guid
        ) =>
        {
            var booking = SQLQueryOne(
                @"SELECT b.bookingid, b.total_cost, b.guid, b.status,
                         s.start, f.title, f.cover_image, sa.room_number
                  FROM booking b
                  INNER JOIN screening s USING(screeningid)
                  INNER JOIN film f USING(filmid)
                  INNER JOIN salon sa USING(salonid)
                  WHERE b.guid = @guid AND b.status != 'canceled';",
                Obj(new { guid }),
                context
            );

            if (booking == null)
            {
                context.Response.StatusCode = 404;
                return RestResult.Parse(context, Obj(new { error = "Bokning hittades inte." }));
            }

            var seats = SQLQuery(
                "SELECT seat_number FROM reservation WHERE bookingid = @bookingid ORDER BY seat_number;",
                Obj(new { bookingid = booking.bookingid }),
                context
            );

            var seatList = new List<int>();
            foreach (var s in seats) seatList.Add((int)s.seat_number);

            return RestResult.Parse(context, Obj(new
            {
                guid = booking.guid,
                status = booking.status,
                title = booking.title,
                cover_image = booking.cover_image,
                start = booking.start,
                room_number = booking.room_number,
                total_cost = booking.total_cost,
                seats = seatList
            }));
        });
    }
}
