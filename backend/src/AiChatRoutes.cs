namespace WebApp;

public static class AiChatRoutes
{
    private static string aiAccessToken = "";
    private static string systemPrompt = "";
    private static readonly string proxyUrl = "https://ai-api.nodehill.com";
    private static readonly HttpClient httpClient = new HttpClient();

    public static void Start()
    {
        LoadConfig();
        LoadSystemPrompt();

        App.MapPost("/api/chat", async (HttpContext context, JsonElement bodyJson) =>
        {
            try
            {
                var body = JSON.Parse(bodyJson.ToString());
                var messages = (Arr)body.messages;

                var moviesFromDb = SQLQuery("SELECT * FROM ai_movie_context");

                string movieContext = "\n--- AKTUELLT PROGRAM OCH DETALJERAD INFO ---\n";

                if (moviesFromDb != null && moviesFromDb.Count() > 0)
                {
                    foreach (var m in moviesFromDb)
                    {
                        Console.WriteLine("DB RAD: " + JSON.Stringify(m));

                        string title = m["movie_title"]?.ToString() ?? "Okänd";
                        string genre = m["movie_genre"]?.ToString() ?? "Ej angiven";
                        string rating = m["movie_viewer_rating"]?.ToString() ?? "Ej betygsatt";
                        string duration = m["movie_duration"]?.ToString() ?? "?";
                        string lang = m["movie_language"]?.ToString() ?? "Svenska";
                        string sub = m["movie_subtitle"]?.ToString() ?? "Ingen";
                        string time = m["start_time"]?.ToString() ?? "Okänd tid";
                        if (m["start_time"] != null)
                        {
                            DateTime dt = DateTime.Parse(m["start_time"].ToString());
                            time = dt.ToString("HH:mm (dd MMM)");
                        }
                        string salon = m["salon_name"]?.ToString() ?? "Okänd salong";
                        string desc = m["movie_description"]?.ToString() ?? "";

                        // Vi bygger en kompakt men informationsrik sträng för varje föreställning
                        movieContext += $"FILM: {title} | GENRE: {genre} | BETYG: {rating} | LÄNGD: {duration} min\n";
                        movieContext += $"SPRÅK: {lang} (Text: {sub})\n";
                        movieContext += $"VISAS: {time} i {salon}\n";
                        movieContext += $"OM FILMEN: {desc}\n";
                        movieContext += "-----------------------------------\n";
                    }
                }
                else
                {
                    movieContext += "Just nu finns inga filmer i databasen.";
                }

                var fullMessages = Arr();
                string finalSystemInstruction = systemPrompt + "\n" + movieContext;

                fullMessages.Push(Obj(new { role = "system", content = finalSystemInstruction }));

                if (messages != null)
                {
                    messages.ForEach(msg => fullMessages.Push(msg));
                }

                var requestBody = Obj(new { messages = fullMessages });
                var request = new HttpRequestMessage(HttpMethod.Post, $"{proxyUrl}/v1/chat/completions");
                request.Headers.Add("Authorization", $"Bearer {aiAccessToken}");
                request.Content = new StringContent(
                    JSON.Stringify(requestBody),
                    System.Text.Encoding.UTF8,
                    "application/json"
                );

                var response = await httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return RestResult.Parse(context, JSON.Parse(responseContent));
                }

                return RestResult.Parse(context, JSON.Parse(responseContent));
            }
            catch (Exception ex)
            {
                Console.WriteLine("FEL I CHATT: " + ex.Message);
                return RestResult.Parse(context, new { error = ex.Message });
            }
        });
    }

    private static void LoadConfig()
    {
        try
        {
            var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "db-config.json");
            var config = JSON.Parse(File.ReadAllText(configPath));
            aiAccessToken = (string)config.aiAccessToken;
        }
        catch (Exception ex) { Log("Error loading config:", ex.Message); }
    }

    private static void LoadSystemPrompt()
    {
        try
        {
            var promptPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "system-prompt.md");
            if (File.Exists(promptPath)) systemPrompt = File.ReadAllText(promptPath);
        }
        catch (Exception ex) { Log("Error loading prompt:", ex.Message); }
    }
}

/*
CREATE OR REPLACE VIEW ai_movie_context AS
SELECT 
    f.title AS movie_title, 
    f.duration AS movie_duration,
    f.genre AS movie_genre,
    f.viewer_rating AS movie_viewer_rating,
    f.details AS movie_details,
    f.`language` AS movie_language,
    f.subtitle_language AS movie_subtitle,
    s.start AS start_time,
    salon.description  AS salon_name,
    f.description AS movie_description
FROM screening s
JOIN film f ON s.filmid = f.filmid
JOIN salon ON s.salonid = salon.salonid
WHERE s.start > NOW()
ORDER BY s.start ASC;

*/