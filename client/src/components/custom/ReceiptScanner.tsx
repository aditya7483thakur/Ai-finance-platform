import { useEffect, useRef, useState, type DragEvent } from "react";
import { format } from "date-fns";
import { Loader2, RefreshCw, ScanLine, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { useScanReceipt } from "@/services/transactions/mutation";
import { formatMoney } from "@/lib/money";
import { getCategoryLabel } from "@/lib/categories";
import { cn } from "@/lib/utils";

export type ExtractedReceipt = {
  amount?: string;
  category?: string;
  date?: string;
  description?: string;
};

const ReceiptScanner = ({
  extracted,
  onResult,
}: {
  extracted: ExtractedReceipt | null;
  // Receives the raw scan response; the page decides what to apply.
  onResult: (parsed: Record<string, unknown> | null) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { mutate: scanReceipt, isPending: isScanning } = useScanReceipt();

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const scan = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Upload an image of the receipt (PNG or JPG).");
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    scanReceipt(file, {
      onSuccess: (response) => {
        const parsed = response?.data ?? response;
        onResult(parsed && typeof parsed === "object" ? parsed : null);
      },
      onError: () => setPreviewUrl(null),
    });
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragActive(false);
    if (!isScanning) scan(event.dataTransfer.files?.[0]);
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="sr-only"
      tabIndex={-1}
      aria-hidden
      disabled={isScanning}
      onChange={(event) => {
        scan(event.target.files?.[0]);
        event.target.value = "";
      }}
    />
  );

  if (previewUrl && (isScanning || extracted)) {
    return (
      <section
        aria-live="polite"
        className="rounded-2xl border border-accent/25 bg-card p-4"
      >
        <div className="flex gap-4">
          <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
            <img
              src={previewUrl}
              alt="Uploaded receipt"
              className="size-full object-cover"
            />
            {isScanning && (
              <>
                <span className="animate-scan absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-sky-400/40 to-transparent" />
                <span className="animate-scan absolute inset-x-0 h-px bg-sky-400 shadow-[0_0_12px_2px_rgb(56_189_248/0.7)]" />
              </>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-accent">
              {isScanning ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
              ) : (
                <Sparkles className="size-3.5" aria-hidden />
              )}
              {isScanning ? "Reading receipt..." : "Filled in from receipt"}
            </p>

            {isScanning ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Pulling out the amount, date and category. This takes a few
                seconds.
              </p>
            ) : (
              extracted && (
                <dl className="mt-2 space-y-1 text-xs">
                  {extracted.amount && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">Amount</dt>
                      <dd className="font-medium text-foreground">
                        {formatMoney(extracted.amount)}
                      </dd>
                    </div>
                  )}
                  {extracted.category && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd className="font-medium text-foreground">
                        {getCategoryLabel(extracted.category)}
                      </dd>
                    </div>
                  )}
                  {extracted.date && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">Date</dt>
                      <dd className="font-medium text-foreground">
                        {format(new Date(extracted.date), "MMM d, yyyy")}
                      </dd>
                    </div>
                  )}
                </dl>
              )
            )}
          </div>
        </div>

        {!isScanning && (
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/6 pt-3">
            <p className="text-[11px] text-muted-foreground">
              Check the details before saving.
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex shrink-0 items-center gap-1 rounded-md text-xs font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <RefreshCw className="size-3" aria-hidden />
              Scan another
            </button>
          </div>
        )}
        {fileInput}
      </section>
    );
  }

  return (
    <section>
      <button
        type="button"
        disabled={isScanning}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={cn(
          "group flex w-full flex-col items-center rounded-2xl border border-dashed px-4 py-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          dragActive
            ? "border-accent bg-accent/10"
            : "border-accent/30 bg-accent/[0.04] hover:border-accent/60 hover:bg-accent/[0.08]",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
          {dragActive ? (
            <Upload className="size-5" aria-hidden />
          ) : (
            <ScanLine className="size-5" aria-hidden />
          )}
        </span>
        <span className="mt-3 text-sm font-semibold text-foreground">
          {dragActive ? "Drop to scan" : "Scan a receipt"}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          Drop an image here or{" "}
          <span className="text-accent group-hover:underline">browse</span>.
          AI fills in the form for you.
        </span>
      </button>
      {fileInput}
    </section>
  );
};

export default ReceiptScanner;
