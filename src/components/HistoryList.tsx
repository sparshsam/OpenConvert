import { Clock3, Trash2 } from "lucide-react";
import type { ConversionHistoryItem } from "../types";
import { formatLabel } from "../lib/formats";

type Props = {
  history: ConversionHistoryItem[];
  onClear: () => void;
};

export function HistoryList({ history, onClear }: Props) {
  return (
    <aside className="history-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Local history</h2>
          <p className="section-copy">Only filename, formats, timestamp, and result are stored.</p>
        </div>
        <button className="secondary-button" type="button" onClick={onClear} disabled={history.length === 0}>
          <Trash2 size={16} />
          Clear
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {history.length === 0 ? (
          <div className="empty-state">
            <Clock3 size={28} />
            <p>No conversions yet.</p>
          </div>
        ) : (
          history.map((item, index) => (
            <article className="history-row" key={`${item.timestamp}-${index}`}>
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{item.original_filename}</p>
                <p className="text-xs text-slate-500">
                  {formatLabel(item.input_format)} to {formatLabel(item.output_format)} -{" "}
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
              <span className={item.result_status === "success" ? "status-success" : "status-failure"}>
                {item.result_status}
              </span>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
