"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Script from "next/script";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import { Sun, Moon } from "lucide-react";

export default function ToolyaHomepage() {
  // Dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Menu refs
  const homeRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Live search
  const [searchQuery, setSearchQuery] = useState("");

  /** ---------------- PDF MERGER ---------------- */
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [mergeProgress, setMergeProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPdfFiles([...pdfFiles, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf"
      );
      setPdfFiles([...pdfFiles, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const mergePdfFiles = async () => {
    if (pdfFiles.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }
    setMergeProgress(10);

    const mergedPdf = await PDFDocument.create();
    for (let i = 0; i < pdfFiles.length; i++) {
      const file = pdfFiles[i];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
      setMergeProgress(Math.round(((i + 1) / pdfFiles.length) * 100));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
    URL.revokeObjectURL(url);
    setMergeProgress(0);
  };

  /** ---------------- PDF SPLITTER ---------------- */
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState("");

  const handlePdfSplit = async () => {
    if (!splitFile || !pageRange) {
      alert("Please select a PDF and page range (e.g., 1-3,5)");
      return;
    }
    const arrayBuffer = await splitFile.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();

    const ranges = pageRange.split(",").map((r) => r.trim());
    for (const range of ranges) {
      if (range.includes("-")) {
        const [start, end] = range.split("-").map(Number);
        for (let i = start; i <= end; i++) {
          const [page] = await newPdf.copyPages(pdf, [i - 1]);
          newPdf.addPage(page);
        }
      } else {
        const pageNum = Number(range);
        const [page] = await newPdf.copyPages(pdf, [pageNum - 1]);
        newPdf.addPage(page);
      }
    }

    const newBytes = await newPdf.save();
    const blob = new Blob([newBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "split.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  /** ---------------- QR CODE ---------------- */
  const [qrText, setQrText] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const generateQrCode = async () => {
    if (!qrText) return;
    const url = await QRCode.toDataURL(qrText);
    setQrUrl(url);
  };

  const downloadQrCode = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "qrcode.png";
    a.click();
  };

  const copyQrCodeUrl = () => {
    if (!qrUrl) return;
    navigator.clipboard.writeText(qrUrl);
    alert("QR code URL copied!");
  };

  /** ---------------- YOUTUBE THUMBNAIL ---------------- */
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const generateThumbnail = () => {
    const match = youtubeUrl.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (!match || !match[1]) {
      alert("Invalid YouTube URL");
      return;
    }
    const videoId = match[1];
    setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
  };

  const downloadThumbnail = async () => {
    if (!thumbnailUrl) return;
    const response = await fetch(thumbnailUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "youtube_thumbnail.jpg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyThumbnailUrl = () => {
    if (!thumbnailUrl) return;
    navigator.clipboard.writeText(thumbnailUrl);
    alert("Thumbnail URL copied!");
  };

  /** ---------------- IMAGE CONVERTER ---------------- */
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState("png");
  const [convertedImage, setConvertedImage] = useState<string | null>(null);

  const handleImageConvert = () => {
    if (!imageFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const converted = canvas.toDataURL(`image/${targetFormat}`);
        setConvertedImage(converted);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  };

  /** ---------------- URL SHORTENER ---------------- */
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);

  const shortenUrl = () => {
    if (!longUrl.startsWith("http")) {
      alert("Enter a valid URL (must start with http/https)");
      return;
    }
    const fakeShort = "https://short.ly/" + btoa(longUrl).slice(0, 6);
    setShortUrl(fakeShort);
  };

  const copyShortUrl = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    alert("Short URL copied!");
  };

  /** ---------------- TOOLS ---------------- */
  const tools = [
    {
      name: "PDF Merger",
      description: "Quickly merge multiple PDF files.",
      render: () => (
        <>
          <div
            className="mb-2 p-6 border-dashed border-2 border-gray-300 rounded cursor-pointer hover:bg-gray-100"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <p>Drag & drop PDF files here or click to select</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf"
            onChange={handlePdfUpload}
            className="hidden"
          />
          {pdfFiles.map((file, i) => (
            <p key={i}>{file.name}</p>
          ))}
          {mergeProgress > 0 && <p>Merging... {mergeProgress}%</p>}
          <Button onClick={mergePdfFiles}>Merge PDFs</Button>
        </>
      ),
    },
    {
      name: "PDF Splitter",
      description: "Extract pages from a PDF.",
      render: () => (
        <>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files && setSplitFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Page range (e.g. 1-3,5)"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            className="ml-2 px-2 py-1 border rounded"
          />
          <Button onClick={handlePdfSplit} className="ml-2">
            Split PDF
          </Button>
        </>
      ),
    },
    {
      name: "QR Code Generator",
      description: "Generate QR codes from text or URLs.",
      render: () => (
        <>
          <input
            type="text"
            placeholder="Enter text or URL"
            value={qrText}
            onChange={(e) => setQrText(e.target.value)}
            className="mb-2 px-3 py-2 w-full rounded border"
          />
          <Button onClick={generateQrCode}>Generate QR</Button>
          {qrUrl && (
            <>
              <Button onClick={downloadQrCode} className="ml-2">
                Download
              </Button>
              <Button onClick={copyQrCodeUrl} className="ml-2">
                Copy URL
              </Button>
              <img src={qrUrl} alt="QR Code" className="mx-auto mt-2" />
            </>
          )}
        </>
      ),
    },
    {
      name: "YouTube Thumbnail Downloader",
      description: "Get video thumbnails easily.",
      render: () => (
        <>
          <input
            type="text"
            placeholder="YouTube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="mb-2 px-3 py-2 w-full rounded border"
          />
          <Button onClick={generateThumbnail}>Generate</Button>
          {thumbnailUrl && (
            <>
              <Button onClick={downloadThumbnail} className="ml-2">
                Download
              </Button>
              <Button onClick={copyThumbnailUrl} className="ml-2">
                Copy URL
              </Button>
              <img src={thumbnailUrl} alt="Thumbnail" className="mx-auto mt-2" />
            </>
          )}
        </>
      ),
    },
    {
      name: "Image Converter",
      description: "Convert images to different formats.",
      render: () => (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
          />
          <select
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
            className="ml-2 p-1 border rounded"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
            <option value="bmp">BMP</option>
            <option value="gif">GIF (static)</option>
            <option value="tiff">TIFF (static)</option>
          </select>
          <Button onClick={handleImageConvert} className="ml-2">
            Convert
          </Button>
          {convertedImage && (
            <div className="mt-2">
              <img src={convertedImage} alt="Converted" className="max-w-xs" />
              <a
                href={convertedImage}
                download={`converted.${targetFormat}`}
                className="block text-blue-500 underline"
              >
                Download
              </a>
            </div>
          )}
        </>
      ),
    },
    {
      name: "URL Shortener",
      description: "Shorten long links with one click.",
      render: () => (
        <>
          <input
            type="text"
            placeholder="Enter long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="mb-2 px-3 py-2 w-full rounded border"
          />
          <Button onClick={shortenUrl}>Shorten</Button>
          {shortUrl && (
            <div className="mt-2">
              <p className="mb-2">
                Short URL:{" "}
                <a
                  href={shortUrl}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {shortUrl}
                </a>
              </p>
              <Button onClick={copyShortUrl}>Copy URL</Button>
            </div>
          )}
        </>
      ),
    },
  ];

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={
        darkMode
          ? "dark min-h-screen flex flex-col bg-gray-900 text-white"
          : "min-h-screen flex flex-col bg-gray-50 text-gray-900"
      }
    >
      {/* Google AdSense Script */}
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxx"
        crossOrigin="anonymous"
      />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Toolya
        </h1>
        <nav className="space-x-4 flex flex-wrap gap-2 md:gap-4">
          <button onClick={() => scrollToSection(homeRef)}>Home</button>
          <button onClick={() => scrollToSection(toolsRef)}>Tools</button>
          <button onClick={() => scrollToSection(aboutRef)}>About</button>
          <button onClick={() => scrollToSection(contactRef)}>Contact</button>
          <button onClick={() => setDarkMode(!darkMode)} className="ml-2">
            {darkMode ? (
              <Sun className="inline-block w-5 h-5" />
            ) : (
              <Moon className="inline-block w-5 h-5" />
            )}
          </button>
        </nav>
      </header>

      {/* Home */}
      <section
        ref={homeRef}
        className="text-center py-12 bg-gradient-to-r from-blue-100 to-blue-200"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Free Online Tools for Everyday Tasks
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Fast, simple, and reliable utilities to save your time.
        </p>
        <input
          type="text"
          placeholder="Search a tool..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-lg shadow w-full md:w-1/2 max-w-lg"
        />
      </section>

      {/* Google Ads block */}
      <div className="w-full flex justify-center my-6">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "120px" }}
          data-ad-client="ca-pub-xxxxxxxx" // replace with your client ID
          data-ad-slot="xxxxxxxxxx" // replace with your slot ID
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <Script id="ads-init">{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
      </div>

      {/* Tools */}
      <section
        ref={toolsRef}
        className="py-10 px-2 md:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <Card key={tool.name} className="shadow-lg">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>
                {tool.render()}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No tools found for "{searchQuery}"
          </p>
        )}
      </section>

      {/* About */}
      <section
        ref={aboutRef}
        className="py-10 px-6 bg-gray-100 dark:bg-gray-800"
      >
        <h2 className="text-2xl font-bold mb-4">About Toolya</h2>
        <p>
          Toolya provides simple online tools for PDFs, QR codes, images,
          thumbnails, and links — all in one place.
        </p>
      </section>

      {/* Contact */}
      <section
        ref={contactRef}
        className="py-10 px-6 bg-gray-50 dark:bg-gray-900"
      >
        <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p>Support: brightalemneh@gmail.com</p>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow mt-auto p-6 text-center text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Toolya. All rights reserved.</p>
        <p className="text-sm">Developed with ❤️ by Birhanu</p>
      </footer>
    </div>
  );
}
