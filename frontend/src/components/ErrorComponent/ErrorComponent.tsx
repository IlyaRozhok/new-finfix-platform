"use client";
import { useState } from "react";
import styles from "./error.module.scss";

type Props = {
  title?: string;
  description?: string;
  error?: unknown;
  centered?: boolean;
  compact?: boolean;
  onRetry?: () => void | Promise<void>;
  homeHref?: string;
  errorId?: string;
  showDetails?: boolean;
};

function normalizeMessage(err: unknown): string {
  if (!err) return "Unexpected error";
  if (typeof err === "string") return err;
  if (typeof err === "object" && err && "message" in err && typeof (err as any).message === "string") {
    return (err as any).message as string;
  }
  try { return JSON.stringify(err); } catch { return String(err); }
}

export default function ErrorView({
  title = "Something went wrong",
  description,
  error,
  centered,
  compact,
  onRetry,
  homeHref = "/",
  errorId,
  showDetails,
}: Props) {
  const [busy, setBusy] = useState(false);
  const msg = description ?? normalizeMessage(error);

  async function retry() {
    if (!onRetry) return;
    setBusy(true);
    try { await onRetry(); } finally { setBusy(false); }
  }

  return (
    <div className={[
      styles.error,
      centered ? styles["error--centered"] : "",
      compact ? styles["error--compact"] : "",
    ].join(" ")}>
      <div className={styles["error__icon"]} aria-hidden>
        {/* Simple icon (SVG) */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 7v6m0 4h.01"></path>
        </svg>
      </div>

      <h2 className={styles["error__title"]}>{title}</h2>
      <p className={styles["error__desc"]}>{msg}</p>

      {errorId && (
        <div className={styles["error__meta"]}>
          ID: <code>{errorId}</code>
          <button className="copy" onClick={() => navigator.clipboard?.writeText(errorId)}>copy</button>
        </div>
      )}

      {/* {showDetails && error && (
        <div className={styles["error__details"]}>
          <details>
            <summary>Technical details</summary>
            <div className="box">
              <pre>{typeof error === "string" ? error : JSON.stringify(error, null, 2)}</pre>
            </div>
          </details>
        </div>
      )} */}

      <div className={styles["error__actions"]}>
        {onRetry && (
          <button className={[styles["error__btn"], styles["--primary"]].join(" ")} onClick={retry} disabled={busy}>
            {busy ? "Retrying…" : "Retry"}
          </button>
        )}
        <a className={[styles["error__btn"], styles["--ghost"]].join(" ")} href={homeHref}>
          Home
        </a>
      </div>
    </div>
  );
}