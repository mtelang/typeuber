
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ResultsSummaryProps {
  wpm: number;
  errors: number;
  errorRate: number;
  timeTaken: number;
  onRestart: () => void;
}

const ResultsSummary = ({
  wpm,
  errors,
  errorRate,
  timeTaken,
  onRestart,
}: ResultsSummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Test Complete!</h2>
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-600">Words per Minute</span>
          <span className="text-xl font-semibold text-gray-900">{wpm}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-600">Errors</span>
          <span className="text-xl font-semibold text-gray-900">{errors}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-600">Error Rate</span>
          <span className="text-xl font-semibold text-gray-900">{errorRate}%</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-600">Time Taken</span>
          <span className="text-xl font-semibold text-gray-900">
            {Math.floor(timeTaken / 60)}:{(timeTaken % 60)
              .toString()
              .padStart(2, "0")}
          </span>
        </div>
      </div>
      <Button
        onClick={onRestart}
        className="w-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
      >
        Try Again
      </Button>
    </motion.div>
  );
};

export default ResultsSummary;
