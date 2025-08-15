/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    defaultHost: process.env.FALKORDB_HOST || 'localhost',
    defaultPort: process.env.FALKORDB_PORT || '6379',
  });
}