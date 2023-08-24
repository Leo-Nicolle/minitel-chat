import prompts from "prompts";
import OpenAI from "openai";
const GPT_API_KEY = "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";
process.stdin.on("keypress", (str, key) => {
  console.log(str, key);
});
const openai = new OpenAI({
  apiKey: GPT_API_KEY
  // defaults to process.env["OPENAI_API_KEY"]
});
async function askToUser(message) {
  conversation.push({ role: "assistant", content: message });
  const response = await prompts({
    type: "text",
    name: "value",
    message
  });
  conversation.push({ role: "user", content: response.value });
  const completion = await openai.chat.completions.create({
    messages: conversation,
    model: "gpt-3.5-turbo",
    temperature: 0.5
  });
  if (!completion.choices || !completion.choices.length) {
    return askToUser("Désolé, je n'ai pas compris votre demande. Pouvez-vous reformuler?");
  } else {
    return askToUser(completion.choices[0].message.content);
  }
}
const conversation = [];
async function main() {
  await askToUser("Bonjour, comment puis-je vous aider?");
}
main();
