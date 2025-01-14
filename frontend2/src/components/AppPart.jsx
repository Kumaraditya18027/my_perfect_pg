import React from "react";
import Image from "next/image";

const AppDownloadSection = () => {
  return (
    <div
      className="p-8 flex flex-col md:flex-row items-center justify-between gap-10 w-full"
      id="app"
    >
      {/* Left side - Phone mockup */}
      <div className="relative h-40 md:h-96 w-full">
        <Image
          src="/appp.png"
          alt="App preview"
          width={600} // Mobile size
          height={600} // Mobile size
          priority
          className="object-contain" // Different sizes for mobile and desktop
        />
      </div>

      {/* Right side - Text and download buttons */}
      <div className="w-full md:w-1/2 space-y-6">
        <h2 className="text-4xl md:text-5xl font-normal mb-4">
          Download our App!
        </h2>

        <div className="space-y-2">
          <h3 className="text-3xl md:text-4xl font-normal">
            Unlock Convenience
          </h3>
          <p className="text-xl md:text-2xl text-gray-600">
            Download Our App Today!
          </p>
        </div>

        {/* Download buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* App Store Button */}
          <a
            href="https://apps.apple.com/us/app/id123456789" // Replace with actual App Store URL
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            {/* SVG Icon for App Store */}
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.02.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-xs">Download on the</div>
              <div className="text-xl font-semibold">App Store</div>
            </div>
          </a>

          {/* Play Store Button */}
          <a
            href="https://play.google.com/store/apps/details?id=com.tech.myperfectpg&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
              {/* SVG Icon for Play Store */}
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 20.5v-17c0-.76.44-1.41 1.12-1.71L16.25 12 4.12 22.21C3.44 21.91 3 21.26 3 20.5zm18.11-8.5L19 10.16 16.25 12l2.75 1.84 2.11-1.84zM14.62 18.78l-10.5 6.07c.22.08.46.15.71.15.7 0 1.32-.38 1.65-.99l8.14-4.73v-.5zm0-13.56v-.5L4.12 1.99C3.79 1.38 3.17 1 2.47 1c-.25 0-.49.07-.71.15l10.86 6.07z" />
              </svg>
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="text-xl font-semibold">Google Play</div>
              </div>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadSection;
