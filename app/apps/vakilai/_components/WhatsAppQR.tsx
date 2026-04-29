"use client";

import { MessageCircle, Smartphone } from "lucide-react";

/**
 * WhatsApp deep-link that routes the user to the VakilAI registration page.
 * On mobile: tapping the QR or the button opens WhatsApp directly.
 * On desktop: scanning the QR with a phone opens WhatsApp which follows the link.
 *
 * QR is generated via the free QR Server API — no npm package needed.
 * The QR encodes a wa.me click-to-chat URL with a pre-filled message that
 * contains the ₹100 trial registration link.
 */

const REGISTER_URL =
  "https://vakilai-landing-page.onrender.com/apps/vakilai/register";

// Pre-filled WhatsApp message (Telugu + Hindi + English) with registration link
const WA_MESSAGE =
  `నమస్కారం! VakilAI ని try చేయండి — ₹100 లో 30 రోజులు. No credit card.\n\n` +
  `नमस्ते! VakilAI आज़माएं — ₹100 में 30 दिन। कोई क्रेडिट कार्ड नहीं।\n\n` +
  `Try VakilAI Free: ${REGISTER_URL}`;

const WA_URL = `https://wa.me/?text=${encodeURIComponent(WA_MESSAGE)}`;

// QR Server API — free, no API key, returns a PNG image of the QR code
const QR_IMG_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=15803d&bgcolor=ffffff&data=${encodeURIComponent(WA_URL)}`;

export default function WhatsAppQR() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-y border-green-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Left: copy */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-semibold rounded-full px-3 py-1.5 mb-4">
              <MessageCircle className="w-3.5 h-3.5" />
              Live Demo — Scan at the Court Canteen
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              Start your trial in{" "}
              <span className="text-green-700">30 seconds</span>
            </h2>

            {/* Bilingual label — the core acquisition copy */}
            <div className="space-y-1 mb-6">
              <p className="text-lg font-semibold text-gray-800">
                Scan to try free — ₹100 only, no credit card.
              </p>
              <p className="text-base text-gray-600 font-medium">
                {/* Telugu */}
                ఉచితంగా try చేయండి — కేవలం ₹100, క్రెడిట్ కార్డు అవసరం లేదు.
              </p>
              <p className="text-base text-gray-600 font-medium">
                {/* Hindi */}
                मुफ़्त में आज़माएं — केवल ₹100, कोई क्रेडिट कार्ड नहीं।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              {/* Mobile: direct tap-to-open WhatsApp */}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-green-200"
              >
                <MessageCircle className="w-5 h-5" />
                Open in WhatsApp
              </a>
              <a
                href={REGISTER_URL}
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-green-200 hover:border-green-400 text-green-700 font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Sign Up Directly →
              </a>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <Smartphone className="w-3.5 h-3.5" />
              Works on Android &amp; iOS · No app install needed
            </div>
          </div>

          {/* Right: QR code */}
          <div className="flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100 flex flex-col items-center gap-4">
              {/*
                QR encodes the WhatsApp wa.me URL — scanning it on mobile opens
                WhatsApp and shows the pre-filled message with the registration link.
                Image is served by api.qrserver.com (no npm package needed).
              */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QR_IMG_URL}
                alt="WhatsApp QR code to start VakilAI free trial"
                width={200}
                height={200}
                className="rounded-lg"
              />
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-700">
                  Scan with your phone
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Opens WhatsApp automatically
                </p>
              </div>
              {/* WhatsApp brand badge */}
              <div className="flex items-center gap-1.5 bg-green-50 rounded-full px-3 py-1.5">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-green-700">
                  WhatsApp
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-3 gap-4 border-t border-green-100 pt-8">
          {[
            {
              stat: "₹100",
              label: "one-time activation",
              sub: "30-day full trial",
            },
            {
              stat: "3–5 hrs",
              label: "saved per day",
              sub: "research & drafting",
            },
            {
              stat: "65%",
              label: "Month-3 retention",
              sub: "for activated users",
            },
          ].map(({ stat, label, sub }) => (
            <div key={stat} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stat}</div>
              <div className="text-xs font-semibold text-gray-600 mt-0.5">
                {label}
              </div>
              <div className="text-xs text-gray-400">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
