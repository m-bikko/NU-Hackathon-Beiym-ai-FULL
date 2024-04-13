const express = require("express");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(express.json());
const configuration =  new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
app.post("/find-complexity", async (req, res) =>{
    try{
        const { preferences } = req.body;
        const prompt = `Ты ассистент преподователей в частной школе, ты должен ` +
                              `будешь объяснить что сайт имеет в себе ` +
                              `инфографики и за что они отвечают. Ты имеешь в себе line-chart за успеваемость, ` +
                              `bar-chart за процент правильных ответов, ` +
                              `самые часто задаваемый вопросы, самые сложные темы. `+
                              `Надеюсь ты понял кем ты являешься. Теперь вопрос клиента: \n${preferences}`;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 150,  // You can adjust this based on how detailed you want the response to be
            temperature: 0.5  // A lower temperature for more deterministic output
        });
        return res.status(200).json({
            success: true,
            data: response.data.choices[0].text.trim(),
            message: "Working",
        });
    }catch (error){
        return  res.status(400).json({
            success: false,
            error: error.response
            ? error.response.data
                : "There was an issue on the server"
        });
    }
});
const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server listening on port ${port}`));
