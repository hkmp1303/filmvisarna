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

                var moviesFromDb = SQLQuery("SELECT * FROM film");

                string movieContext = "\nVIKTIGT: Du får ENDAST svara baserat på dessa filmer från vår databas:\n";

                if (moviesFromDb != null && moviesFromDb.Count() > 0)
                {
                    foreach (var movie in moviesFromDb)
                    {
                        Console.WriteLine("DB RAD: " + JSON.Stringify(movie));

                        string title = movie["title"]?.ToString()
                                    ?? movie["Title"]?.ToString()
                                    ?? movie["titel"]?.ToString()
                                    ?? "Okänd titel";

                        movieContext += $"- {title}\n";
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