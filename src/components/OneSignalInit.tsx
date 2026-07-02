"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export default function OneSignalInit() {
  useEffect(() => {
    // Wait for the script to load
    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(function () {
      window.OneSignal.init({
        appId: "d15cb12b-085c-4f0b-a40a-45dbdcba9e7c",
        notifyButton: {
          enable: true,
        },
        promptOptions: {
          actionMessage: "We'd like to show you notifications for the latest spaceflight news and updates.",
          acceptButtonText: "ALLOW",
          cancelButtonText: "NO THANKS"
        },
        allowLocalhostAsSecureOrigin: true,
      });
      // Optionally prompt the user
      // window.OneSignal.showSlidedownPrompt();
    });
  }, []);

  return (
    <Script
      src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
      strategy="afterInteractive"
    />
  );
}
