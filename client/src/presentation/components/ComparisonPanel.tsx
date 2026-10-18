import { useState } from 'react';
import CodeBlock from './CodeBlock';

interface ComparisonPanelProps {
  layerName: string;
  conceptName: string;
  typescriptCode: string;
  swiftCode: string;
  explanation?: string;
}

export default function ComparisonPanel({
  layerName,
  conceptName,
  typescriptCode,
  swiftCode,
  explanation,
}: ComparisonPanelProps) {
  const [activeView, setActiveView] = useState<'typescript' | 'swift'>('typescript');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {conceptName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Layer: {layerName}</p>
      </div>

      {explanation && (
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{explanation}</p>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveView('typescript')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeView === 'typescript'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          TypeScript (Web)
        </button>
        <button
          onClick={() => setActiveView('swift')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeView === 'swift'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Swift (iOS)
        </button>
      </div>

      {activeView === 'typescript' ? (
        <CodeBlock code={typescriptCode} language="typescript" title="TypeScript Implementation" />
      ) : (
        <CodeBlock code={swiftCode} language="swift" title="Swift Implementation" />
      )}
    </div>
  );
}
