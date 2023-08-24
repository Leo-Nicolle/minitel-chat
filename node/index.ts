import prompts from 'prompts';
import {GPT_API_KEY} from "./api-keys.ts";
import OpenAI from 'openai';
// import ProgressBar from 'progress';

// function waitBar(titles: string[], steps = 10, interval = 100){
//   let tick = 0;
//   return new Promise((resolve) => {
//   let id = setInterval(() => {  
//     const bar = new ProgressBar(':title\:', { total: steps });
//     bar.tick({ title: titles[Math.min(tick++ , titles.length-1)] });
//     if (bar.complete) {
//       clearInterval(id);
//       resolve(0);
//     }
//   }, interval);
//   });
// }

process.stdin.on('keypress', (str, key) => {
  console.log(str, key);
  // if (key.ctrl && key.name === 'c') {
  //   process.exit();
  // } else {
  //   console.log(`You pressed the "${str}" key`);
  //   console.log();
  //   console.log(key);
  //   console.log();
  // }
});

const openai = new OpenAI({
  apiKey: GPT_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

async function askToUser(message: string){
  conversation.push({ role: 'assistant', content: message });
  const response = await prompts({
    type: 'text',
    name: 'value',
    message,
  });
  conversation.push({ role: 'user', content: response.value });
  const completion = await openai.chat.completions.create({
    messages: conversation,
    model: 'gpt-3.5-turbo',
    temperature: 0.5
  });

  if(!completion.choices || !completion.choices.length) {
    return askToUser("Désolé, je n'ai pas compris votre demande. Pouvez-vous reformuler?");
  }else{
    return askToUser(completion.choices[0].message.content!);
  }
}

const conversation: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[] = [];
async function main() {
  const response = await askToUser('Bonjour, comment puis-je vous aider?');
}


main();