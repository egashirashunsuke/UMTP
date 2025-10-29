import { Slider } from "./ui/slider";

type LikertSliderProps = {
  question: string;
  value: number | null;
  onChange: (val: number) => void;
  leftLabel?: string;
  rightLabel?: string;
};

export function LikertSlider({
  question,
  value,
  onChange,
  leftLabel = "全くそう思わない",
  rightLabel = "とてもそう思う",
}: LikertSliderProps) {
  const safeValue = value ?? 3;
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-sm font-medium">{question}</label>

      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {leftLabel}
        </span>

        <Slider
          min={1}
          max={5}
          step={1}
          value={[safeValue]}
          onValueChange={(v) => onChange(v[0])}
          className="w-full"
        />

        <span className="text-xs text-gray-500 whitespace-nowrap">
          {rightLabel}
        </span>
      </div>

      {/* 現在値の表示 */}
      <p className="text-xs text-blue-600 text-end">選択：{value}</p>
    </div>
  );
}
export default LikertSlider;
