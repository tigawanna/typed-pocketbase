import { exec } from "child_process";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

export async function runCommand(command: string): Promise<string> {
  try {
    const { stdout, stderr } = await new Promise<{
      stdout: string;
      stderr: string | null;
    }>((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ stdout, stderr });
      });
    });

    if (stderr) {
      console.error("Command errors:", stderr);
    }

    return stdout.toString();
  } catch (error) {
    console.error("Error running command:", error);
    throw error; // Re-throw for further handling if needed
  }
}


const PB_TYPES_DIR = "./sample/types";
const filter_collection = "";

export async function callCliDirectly() {
  const url = process.env.PB_URL;

  const email = process.env.PB_TYPEGEN_EMAIL;
  const password = process.env.PB_TYPEGEN_PASSWORD;

  if (!url || !email || !password) {
    throw new Error("Missing required environment variables: PB_URL, PB_EMAIL, PB_PASSWORD");
  }
  const commands = [
		'dist/codegen/cli.js',
		'--email',
		email,
		'--password',
		password,
    "--type",
    'zod,ts',
	];
  if (url && url.length > 0) {
    commands.push("--url", url);
  }
  if (PB_TYPES_DIR && PB_TYPES_DIR.length > 0) {
    commands.push("--dir", PB_TYPES_DIR);
  }
  if (filter_collection) {
    commands.push("--filter", filter_collection);
  }
  const output = await runCommand(commands.join(" "));
  return output;
}

callCliDirectly()
  .then((output) => {
    console.log("=== output ===", output);
  })
  .catch((error) => {
    console.error(error);
  });
