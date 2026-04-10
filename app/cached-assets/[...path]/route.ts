/**
 * Serves cached Contentful assets from the local export directory.
 *
 * Maps URLs like /cached-assets/9ieso0n2yz5w/{id}/{hash}/{filename}
 *      to files at content/2026-04-10/images.ctfassets.net/9ieso0n2yz5w/{id}/{hash}/{filename}
 *
 * Used by file-backend mode (CONTENTFUL_BACKEND=file) to serve images
 * without any calls to the Contentful CDN.
 */
import { NextRequest } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

const CACHE_ROOT = path.join(process.cwd(), 'content/2026-04-10/images.ctfassets.net');
const PLACEHOLDER_PATH = path.join(process.cwd(), 'public/resources/images/missing-image-placeholder.svg');

const CONTENT_TYPES: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
};

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: pathSegments } = await params;

    // Validate path (prevent directory traversal)
    for (const seg of pathSegments) {
        if (seg.includes('..') || seg.includes('/') || seg.includes('\\')) {
            return new Response('Invalid path', { status: 400 });
        }
    }

    const filePath = path.join(CACHE_ROOT, ...pathSegments);

    // Ensure the resolved path is still within CACHE_ROOT
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(path.resolve(CACHE_ROOT))) {
        return new Response('Forbidden', { status: 403 });
    }

    try {
        const data = await fs.readFile(resolved);
        const ext = path.extname(resolved).toLowerCase();
        const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream';

        return new Response(new Uint8Array(data), {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            // Serve the placeholder SVG instead of 404 so pages still render
            // gracefully when the requested asset isn't in the local cache.
            try {
                const placeholder = await fs.readFile(PLACEHOLDER_PATH);
                return new Response(new Uint8Array(placeholder), {
                    status: 200,
                    headers: {
                        'Content-Type': 'image/svg+xml',
                        'Cache-Control': 'public, max-age=3600',
                    },
                });
            } catch {
                return new Response('Not found', { status: 404 });
            }
        }
        return new Response('Internal error', { status: 500 });
    }
}
