namespace WebApp;

public static class ProfileRoutes
{
  public static void Start()
  {
    App.MapGet("/api/profile", (HttpContext context) =>
    {
      var user = Session.Get(context, "user");

      if (user == null)
      {
        return RestResult.Parse(context, new { error = "Inte inloggad" });
      }

      var activeBookings = DbQuery.SQLQuery(
              "SELECT * FROM booking WHERE userid = @id AND status = 'booked'",
              new { id = user.id }
          );

      var history = DbQuery.SQLQuery(
              "SELECT * FROM booking WHERE userid = @id AND status != 'booked'",
              new { id = user.id }
          );

      return RestResult.Parse(context, new
      {
        user,
        activeBookings,
        history
      });
    });


    App.MapGet("/api/profileinformation", (HttpContext context) =>
        {
          var user = Session.Get(context, "user");
          if (user == null)
          {
            return RestResult.Parse(context, new { error = "Not logged in" });
          }

          int userId = (int)user.userid;

          var active = SQLQuery(
            @"SELECT id, userid, movieTitle, showtime, poster
              FROM user_booking_view
              WHERE userid = @userid
                AND status = 'booked'
                AND showtime >= NOW()
              ORDER BY showtime ASC",
          Obj(new { userid = userId }),
          context

          );

          var history = SQLQuery(
             @"SELECT id, userid, movieTitle, showtime, poster
               FROM user_booking_view
              WHERE userid = @userid
                AND status = 'booked'
                AND showtime < NOW()
              ORDER BY showtime DESC",
          Obj(new { userid = userId }),
          context
         );


          return RestResult.Parse(context, Obj(new
          {
            user,
            activeBookings = active,
            history
          }));
        });
  }
}














// #######################################
// #                                     #
// #           Previous RestApi.cs       # 
// #               Code Below            #
// #                                     #
// #######################################




// App.MapGet("/api/profileinformation", (HttpContext context) =>
//     {
//       var user = Session.Get(context, "user");
//       if (user == null)
//       {
//         return RestResult.Parse(context, new { error = "Not logged in" });
//       }

//       int userId = (int)user.userid;

// var active = SQLQuery(
// @"SELECT userid, movieTitle, showtime
//           FROM user_booking_view
//           WHERE userid = @userid
//             AND status = 'booked'
//             AND showtime >= NOW()
//           ORDER BY showtime ASC",
// Obj(new { userid = userId }),
// context
// );

// var history = SQLQuery(
// @"SELECT userid, movieTitle, showtime
//           FROM user_booking_view
//           WHERE userid = @userid
//             AND status = 'booked'
//             AND showtime < NOW()
//           ORDER BY showtime DESC",
// Obj(new { userid = userId }),
// context
// );

// return RestResult.Parse(context, Obj(new
// {
//   user,
//   activeBookings = active,
//   history
// }));
//     });