// import prompts from 'prompts';
import { GPT_API_KEY } from "./api-keys.ts";
import OpenAI from 'openai';
import { contexts } from './contexts.ts';
import { stdin as input, stdout as output } from 'process';
output.setEncoding('utf8');
input.setEncoding('utf8');

const MAXLINELENGTH = 80;
const openai = new OpenAI({
  apiKey: GPT_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});
const conversation: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[] = [];
const secretContexts = new Set<string>(['julie', 'tim']);
const availiableNames = Object.keys(contexts).filter(c => !secretContexts.has(c));
let curentContextName = availiableNames[0];

function echo(msg: string) {
  output.write(`${msg}\n`);
}
function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}

async function longEcho(msg: string) {
  const lines = msg.split('\n')
    .reduce((acc, line) => {
      for (let i = 0; i < line.length; i += MAXLINELENGTH) {
        acc.push(line.slice(i, i + MAXLINELENGTH))
      }
      return acc;
    }, [] as string[])
  for (let i = 0; i < lines.length; i++) {
    echo(lines[i])
    await wait(100)
  }
}

async function ask(question: string): Promise<string> {
  await longEcho(question);
  echo('\n');
  return new Promise(resolve => {
    function onData(str) {
      return resolve(str);
    };
    input.once('data', onData);
  })
}

function formatResponse(completion: OpenAI.Chat.Completions.ChatCompletion) {
  let lines = completion.choices[0].message.content!
    .replace(new RegExp(`^${curentContextName}:`, 'i'), '')
    .split('\n')
  const split = lines.findIndex(e => e.match(/^\w+: /i));
  if (split > 0) {
    lines = lines.slice(0, split)
  }
  return lines.join('\n')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim();
}

async function startConversation(name: string) {
  curentContextName = name;
  conversation.length = 0
  echo(`Appel du 3615 ${getName(name)}...`)
  await wait(1000)
  echo(`${getName(name)} est en ligne!`);
  conversation.push({
    role: 'system',
    content: contexts[name].context
  });
  const intro = contexts[name].intro;
  return askToUser(`${getName(name)}: ${intro}`);
}
function getName(str: string) {
  return curentContextName.slice(0, 1).toUpperCase() + curentContextName.slice(1);
}

async function askToUser(message: string) {
  conversation.push({ role: 'assistant', content: message });
  const response = await ask(message)!;
  echo('\n');
  const reg = new RegExp(/3615\s*(\w+)/i);
  if (response.match(reg)) {
    let name = response.match(reg)![1].trim().toLocaleLowerCase();
    if (!contexts[name]) {
      echo(`Désolé, ${name} n'est pas dans notre annuraire.`);
      echo(`Voici la liste des personnes que vous pouvez appeler:`);
      echo(availiableNames.map(n => `  - ${n}`).join('\n'));
      return askToUser('Qui voulez-vous appeler ?');
    }
    if (Math.random() < 0.05) {
      echo(`Désolé, ${name} n'est pas en ligne, mais Julie va vous répondre.`);
      name = 'julie';
    }
    return startConversation(name);
  } else {
    conversation.push({ role: 'user', content: response });
  }

  const completion = await openai.chat.completions.create({
    messages: conversation,
    model: 'gpt-4',
    max_tokens: MAXLINELENGTH,
    temperature: 0.5,
  });

  if (!completion.choices || !completion.choices.length) {
    return askToUser("Désolé, je n'ai pas compris votre demande. Pouvez-vous reformuler?");
  } else {

    const response = formatResponse(completion);
    return askToUser(`${getName(curentContextName)}: ${response}`);
  }
}

async function main() {
  echo(new Array(60).fill('').join('\n'));
  const response = await startConversation('tim');
}


await main();

