// src/app/privacy/page.tsx

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        At <strong>yema Tool</strong>, we respect your privacy and are committed to
        protecting your personal information. This Privacy Policy explains how
        we collect, use, and safeguard your data when you use our website.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
      <p className="mb-4">
        Toolya itself does not directly collect personal data. However, we use
        third-party services such as Google AdSense, which may collect certain
        information automatically:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Cookies to display relevant ads</li>
        <li>IP addresses and browser information</li>
        <li>Data about your interaction with ads</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Use of Information</h2>
      <p className="mb-4">
        We use third-party vendors, including Google, to serve ads. Google uses
        cookies to serve ads based on your prior visits to our site or other
        websites. Google&apos;s use of advertising cookies enables it and its
        partners to serve ads to you based on your visit to Toolya and/or other
        sites on the Internet.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Opting Out</h2>
      <p className="mb-4">
        You may opt out of personalized advertising by visiting{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Google Ads Settings
        </a>
        . For more details about how Google uses data, please visit{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Google Privacy & Terms
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Any changes will be
        reflected on this page with an updated effective date.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        contact us at:{" "}
        <a
          href="mailto:brightalemneh@gmail.com"
          className="text-blue-600 underline"
        >
          brightalemneh@gmail.com
        </a>
      </p>
    </main>
  );
}
