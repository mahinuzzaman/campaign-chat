// Data Source Types
export interface DataSource {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastUpdated?: string;
  dataPoints?: number;
  icon?: string;
}

// Message Types
export interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: string;
  campaigns?: Campaign[];
  isLoading?: boolean;
}

// Campaign Types
export interface Campaign {
  id: string;
  type: string;
  confidence: number;
  jsonPayload: CampaignPayload;
  createdAt: string;
}

export interface CampaignPayload {
  campaign_id: string;
  timestamp: string;
  objective: string;
  audience: {
    segment: string;
    size: number;
    demographics: {
      age: string;
      gender: string;
      location: string;
    };
  };
  channels: {
    primary: string;
    secondary: string[];
    reasoning: string;
  };
  message: {
    [key: string]: {
      subject?: string;
      content: string;
      cta?: string;
    };
  };
  timing: {
    send_time: string;
    timezone: string;
    reasoning: string;
  };
  data_sources: string[];
  performance_estimate: {
    reach: number;
    open_rate: number;
    click_rate: number;
    conversion_rate: number;
  };
  confidence_score: number;
}

// API Request/Response Types
export interface ChatRequest {
  message: string;
  context: {
    connected_sources: string[];
  };
}

export interface ChatResponse {
  response: string;
  campaigns: Campaign[];
  processing_time: number;
}

export interface DataSourcesResponse {
  sources: DataSource[];
}

export interface ConnectRequest {
  credentials?: {
    api_key?: string;
    [key: string]: any;
  };
}

export interface ConnectResponse {
  status: string;
  estimated_time?: number;
  message: string;
}

// Component Props Types
export interface ChatContainerProps {
  connectedSources: string[];
}

export interface MessageBubbleProps {
  message: Message;
}

export interface DataSourcePanelProps {
  sources: DataSource[];
  onConnect: (sourceId: string) => void;
  onDisconnect: (sourceId: string) => void;
}

export interface CampaignDisplayProps {
  campaign: Campaign;
}
