// PURPOSE: Server-Sent Events. Keeps one open connection per logged-in browser tab so we can push live updates (new order, worker coming...).
import type { Response } from 'express';

const clients = new Map<string, Set<Response>>();

export function addSseClient(userId: string, res: Response): void {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // stop nginx-style proxies from buffering the stream
  });
  res.write(': connected\n\n');

  const set = clients.get(userId) ?? new Set<Response>();
  set.add(res);
  clients.set(userId, set);

  const heartbeat = setInterval(() => res.write(': ping\n\n'), 25000); // keeps the connection alive
  res.on('close', () => {
    clearInterval(heartbeat);
    set.delete(res);
    if (set.size === 0) clients.delete(userId);
  });
}

export function sendSse(userId: string, event: string, data: unknown): void {
  clients.get(userId)?.forEach((res) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
}

export const isOnline = (userId: string) => (clients.get(userId)?.size ?? 0) > 0;
