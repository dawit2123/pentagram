"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedImage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedImage(data.imageUrl);
      } else {
        setErrorMessage(data.error || "Something went wrong.");
      }

      setInputText("");
    } catch (error) {
      setErrorMessage("Failed to generate the image.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <main className="flex-1 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Generate AI Images</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Describe the image you want to generate..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>

        {/* Error message */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        {/* Generated image */}
        {generatedImage && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Generated Image:</h2>
            <Image
              src={generatedImage}
              alt="Generated"
              className="max-w-full rounded-lg border shadow-lg"
              width={400}
              height={300}
            />
          </div>
        )}
      </main>

      <footer className="w-full max-w-3xl mx-auto text-center mt-6">
        <p className="text-sm text-gray-500">
          Copyright &copy; 2024. Developed By Dawit Zewdu.
        </p>
      </footer>
    </div>
  );
}
