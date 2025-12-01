import Bun from "bun";

export default async function* readLinesIterator(filePath: string): AsyncGenerator<string> {
  const file = Bun.file(filePath);
  const reader = file.stream().getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (buffer.length > 0) yield buffer;
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop()!;

    for (const line of lines) {
      yield line;
    }
  }
}
