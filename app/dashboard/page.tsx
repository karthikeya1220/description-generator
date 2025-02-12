"use client"
import React, { useState, useRef } from "react";
import { Wand2, RefreshCw, Copy, Upload, X, Download } from "lucide-react";
import axios from "axios";
import { useTheme } from "next-themes";
import { useFont } from "@/contexts/FontContext";

function GenerateDescription() {
  const { theme } = useTheme();
  const { font } = useFont();
  const [image, setImage] = useState<File | null>(null);
  const [features, setFeatures] = useState("");
  const [tone, setTone] = useState("professional");
  const [paragraphs, setParagraphs] = useState("1");
  const [style, setStyle] = useState("concise");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  // Remove Image
  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Call Backend API to Generate Description
  const handleGenerate = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("paragraphs", paragraphs);
      formData.append("style", style);
      formData.append("tone", tone);
      formData.append("features", features);

      const response = await axios.post(
        "http://54.209.28.246:5000/api/generate-description/user123",
        formData
      );

      // Ensure the response is a string
      const description = response.data.description;

      if (description && description.parts && description.parts.length > 0) {
        setGeneratedDescription(description.parts[0].text);
      } else {
        console.error("No parts in the description");
        setGeneratedDescription("Error: No description parts found.");
      }
    } catch (error) {
      console.error("Error generating description:", error);
      setGeneratedDescription(
        "Error generating description. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDescription);
  };

  // Download Description as File
  const handleExport = () => {
    const blob = new Blob([generatedDescription], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-description.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-background to-background/80 font-${font}`}>
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            Product Description Generator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create compelling product descriptions in seconds
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">
                Product Image
              </label>
              <div className="relative">
                {image ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Product"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-background rounded-full shadow-md hover:bg-accent"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-input rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Click to upload product image
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Key Features & Benefits
              </label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-32"
                placeholder="Enter key features (one per line)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Paragraphs
                </label>
                <select
                  value={paragraphs}
                  onChange={(e) => setParagraphs(e.target.value)}
                  className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="1">1 Paragraph</option>
                  <option value="2">2 Paragraphs</option>
                  <option value="3">3 Paragraphs</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description Style
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setStyle("concise")}
                  className={`px-4 py-2 rounded-lg border ${
                    style === "concise"
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-input text-foreground hover:bg-accent"
                  }`}
                >
                  Concise
                </button>
                <button
                  onClick={() => setStyle("detailed")}
                  className={`px-4 py-2 rounded-lg border ${
                    style === "detailed"
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-input text-foreground hover:bg-accent"
                  }`}
                >
                  Detailed
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              <span>
                {isGenerating ? "Generating..." : "Generate Description"}
              </span>
            </button>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 border border-input">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Generated Description
              </h2>
              <div className="flex space-x-2">
                {generatedDescription && (
                  <>
                    <button
                      onClick={handleCopy}
                      className="text-foreground hover:text-foreground hover:bg-accent transition-colors p-2 rounded-lg"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleExport}
                      className="text-foreground hover:text-foreground hover:bg-accent transition-colors p-2 rounded-lg"
                      title="Download as file"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="text-gray-400 whitespace-pre-wrap">
              {typeof generatedDescription === "string"
                ? generatedDescription
                : "Your generated product description will appear here..."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GenerateDescription;
