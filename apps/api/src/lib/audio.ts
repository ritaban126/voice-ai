// PURPOSE: converts browser audio (webm/ogg) to 16kHz mono wav with the ffmpeg program, if Gnani needs wav.
import { spawn } from 'node:child_process';

export function toWav(input: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', ['-loglevel', 'error', '-i', 'pipe:0', '-ac', '1', '-ar', '16000', '-f', 'wav', 'pipe:1']);
    const chunks: Buffer[] = [];
    ff.stdout.on('data', (c: Buffer) => chunks.push(c));
    ff.on('error', (err) => reject(new Error(`ffmpeg not available: ${err.message}`)));
    ff.on('close', (code) => (code === 0 ? resolve(Buffer.concat(chunks)) : reject(new Error(`ffmpeg exited with code ${code}`))));
    ff.stdin.on('error', () => {}); // ignore EPIPE if ffmpeg quits early
    ff.stdin.end(input);
  });
}
