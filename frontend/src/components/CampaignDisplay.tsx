import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  CheckCircle,
  Target,
  Calendar,
  Users,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { CampaignDisplayProps } from '../types';

const CampaignDisplay: React.FC<CampaignDisplayProps> = ({ campaign }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(campaign.jsonPayload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      {/* Campaign Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-800">
                {campaign.jsonPayload.objective.replace(/_/g, ' ').toUpperCase()} Campaign
              </h3>
              <p className="text-sm text-gray-600">
                Generated: {formatTimestamp(campaign.createdAt)}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(campaign.confidence)}`}>
            {Math.round(campaign.confidence * 100)}% Confidence
          </div>
        </div>
      </div>

      {/* Campaign Summary */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Audience */}
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Audience Size</p>
              <p className="font-semibold">{campaign.jsonPayload.audience.size.toLocaleString()}</p>
            </div>
          </div>

          {/* Channel */}
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Primary Channel</p>
              <p className="font-semibold capitalize">{campaign.jsonPayload.channels.primary}</p>
            </div>
          </div>

          {/* Timing */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Send Time</p>
              <p className="font-semibold">
                {new Date(campaign.jsonPayload.timing.send_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Estimated Reach */}
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Est. Conversions</p>
              <p className="font-semibold">
                {Math.round(campaign.jsonPayload.performance_estimate.reach * campaign.jsonPayload.performance_estimate.conversion_rate)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Campaign Preview */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Campaign Message Preview</h4>
          {Object.entries(campaign.jsonPayload.message).map(([channel, content]) => (
            <div key={channel} className="mb-2 last:mb-0">
              <span className="text-sm font-medium text-gray-600 capitalize">{channel}:</span>
              <div className="mt-1 p-2 bg-white rounded border text-sm">
                {typeof content === 'object' && content !== null ? (
                  <div>
                    {(content as any).subject && (
                      <div className="font-medium mb-1">Subject: {(content as any).subject}</div>
                    )}
                    <div>{(content as any).content}</div>
                    {(content as any).cta && (
                      <div className="mt-1 text-blue-600 font-medium">[{(content as any).cta}]</div>
                    )}
                  </div>
                ) : (
                  <div>{String(content)}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isExpanded ? 'Hide' : 'Show'} Full JSON
            </span>
          </button>

          <button
            onClick={handleCopyJSON}
            className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>

        {/* Full JSON Display */}
        {isExpanded && (
          <div className="mt-4 border border-gray-200 rounded">
            <div className="bg-gray-800 text-white p-3 text-sm">
              <span className="font-medium">Executable Campaign JSON</span>
            </div>
            <pre className="p-4 text-sm bg-gray-50 overflow-x-auto max-h-96 overflow-y-auto">
              <code>{JSON.stringify(campaign.jsonPayload, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDisplay;