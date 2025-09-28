import { AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import ChatContainer from './components/ChatContainer';
import DataSourcePanel from './components/DataSourcePanel';
import ApiService from './services/api';
import { DataSource } from './types';

function App() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data sources
  useEffect(() => {
    const initializeDataSources = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getDataSources();
        setDataSources(response.sources);
        setError(null);
      } catch (error) {
        console.error('Failed to initialize data sources:', error);
        // Fallback to default data sources if API is not available
        setDataSources([
          {
            id: 'google_ads',
            name: 'Google Ads',
            status: 'disconnected',
          },
          {
            id: 'shopify',
            name: 'Shopify',
            status: 'disconnected',
          },
          {
            id: 'facebook_page',
            name: 'Facebook Page',
            status: 'disconnected',
          },
        ]);
        setError('Backend not available. Using demo mode.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDataSources();
  }, []);

  const handleConnect = async (sourceId: string) => {
    try {
      // Update status to connecting
      setDataSources(prev =>
        prev.map(source =>
          source.id === sourceId ? { ...source, status: 'connecting' } : source
        )
      );

      await ApiService.connectDataSource(sourceId);

      // Simulate connection delay
      setTimeout(() => {
        setDataSources(prev =>
          prev.map(source =>
            source.id === sourceId
              ? {
                  ...source,
                  status: 'connected',
                  lastUpdated: new Date().toISOString(),
                  dataPoints: Math.floor(Math.random() * 5000) + 1000,
                }
              : source
          )
        );
      }, 2000);
    } catch (error) {
      console.error(`Failed to connect to ${sourceId}:`, error);
      setDataSources(prev =>
        prev.map(source =>
          source.id === sourceId ? { ...source, status: 'error' } : source
        )
      );
    }
  };

  const handleDisconnect = async (sourceId: string) => {
    try {
      await ApiService.disconnectDataSource(sourceId);
      setDataSources(prev =>
        prev.map(source =>
          source.id === sourceId
            ? {
                ...source,
                status: 'disconnected',
                lastUpdated: undefined,
                dataPoints: undefined,
              }
            : source
        )
      );
    } catch (error) {
      console.error(`Failed to disconnect from ${sourceId}:`, error);
      // Still update UI even if API call fails
      setDataSources(prev =>
        prev.map(source =>
          source.id === sourceId
            ? {
                ...source,
                status: 'disconnected',
                lastUpdated: undefined,
                dataPoints: undefined,
              }
            : source
        )
      );
    }
  };

  const connectedSources = dataSources
    .filter(source => source.status === 'connected')
    .map(source => source.id);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Campaign Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Error Banner */}
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 p-3 z-10">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex w-full ${error ? 'pt-12' : ''}`}>
        {/* Data Sources Sidebar */}
        <DataSourcePanel
          sources={dataSources}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          <ChatContainer connectedSources={connectedSources} />
        </div>
      </div>
    </div>
  );
}

export default App;
