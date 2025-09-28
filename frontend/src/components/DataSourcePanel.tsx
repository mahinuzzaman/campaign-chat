import {
  Database,
  CheckCircle,
  XCircle,
  Loader2,
  Plug,
  Unplug,
  TrendingUp,
  ShoppingCart,
  Share2,
} from 'lucide-react';
import React, { useState } from 'react';

import { DataSourcePanelProps, DataSource } from '../types';

const DataSourcePanel: React.FC<DataSourcePanelProps> = ({
  sources,
  onConnect,
  onDisconnect,
}) => {
  const [connectingSource, setConnectingSource] = useState<string | null>(null);

  const getSourceIcon = (sourceId: string) => {
    switch (sourceId) {
      case 'google_ads':
        return <TrendingUp className="w-5 h-5" />;
      case 'shopify':
        return <ShoppingCart className="w-5 h-5" />;
      case 'facebook_page':
        return <Share2 className="w-5 h-5" />;
      default:
        return <Database className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'connecting':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 border-green-200';
      case 'connecting':
        return 'bg-blue-50 border-blue-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleConnect = async (sourceId: string) => {
    setConnectingSource(sourceId);
    try {
      await onConnect(sourceId);
    } catch (error) {
      console.error(`Failed to connect to ${sourceId}:`, error);
    } finally {
      setConnectingSource(null);
    }
  };

  const handleDisconnect = async (sourceId: string) => {
    try {
      await onDisconnect(sourceId);
    } catch (error) {
      console.error(`Failed to disconnect from ${sourceId}:`, error);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Data Sources</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Connect your marketing data sources to create intelligent campaigns
        </p>
      </div>

      {/* Data Sources List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {sources.map(source => (
          <div
            key={source.id}
            className={`border rounded-lg p-4 transition-all duration-200 ${getStatusColor(
              source.status
            )}`}
          >
            {/* Source Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-gray-600">{getSourceIcon(source.id)}</div>
                <div>
                  <h3 className="font-medium text-gray-800">{source.name}</h3>
                  <div className="flex items-center space-x-1 mt-1">
                    {getStatusIcon(source.status)}
                    <span className="text-sm text-gray-600 capitalize">
                      {source.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Info */}
            {source.status === 'connected' && (
              <div className="mb-3 p-2 bg-white rounded border">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Data Points:</span>
                  <span className="font-medium">
                    {source.dataPoints?.toLocaleString()}
                  </span>
                </div>
                {source.lastUpdated && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">
                      {new Date(source.lastUpdated).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <div className="flex space-x-2">
              {source.status === 'connected' ? (
                <button
                  onClick={() => handleDisconnect(source.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                >
                  <Unplug className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(source.id)}
                  disabled={
                    connectingSource === source.id ||
                    source.status === 'connecting'
                  }
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {connectingSource === source.id ||
                  source.status === 'connecting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Plug className="w-4 h-4" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Source Description */}
            <div className="mt-3 text-xs text-gray-600">
              {source.id === 'google_ads' &&
                'Campaign performance, audience insights, and conversion data'}
              {source.id === 'shopify' &&
                'Customer behavior, sales patterns, and inventory data'}
              {source.id === 'facebook_page' &&
                'Social engagement, audience demographics, and content performance'}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="flex items-center justify-between mb-2">
            <span>Connected Sources:</span>
            <span className="font-medium">
              {sources.filter(s => s.status === 'connected').length} of{' '}
              {sources.length}
            </span>
          </div>
          <div className="text-gray-500">
            💡 Connect multiple sources for better campaign insights
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourcePanel;
