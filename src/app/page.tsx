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
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white">
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <h1 className="text-4xl font-extrabold mb-6 text-center animate-pulse">
          Welcome to Pentagram
        </h1>
        {generatedImage && (
          <div className="mt-5 text-center">
            <h2 className="text-2xl font-bold mb-4">Your Generated Image</h2>
            <div className="relative rounded-lg overflow-hidden shadow-2xl border border-white/20">
              <Image
                src={generatedImage}
                alt="Generated"
                className="rounded-lg"
                width={400}
                height={300}
              />
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg"
        >
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border-none focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="Enter a prompt (e.g., 'a futuristic city')"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-400 text-center">{errorMessage}</p>
          )}
        </form>
      </main>

      <footer className="py-4 text-center bg-black/30 backdrop-blur-md">
        <p className="text-sm text-white/80">
          Copyright &copy; 2024. Developed by{" "}
          <span className="font-semibold">Dawit Zewdu</span>.
        </p>
      </footer>
    </div>
  );
}
