import { NextRequest } from 'next/server';
import { POST as speakHandler } from '../voice/speak/route';

export async function POST(req: NextRequest) {
  return speakHandler(req);
}
