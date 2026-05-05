import { NextResponse } from 'next/server';
import Settings from '../models/settings.model.js';
import connectDB from '../config/db.js';

// ── In-memory cache (per serverless instance) ────────────────────────────────
let _cache = null;
let _cacheTs = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

function getCached() {
  if (_cache && Date.now() - _cacheTs < CACHE_TTL) return _cache;
  return null;
}

function setCache(data) {
  _cache = data;
  _cacheTs = Date.now();
}

export function clearSettingsCache() {
  _cache = null;
  _cacheTs = 0;
}

// GET /api/settings — public, called on every page load
export const getSettings = async () => {
  try {
    // Return cached if fresh
    const cached = getCached();
    if (cached) {
      return NextResponse.json({ success: true, settings: cached });
    }

    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = await Settings.create({});
      settings = settings.toObject();
    }

    setCache(settings);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// PUT /api/settings — admin only, clears cache after update
export const updateSettings = async (req) => {
  try {
    await connectDB();
    const body = await req.json();

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    const allowed = [
      'storeName', 'tagline', 'logo', 'phone', 'email', 'address',
      'socialLinks', 'activeTemplate', 'colors',
      'currency', 'currencySymbol', 'freeShippingThreshold',
      'metaTitle', 'metaDescription',
    ];

    for (const key of allowed) {
      if (body[key] !== undefined) settings[key] = body[key];
    }

    await settings.save();

    // Clear cache so next GET fetches fresh data
    clearSettingsCache();

    return NextResponse.json({ success: true, message: 'Settings updated', settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
