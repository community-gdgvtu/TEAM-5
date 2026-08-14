import React, { useMemo, useRef, useState } from "react";
import {
  ImagePlus,
  UploadCloud,
  Camera,
  MapPin,
  Tag,
  Sparkles,
  CheckCircle2,
  XCircle,
  Wrench,
  UserRound,
  Star,
  Loader2,
} from "lucide-react";
import { ScreenShell } from "../../components/common/ScreenShell";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { useApp } from "../../context/AppContext";
import { createReport } from "../../api/citizenApi";
import { NavScreenProps } from "../../navigation/types";

type PostKind = "issue" | "completed" | "failed";

const POST_KINDS: {
  key: PostKind;
  label: string;
  desc: string;
  icon: React.ElementType;
  accent: string;
}[] = [
  { key: "issue", label: "Report issue", desc: "Work has to be fixed", icon: Wrench, accent: "#f59e0b" },
  { key: "completed", label: "Work done", desc: "Upload proof of completion", icon: CheckCircle2, accent: "#22c55e" },
  { key: "failed", label: "Work failed", desc: "Re-report — fix didn't hold", icon: XCircle, accent: "#ef4444" },
];

const CATEGORIES = ["Pothole", "Streetlight", "Tree", "Cleaning", "Sidewalk", "Drainage", "Other"];

const CATEGORY_META: Record<string, { emoji: string; hashtags: string[]; severity: string }> = {
  Pothole: { emoji: "🕳️", hashtags: ["#PotholeFix", "#RoadSafety", "#FixIt"], severity: "High" },
  Streetlight: { emoji: "💡", hashtags: ["#Streetlight", "#SafetyFirst", "#FixIt"], severity: "Medium" },
  Tree: { emoji: "🌳", hashtags: ["#TreeCare", "#GreenCity", "#FixIt"], severity: "Medium" },
  Cleaning: { emoji: "🧹", hashtags: ["#CleaningDrive", "#SwachhCity", "#FixIt"], severity: "Low" },
  Sidewalk: { emoji: "🛤️", hashtags: ["#Sidewalk", "#PedestrianSafety", "#FixIt"], severity: "High" },
  Drainage: { emoji: "💧", hashtags: ["#Drainage", "#MonsoonReady", "#FixIt"], severity: "High" },
  Other: { emoji: "🛠️", hashtags: ["#FixIt", "#CitizenReported"], severity: "Medium" },
};

/** AI auto-detect simulation — derives category, tags & caption from the uploaded photo. */
function analyzePhoto(photoDataUrl: string | null, kind: PostKind) {
  return new Promise<{
    category: string;
    hashtags: string[];
    caption: string;
    severity: string;
    title: string;
  }>((resolve) => {
    setTimeout(() => {
      const pick = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const meta = CATEGORY_META[pick];
      const prefix =
        kind === "completed" ? "Fixed & AI-verified" : kind === "failed" ? "Fix did not hold" : "Reported";
      const caption =
        kind === "completed"
          ? `Work completed on site — after-photo matched to the original issue by AI verification. ${pick} area now back to normal.`
          : kind === "failed"
            ? `Previous fix did not hold. ${pick} issue is back and needs re-attention before the next season.`
            : `AI detected a ${pick.toLowerCase()} issue near the reported location. Needs ${meta.severity.toLowerCase()} priority attention from the civic team.`;
      resolve({
        category: pick,
        hashtags: meta.hashtags,
        caption,
        severity: meta.severity,
        title: `${prefix}: ${pick} on site`,
      });
    }, 1400);
  });
}

const WORKERS = [
  { id: "w_001", name: "Rahul Deshmukh", skill: "Sanitation & Drainage", rating: 4.9 },
  { id: "w_002", name: "Green Roots Nursery", skill: "Park Maintenance & Horticulture", rating: 4.5 },
  { id: "w_003", name: "Eastern Metal Works", skill: "General Civil Works", rating: 4.8 },
  { id: "w_004", name: "Northern Electricals", skill: "Electrical & Streetlight Fixes", rating: 4.7 },
  { id: "w_005", name: "Sahas Sanitation", skill: "Sanitation & Drainage", rating: 4.6 },
  { id: "w_006", name: "Southern Civic Builders", skill: "General Civil Works", rating: 4.9 },
];

