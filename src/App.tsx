import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { open } from "@tauri-apps/plugin-dialog";
import { openUrl } from "@tauri-apps/plugin-opener";
import { check } from "@tauri-apps/plugin-updater";
import { CheckCircle2, FileImage, FolderOpen, Github, RefreshCcw, UploadCloud, Wand2 } from "lucide-react";
import { AboutDialog } from "./components/AboutDialog";
import { HistoryList } from "./components/HistoryList";
import { OUTPUT_FORMATS, formatLabel, isSupportedImage } from "./lib/formats";
import type { ConversionHistoryItem, ConversionResult, ImageFormat, ImageInfo } from "./types";

type ProgressState = "idle" | "ready" | "working" | "success" | "failure";

const repoUrl = "https://github.com/sparshsam/OpenConvert";
const releasesUrl = `${repoUrl}/releases`;
const issuesUrl = `${repoUrl}/issues/new`;

function App() {
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [outputFolder, setOutputFolder] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<ImageFormat>("png");
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
  const [status, setStatus] = useState("Choose an image to begin.");
  const [progressState, setProgressState] = useState<ProgressState>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canConvert = Boolean(selectedImage && outputFolder && progressState !== "working");

  const refreshHistory = useCallback(async () => {
    const items = await invoke<ConversionHistoryItem[]>("list_history");
    setHistory(items);
  }, []);

  const loadImage = useCallback(async (path: string) => {
    if (!isSupportedImage(path)) {
      setProgressState("failure");
      setStatus("Unsupported file type. Use PNG, JPG/JPEG, WEBP, BMP, or TIFF.");
      return;
    }

    try {
      const image = await invoke<ImageInfo>("get_image_info", { path });
      setSelectedImage(image);
      setOutputFormat(image.format === "jpeg" ? "jpg" : image.format);
      setProgressState("ready");
      setStatus("Image ready. Select an output folder and format.");
    } catch (error) {
      setProgressState("failure");
      setStatus(String(error));
    }
  }, []);

  const openFile = useCallback(async () => {
    const picked = await open({
      multiple: false,
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "bmp", "tiff"] }]
    });

    if (typeof picked === "string") {
      await loadImage(picked);
    }
  }, [loadImage]);

  const selectOutputFolder = useCallback(async () => {
    const picked = await open({ directory: true, multiple: false });
    if (typeof picked === "string") {
      setOutputFolder(picked);
      setStatus(selectedImage ? "Output folder selected. Ready to convert." : "Output folder selected.");
      setProgressState(selectedImage ? "ready" : "idle");
    }
  }, [selectedImage]);

  const convert = useCallback(async () => {
    if (!selectedImage || !outputFolder) {
      setStatus("Select an image and output folder first.");
      return;
    }

    setProgressState("working");
    setStatus("Converting locally...");

    try {
      const result = await invoke<ConversionResult>("convert_image", {
        inputPath: selectedImage.path,
        outputDir: outputFolder,
        outputFormat
      });
      await refreshHistory();
      setProgressState("success");
      setStatus(`Saved ${result.output_path}`);
    } catch (error) {
      await refreshHistory();
      setProgressState("failure");
      setStatus(String(error));
    }
  }, [outputFolder, outputFormat, refreshHistory, selectedImage]);

  const clearHistory = useCallback(async () => {
    await invoke("clear_history");
    await refreshHistory();
    setStatus("History cleared.");
  }, [refreshHistory]);

  const checkForUpdates = useCallback(async () => {
    try {
      const update = await check();
      setStatus(update ? `Update ${update.version} is available in GitHub Releases.` : "OpenConvert is up to date.");
    } catch (error) {
      setStatus(`Could not check for updates: ${String(error)}`);
    }
  }, []);

  const resetLayout = useCallback(() => {
    setSelectedImage(null);
    setOutputFolder("");
    setOutputFormat("png");
    setProgressState("idle");
    setStatus("Layout reset. Choose an image to begin.");
  }, []);

  useEffect(() => {
    refreshHistory().catch((error) => setStatus(String(error)));
  }, [refreshHistory]);

  useEffect(() => {
    const unlistenPromise = listen<string>("menu-event", async (event) => {
      switch (event.payload) {
        case "open-file":
          await openFile();
          break;
        case "select-output-folder":
          await selectOutputFolder();
          break;
        case "convert":
          await convert();
          break;
        case "clear-history":
          await clearHistory();
          break;
        case "settings":
          setStatus("Settings are intentionally minimal in v0.1.0.");
          break;
        case "reset-layout":
          resetLayout();
          break;
        case "about":
          setAboutOpen(true);
          break;
        case "github":
          await openUrl(repoUrl);
          break;
        case "release-notes":
          await openUrl(releasesUrl);
          break;
        case "check-updates":
          await checkForUpdates();
          break;
        case "report-issue":
          await openUrl(issuesUrl);
          break;
      }
    });

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, [checkForUpdates, clearHistory, convert, openFile, resetLayout, selectOutputFolder]);

  useEffect(() => {
    const unlistenPromise = getCurrentWebview().onDragDropEvent((event) => {
      if (event.payload.type === "over") {
        setIsDragging(true);
      }
      if (event.payload.type === "drop") {
        setIsDragging(false);
        const firstPath = event.payload.paths[0];
        if (firstPath) {
          void loadImage(firstPath);
        }
      }
      if (event.payload.type === "leave") {
        setIsDragging(false);
      }
    });

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, [loadImage]);

  const fileSummary = useMemo(() => {
    if (!selectedImage) return "No image selected";
    return `${selectedImage.filename} - ${formatLabel(selectedImage.format)} - ${selectedImage.width} x ${selectedImage.height}`;
  }, [selectedImage]);

  return (
    <main className="min-h-screen bg-white text-slate-700">
      <header className="app-header">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-accent font-bold text-white">OC</div>
          <div>
            <h1 className="text-xl font-semibold text-ink">OpenConvert</h1>
            <p className="text-sm text-slate-500">Fast, local-first image conversion for Windows.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="secondary-button" type="button" onClick={() => openUrl(repoUrl)}>
            <Github size={16} />
            GitHub
          </button>
          <button className="secondary-button" type="button" onClick={checkForUpdates}>
            <RefreshCcw size={16} />
            Updates
          </button>
        </div>
      </header>

      <section className="grid gap-6 px-8 pb-8 pt-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="workspace">
          <div
            className={isDragging ? "drop-zone drop-zone-active" : "drop-zone"}
            onDragOver={(event) => event.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              const file = event.dataTransfer.files[0] as (File & { path?: string }) | undefined;
              if (file?.path) void loadImage(file.path);
            }}
          >
            <UploadCloud size={42} />
            <div>
              <h2 className="text-2xl font-semibold text-ink">Drop an image here</h2>
              <p className="mt-2 text-sm text-slate-500">PNG, JPG/JPEG, WEBP, BMP, and TIFF are supported.</p>
            </div>
            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.bmp,.tiff"
              onChange={(event) => {
                const file = event.target.files?.[0] as (File & { path?: string }) | undefined;
                if (file?.path) void loadImage(file.path);
              }}
            />
            <button className="primary-button" type="button" onClick={openFile}>
              <FileImage size={18} />
              Open File
            </button>
          </div>

          <div className="conversion-grid">
            <section className="control-panel">
              <h2 className="section-title">Selected file</h2>
              <p className="file-summary">{fileSummary}</p>
              <p className="section-copy">Detection is local. Original files are never copied into OpenConvert.</p>
            </section>

            <section className="control-panel">
              <h2 className="section-title">Output</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <label className="field-label">
                  Format
                  <select
                    className="field-input"
                    value={outputFormat}
                    onChange={(event) => setOutputFormat(event.target.value as ImageFormat)}
                  >
                    {OUTPUT_FORMATS.map((format) => (
                      <option key={format} value={format}>
                        {formatLabel(format)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-label">
                  Folder
                  <div className="flex gap-2">
                    <input className="field-input" readOnly value={outputFolder || "No folder selected"} />
                    <button className="secondary-button shrink-0" type="button" onClick={selectOutputFolder}>
                      <FolderOpen size={16} />
                      Select
                    </button>
                  </div>
                </label>
              </div>
            </section>

            <section className="control-panel">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="section-title">Conversion status</h2>
                  <p className="status-line">{status}</p>
                </div>
                <button className="primary-button" type="button" disabled={!canConvert} onClick={convert}>
                  {progressState === "working" ? <RefreshCcw className="animate-spin" size={18} /> : <Wand2 size={18} />}
                  Convert
                </button>
              </div>
              <div className="progress-track" aria-label="Conversion progress">
                <div className={`progress-fill progress-${progressState}`} />
              </div>
              {progressState === "success" ? (
                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <CheckCircle2 size={16} />
                  Conversion complete.
                </p>
              ) : null}
            </section>
          </div>
        </div>

        <HistoryList history={history} onClear={clearHistory} />
      </section>

      <footer className="border-t border-slate-200 px-8 py-4 text-xs text-slate-500">
        Fully local processing. No accounts, no cloud uploads, no telemetry.
      </footer>

      {aboutOpen ? <AboutDialog onClose={() => setAboutOpen(false)} /> : null}
    </main>
  );
}

export default App;
