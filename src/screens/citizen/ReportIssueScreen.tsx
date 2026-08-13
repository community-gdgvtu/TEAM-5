import React, { useState } from "react";
import { ScreenShell } from "../../components/common/ScreenShell";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { useApp } from "../../context/AppContext";
import { createReport } from "../../api/citizenApi";

const CATEGORIES = ["Pothole", "Streetlight", "Tree", "Cleaning", "Sidewalk", "Other"];

export const ReportIssueScreen: React.FC = () => {
  const { currentUser } = useApp();
  const [category, setCategory] = useState("Pothole");
  const [description, setDescription] = useState("");
  const [photoTaken, setPhotoTaken] = useState(false);
  const [location, setLocation] = useState(currentUser?.location);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!photoTaken) return;
    setSubmitting(true);
    try {
      const { report } = await createReport(
        {
          issueType: category,
          description,
          location: location || { city: "Mumbai", state: "Maharashtra", country: "India" },
        },
        currentUser?.id
      );
      alert(`Report submitted! AI estimate: ₹${report.aiEstimate?.amount}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenShell title="Report Issue" subtitle="Capture → categorize → submit" role="citizen">
      <div className="relative h-64 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/60 to-slate-900 flex items-center justify-center overflow-hidden" onClick={() => setPhotoTaken(true)}>
        {photoTaken ? (
          <div className="text-center">
            <p className="text-5xl">📷</p>
            <p className="text-xs text-emerald-300 mt-2 font-medium">Photo captured — tap to retake</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-white/80 mx-auto mb-3" />
            <p className="text-sm text-slate-300 font-medium">Tap to capture the issue</p>
            <p className="text-xs text-slate-500 mt-1">Your photo becomes the AI input</p>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === c
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/50"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2">Location (auto-tagged)</p>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700">
          <span className="text-emerald-400">📍</span>
          <span className="text-sm text-slate-200">
            {location?.city}, {location?.state}
          </span>
          <span className="ml-auto text-xs text-slate-400">tap to edit</span>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2">Description (optional)</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="e.g. Deep pothole on Main St near the bus stop…"
          className="w-full px-3 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 text-sm focus:outline-none"
        />
      </div>

      <Badge tone="amber">Submit disabled until a photo is captured</Badge>

      <Button color="citizen" disabled={!photoTaken || submitting} onClick={handleSubmit}>
        {submitting ? "Submitting…" : "Report Issue → AI Estimate"}
      </Button>
    </ScreenShell>
  );
};

export default ReportIssueScreen;