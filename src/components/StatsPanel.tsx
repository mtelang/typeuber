
import { motion } from "framer-motion";

interface StatsPanelProps {
  wpm: number;
  errors: number;
  errorRate: number;
  timeLeft: number;
}

const StatItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col items-center bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm">
    <span className="text-sm text-gray-500 font-medium">{label}</span>
    <span className="text-2xl font-semibold text-gray-900">{value}</span>
  </div>
);

const StatsPanel = ({ wpm, errors, errorRate, timeLeft }: StatsPanelProps) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mx-auto mb-8"
    >
      <StatItem label="WPM" value={wpm} />
      <StatItem label="Errors" value={errors} />
      <StatItem label="Error Rate" value={`${errorRate}%`} />
      <StatItem
        label="Time Left"
        value={`${minutes}:${seconds.toString().padStart(2, "0")}`}
      />
    </motion.div>
  );
};

export default StatsPanel;