export const ReportIssueScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { currentUser } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [kind, setKind] = useState<PostKind>("issue");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [category, setCategory] = useState("Pothole");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState<string[]>(CATEGORY_META.Pothole.hashtags);
  const [taggedWorker, setTaggedWorker] = useState("");
  const [qualityScore, setQualityScore] = useState(4);
  const [location, setLocation] = useState(currentUser?.location);
  const [analysing, setAnalysing] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const aiTitle = useMemo(() => {
    const prefix = kind === "completed" ? "Fixed & AI-verified" : kind === "failed" ? "Fix did not hold" : "Reported";
    return `${prefix}: ${category} on site`;
  }, [kind, category]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPhotoDataUrl(dataUrl);
      setAiDone(false);
      setAnalysing(true);
      const result = await analyzePhoto(dataUrl, kind);
      setCategory(result.category);
      setDescription(result.caption);
      setHashtags(result.hashtags);
      setAiDone(true);
      setAnalysing(false);
    };
    reader.readAsDataURL(file);
  };

  const selectCategory = (c: string) => {
    setCategory(c);
    setHashtags(CATEGORY_META[c]?.hashtags || []);
  };

  const handleSubmit = async () => {
    if (!photoDataUrl) return;
    setSubmitting(true);
    try {
      const { report } = await createReport(
        {
          issueType: category,
          description,
          photoUrl: photoDataUrl,
          location: location || { city: "Mumbai", state: "Maharashtra", country: "India" },
          postType: kind,
          taggedWorker: taggedWorker || undefined,
          hashtags,
          title: aiTitle,
          qualityScore,
        },
        currentUser?.id
      );
      go("estimate", { report });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const kindMeta = POST_KINDS.find((k) => k.key === kind)!;

  return (
    <ScreenShell
      title="New Report"
      subtitle="Upload a photo — AI fills the details"
      role="citizen"
    >
      {/* Post type selector */}
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2">What are you posting?</p>
        <div className="grid grid-cols-3 gap-2">
          {POST_KINDS.map((k) => {
            const Icon = k.icon;
            const active = kind === k.key;
            return (
              <button
                key={k.key}
                onClick={() => {
                  setKind(k.key);
                  setAiDone(false);
                  if (description) setDescription("");
                }}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  active ? "" : "bg-slate-800/60 border-slate-700 hover:border-slate-500"
                }`}
                style={active ? { background: `${k.accent}1a`, borderColor: `${k.accent}77` } : undefined}
              >
                <Icon className="w-5 h-5 mb-2" style={{ color: k.accent }} />
                <p className="text-xs font-semibold text-slate-100 leading-tight">{k.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{k.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Photo upload */}
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2">Photo</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {photoDataUrl ? (
          <div className="relative rounded-2xl overflow-hidden border border-slate-700">
            <img src={photoDataUrl} alt="Uploaded issue" className="w-full h-56 object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
                {analysing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI analysing…
                  </>
                ) : aiDone ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-verified" /> AI analysed
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-3.5 h-3.5" /> Photo attached
                  </>
                )}
              </span>
              <button
                onClick={() => fileRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-black/50 text-white text-[10px] font-semibold hover:bg-black/70"
              >
                Replace
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full h-56 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500/60 transition-colors flex flex-col items-center justify-center gap-2 bg-slate-900/50"
          >
            <div className="w-16 h-16 rounded-full border-4 border-slate-600 flex items-center justify-center">
              <UploadCloud className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-sm text-slate-300 font-medium">Tap to upload the issue photo</p>
            <p className="text-xs text-slate-500">or drag & drop · AI reads category, tags & severity</p>
          </button>
        )}
      </div>

      {/* AI auto-fill status */}
      {(analysing || aiDone) && (
        <Card accent={kindMeta.accent}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: kindMeta.accent }} />
            <p className="text-xs font-semibold text-slate-200">
              {analysing ? "AI reading your photo…" : "AI filled the details below — edit anything"}
            </p>
          </div>
        </Card>
      )}

      {/* Category */}
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2">
          Category {aiDone && <span className="text-[10px] text-verified ml-1">auto-detected</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => selectCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === c
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/50"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500"
              }`}
            >
              {CATEGORY_META[c]?.emoji} {c}
            </button>
          ))}
        </div>
      </div>

      {/* Title + description */}
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2">Title</p>
        <input
          value={aiTitle}
          readOnly
          className="w-full px-3 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-200 text-sm"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2">Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="AI draft is auto-filled when you upload a photo…"
          className="w-full px-3 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 text-sm focus:outline-none"
        />
      </div>

      {/* Hashtags */}
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Hashtags
        </p>
        <div className="flex flex-wrap gap-1.5">
          {hashtags.map((h) => (
            <span
              key={h}
              className="px-2 py-1 rounded-lg bg-slate-800/70 border border-slate-700 text-[11px] font-medium text-sky-300"
            >
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Tag worker */}
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1">
          <UserRound className="w-3.5 h-3.5" /> Tag the worker
        </p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {WORKERS.map((w) => (
            <button
              key={w.id}
              onClick={() => setTaggedWorker(taggedWorker === w.id ? "" : w.id)}
              className={`shrink-0 px-3 py-2 rounded-xl border text-left transition-colors ${
                taggedWorker === w.id
                  ? "border-emerald-500/60 bg-emerald-500/10"
                  : "bg-slate-800/60 border-slate-700 hover:border-slate-500"
              }`}
            >
              <p className="text-xs font-semibold text-slate-100">{w.name}</p>
              <p className="text-[10px] text-slate-400">{w.skill}</p>
              <p className="text-[10px] text-amber-300 flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-300" /> {w.rating}
              </p>
            </button>
          ))}
        </div>
        {taggedWorker && (
          <Badge tone="green">@{WORKERS.find((w) => w.id === taggedWorker)?.name} will be notified</Badge>
        )}
      </div>

      {/* Location */}
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> Location (auto-tagged)
        </p>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700">
          <span className="text-emerald-400">📍</span>
          <span className="text-sm text-slate-200">
            {location?.city}, {location?.state}
          </span>
          <span className="ml-auto text-xs text-slate-400">tracked for quality updates</span>
        </div>
      </div>

      {/* Quality tracking */}
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-2">Quality tracking</p>
        <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Expected work quality</span>
            <span className="font-bold text-amber-300">{qualityScore}/5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={qualityScore}
            onChange={(e) => setQualityScore(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
            <Star className="w-3 h-3 fill-amber-300" />
            <span>
              {qualityScore >= 4
                ? "High standard — AI will verify against this benchmark"
                : qualityScore >= 3
                  ? "Standard quality — typical civic spec"
                  : "Basic — urgent but minimal scope"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button color="citizen" disabled={!photoDataUrl || analysing || submitting} onClick={handleSubmit}>
          {submitting
            ? "Publishing…"
            : kind === "completed"
              ? "Publish Work Done → AI verify"
              : kind === "failed"
                ? "Report Work Failed → AI re-estimate"
                : "Report Issue → AI Estimate"}
        </Button>
        {!photoDataUrl && <Badge tone="amber">Upload a photo to continue — AI needs it to auto-fill</Badge>}
      </div>
    </ScreenShell>
  );
};

export default ReportIssueScreen;
