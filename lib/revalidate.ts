//
// Re-index entire list of acontent type
// 
// endpoint to re-index. /api/reindex/<content-type-name>
//
'use server'

import { log } from 'next-axiom'
import { revalidatePath } from 'next/cache';

export async function revalidateOnServer(path: string) {
    // Mutate data
    log.info(`Revalidating ${path}`);
    revalidatePath(path);
  }
