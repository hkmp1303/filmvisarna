using System.Text;
namespace WebApp;

public static class RecoverPassword
{


    public static void Start()
    {

        string pwdList = "123456789qwertyuiopasdfghjklzxcvbnm";
        Random rnd = new();

        int pwdLength = 10;
        StringBuilder newRndPass = new(); // Använd StringBuilder för prestanda

        for (int i = 0; i < pwdLength; i++)
        {
            int position = rnd.Next(0, pwdList.Length);
            newRndPass.Append(pwdList[position]);
        }

        string finalPassword = newRndPass.ToString();
        Console.WriteLine(finalPassword);


        App.MapPut("/api/recoverpassword", (HttpContent context, JsonElement bodyJson) =>
        {

            var dbUser = SQLQueryOne(
                "SELECT * FROM user WHERE email = @email"
             );


            if (dbUser == null)
            {
                return RestResult.Parse(context, new { error = "No such user." });
            }
            else
            {
                var newPassword = SQLQuery(
                    "UPDATE user SET password = '{finalPassword}' WHERE email = @email* "
                );
            }
        });
    }


}







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