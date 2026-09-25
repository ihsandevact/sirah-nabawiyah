import fs from 'fs';
import path from 'path';
import { SirahEvent } from '@/types/sirah';

export async function getSirahEvents(): Promise<SirahEvent[]> {
  const eventsDir = path.join(process.cwd(), 'data', 'events');
  
  if (!fs.existsSync(eventsDir)) {
    return [];
  }

  const filenames = fs.readdirSync(eventsDir);
  
  const events = filenames
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(eventsDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents) as SirahEvent;
    })
    .sort((a, b) => a.order - b.order);

  return events;
}
