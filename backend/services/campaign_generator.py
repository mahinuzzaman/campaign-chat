import uuid
import random
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any

class CampaignGenerator:
    def __init__(self):
        self.intents = {
            "cart_abandonment": ["abandon", "cart", "recovery", "left"],
            "retargeting": ["retarget", "target", "audience", "engaged", "visited"],
            "product_promotion": ["promote", "launch", "new", "product", "sale"],
            "brand_awareness": ["awareness", "brand", "introduce", "visibility"],
            "lead_generation": ["leads", "generate", "signup", "subscribe"],
            "seasonal": ["winter", "summer", "holiday", "seasonal", "christmas"]
        }

        self.channels = ["email", "sms", "push", "whatsapp"]

    def analyze_intent(self, message: str) -> str:
        """Analyze user message to determine campaign intent"""
        message_lower = message.lower()

        for intent, keywords in self.intents.items():
            if any(keyword in message_lower for keyword in keywords):
                return intent

        # Default to product promotion
        return "product_promotion"

    def generate_campaign(self, message: str, connected_sources: List[str]) -> Dict[str, Any]:
        """Generate a realistic campaign based on user message and connected sources"""
        intent = self.analyze_intent(message)
        campaign_id = f"camp_{str(uuid.uuid4())[:8]}"
        timestamp = datetime.now(timezone.utc).isoformat()

        # Get audience based on connected sources
        audience = self._generate_audience(intent, connected_sources)

        # Select optimal channels
        channels = self._select_channels(intent, connected_sources)

        # Generate personalized messages
        messages = self._generate_messages(intent, channels, audience)

        # Calculate optimal timing
        timing = self._calculate_timing(intent, connected_sources)

        # Estimate performance
        performance = self._estimate_performance(audience, channels)

        # Calculate confidence score
        confidence = self._calculate_confidence(connected_sources, intent)

        campaign = {
            "campaign_id": campaign_id,
            "timestamp": timestamp,
            "objective": intent,
            "audience": audience,
            "channels": channels,
            "message": messages,
            "timing": timing,
            "data_sources": connected_sources,
            "performance_estimate": performance,
            "confidence_score": confidence
        }

        return campaign

    def _generate_audience(self, intent: str, sources: List[str]) -> Dict[str, Any]:
        """Generate audience based on intent and available data sources"""
        base_size = random.randint(500, 2000)

        audience_templates = {
            "cart_abandonment": {
                "segment": "cart_abandoners_24h",
                "size": random.randint(100, 300) if "shopify" in sources else base_size,
                "demographics": {
                    "age": "25-34",
                    "gender": "female",
                    "location": "US"
                }
            },
            "retargeting": {
                "segment": "website_visitors_engaged",
                "size": random.randint(800, 1500) if "google_ads" in sources else base_size,
                "demographics": {
                    "age": "25-44",
                    "gender": "mixed",
                    "location": "US, CA"
                }
            },
            "product_promotion": {
                "segment": "high_intent_shoppers",
                "size": random.randint(1000, 2500),
                "demographics": {
                    "age": "25-44",
                    "gender": "female",
                    "location": "US"
                }
            },
            "brand_awareness": {
                "segment": "lookalike_audience",
                "size": random.randint(5000, 10000),
                "demographics": {
                    "age": "18-44",
                    "gender": "mixed",
                    "location": "US, CA, UK"
                }
            }
        }

        return audience_templates.get(intent, audience_templates["product_promotion"])

    def _select_channels(self, intent: str, sources: List[str]) -> Dict[str, Any]:
        """Select optimal channels based on intent and data sources"""
        channel_mappings = {
            "cart_abandonment": {
                "primary": "email",
                "secondary": ["sms"],
                "reasoning": "High open rates for abandoned cart recovery"
            },
            "retargeting": {
                "primary": "push",
                "secondary": ["email", "sms"],
                "reasoning": "Immediate engagement for warm audiences"
            },
            "product_promotion": {
                "primary": "email",
                "secondary": ["push", "sms"],
                "reasoning": "Rich content display for product showcasing"
            },
            "brand_awareness": {
                "primary": "push",
                "secondary": ["email", "whatsapp"],
                "reasoning": "Wide reach and visual impact"
            }
        }

        return channel_mappings.get(intent, channel_mappings["product_promotion"])

    def _generate_messages(self, intent: str, channels: Dict[str, Any], audience: Dict[str, Any]) -> Dict[str, Any]:
        """Generate personalized messages for each channel"""
        message_templates = {
            "cart_abandonment": {
                "email": {
                    "subject": "Still thinking about your items?",
                    "content": "Complete your purchase and get 10% off your order!",
                    "cta": "Complete Purchase"
                },
                "sms": {
                    "content": "Your cart expires in 2 hours! Complete your purchase now: [link]"
                }
            },
            "retargeting": {
                "email": {
                    "subject": "You showed interest in our products",
                    "content": "Discover more items you'll love from our winter collection",
                    "cta": "Shop Now"
                },
                "push": {
                    "content": "New arrivals based on your interests are here!"
                }
            },
            "product_promotion": {
                "email": {
                    "subject": "Introducing our Winter Collection",
                    "content": "Discover the latest winter fashion trends and stay warm in style",
                    "cta": "Shop Collection"
                },
                "push": {
                    "content": "🆕 New Winter Collection is live! Shop now"
                }
            },
            "brand_awareness": {
                "email": {
                    "subject": "Welcome to [Brand Name]",
                    "content": "Discover quality fashion that fits your lifestyle",
                    "cta": "Explore"
                },
                "push": {
                    "content": "Discover [Brand Name] - Quality fashion for modern life"
                }
            }
        }

        base_messages = message_templates.get(intent, message_templates["product_promotion"])
        result = {}

        # Add primary channel message
        primary_channel = channels["primary"]
        if primary_channel in base_messages:
            result[primary_channel] = base_messages[primary_channel]

        # Add secondary channel messages
        for channel in channels["secondary"]:
            if channel in base_messages:
                result[channel] = base_messages[channel]

        return result

    def _calculate_timing(self, intent: str, sources: List[str]) -> Dict[str, str]:
        """Calculate optimal send timing"""
        now = datetime.now(timezone.utc)

        timing_rules = {
            "cart_abandonment": {
                "delay_hours": 2,
                "reasoning": "Strike while interest is still high"
            },
            "retargeting": {
                "delay_hours": 24,
                "reasoning": "Allow time for consideration"
            },
            "product_promotion": {
                "delay_hours": 0,
                "reasoning": "Immediate launch for maximum impact"
            },
            "brand_awareness": {
                "delay_hours": 12,
                "reasoning": "Optimal engagement window"
            }
        }

        rule = timing_rules.get(intent, timing_rules["product_promotion"])
        send_time = now + timedelta(hours=rule["delay_hours"])

        # Adjust to optimal hours (7-8 PM)
        if send_time.hour < 19:
            send_time = send_time.replace(hour=19, minute=0, second=0)
        elif send_time.hour > 20:
            send_time = send_time.replace(hour=19, minute=0, second=0) + timedelta(days=1)

        return {
            "send_time": send_time.isoformat(),
            "timezone": "user_local",
            "reasoning": rule["reasoning"]
        }

    def _estimate_performance(self, audience: Dict[str, Any], channels: Dict[str, Any]) -> Dict[str, float]:
        """Estimate campaign performance metrics"""
        base_rates = {
            "email": {"open": 0.22, "click": 0.03, "conversion": 0.08},
            "sms": {"open": 0.98, "click": 0.12, "conversion": 0.15},
            "push": {"open": 0.45, "click": 0.08, "conversion": 0.06},
            "whatsapp": {"open": 0.85, "click": 0.15, "conversion": 0.12}
        }

        primary_channel = channels["primary"]
        rates = base_rates.get(primary_channel, base_rates["email"])

        # Add some randomness
        variation = 0.2
        return {
            "reach": audience["size"],
            "open_rate": round(rates["open"] * random.uniform(1-variation, 1+variation), 3),
            "click_rate": round(rates["click"] * random.uniform(1-variation, 1+variation), 3),
            "conversion_rate": round(rates["conversion"] * random.uniform(1-variation, 1+variation), 3)
        }

    def _calculate_confidence(self, sources: List[str], intent: str) -> float:
        """Calculate confidence score based on available data sources"""
        base_confidence = 0.6
        source_bonus = len(sources) * 0.1
        intent_bonus = 0.1 if intent in ["cart_abandonment", "retargeting"] else 0.05

        confidence = min(0.95, base_confidence + source_bonus + intent_bonus)
        return round(confidence, 2)

    def generate_response_text(self, campaign: Dict[str, Any], user_message: str) -> str:
        """Generate conversational response text"""
        intent = campaign["objective"]
        audience_size = campaign["audience"]["size"]
        primary_channel = campaign["channels"]["primary"]
        confidence = campaign["confidence_score"]

        responses = {
            "cart_abandonment": f"I found {audience_size} customers who abandoned their carts in the last 24 hours. I've created an {primary_channel} recovery campaign with {int(confidence*100)}% confidence that will help recover lost sales.",

            "retargeting": f"Based on your data, I identified {audience_size} engaged users perfect for retargeting. The {primary_channel}-based campaign I've generated has a {int(confidence*100)}% confidence score.",

            "product_promotion": f"I've created a product promotion campaign targeting {audience_size} high-intent shoppers. Using {primary_channel} as the primary channel with {int(confidence*100)}% confidence this will drive strong results.",

            "brand_awareness": f"Your brand awareness campaign will reach {audience_size} potential customers through {primary_channel} messaging. With {int(confidence*100)}% confidence, this approach will maximize visibility."
        }

        base_response = responses.get(intent, f"I've generated a {intent} campaign targeting {audience_size} users via {primary_channel} with {int(confidence*100)}% confidence.")

        return f"{base_response}\n\nThe campaign includes optimized messaging, timing, and channel selection based on your connected data sources. You can review and modify the JSON payload below before executing."