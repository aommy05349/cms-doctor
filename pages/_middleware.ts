import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { apiApp } from '../services/config';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const nextPath = req.nextUrl.pathname;
    const noAuthPaths: Array<String> = [
        '/images',
        '/api',
        '/login',
        'firebasestorage',
    ];
    const hasAuth = req.cookies['cms-doctor-cookie'] ? true : false;
    let SkipPath = false;
    noAuthPaths.map((path) => {
        if (nextPath.indexOf(path as string) >= 0) {
            SkipPath = true;
        }
    });

    if (!SkipPath) {
        if (hasAuth) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    } else {
        return NextResponse.next();
    }
}
