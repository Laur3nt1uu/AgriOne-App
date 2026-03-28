import { authStore } from '../auth/auth.store';

// Plan definitions with feature access
export const PLAN_FEATURES = {
  STARTER: {
    maxLands: 2,
    maxSensors: 5,
    aiMessagesPerDay: 5,
    features: [
      'basic_dashboard',
      'land_management',
      'sensor_pairing',
      'email_alerts',
      'basic_financial_tracking',
      'basic_weather',
      'basic_recommendations',
      'ai_assistant_basic'  // Limited AI access
    ]
  },
  PRO: {
    maxLands: Infinity,
    maxSensors: 50,
    aiMessagesPerDay: 50,
    features: [
      'basic_dashboard',
      'land_management',
      'sensor_pairing',
      'email_alerts',
      'basic_financial_tracking',
      'basic_weather',
      'basic_recommendations',
      // Pro exclusive features
      'advanced_analytics',
      'sms_alerts',
      'pdf_exports',
      'api_access_basic',
      'apia_integration',
      'advanced_charts',
      'custom_alert_rules',
      'data_export',
      'priority_support',
      'ai_assistant',       // Full AI access
      'ai_vision'           // Image analysis
    ]
  },
  ENTERPRISE: {
    maxLands: Infinity,
    maxSensors: Infinity,
    aiMessagesPerDay: Infinity,
    features: [
      // All Pro features plus
      'basic_dashboard',
      'land_management',
      'sensor_pairing',
      'email_alerts',
      'basic_financial_tracking',
      'basic_weather',
      'basic_recommendations',
      'advanced_analytics',
      'sms_alerts',
      'pdf_exports',
      'api_access_basic',
      'apia_integration',
      'advanced_charts',
      'custom_alert_rules',
      'data_export',
      'priority_support',
      'ai_assistant',
      'ai_vision',
      // Enterprise exclusive
      'api_access_full',
      'white_labeling',
      'advanced_integrations',
      'custom_development',
      'dedicated_support',
      'multi_user_management',
      'advanced_security',
      'compliance_reports',
      'ai_unlimited'        // Unlimited AI
    ]
  }
};

export const usePlanFeatures = () => {
  const getUserPlan = () => {
    const user = authStore.getUser();
    return user?.plan || 'STARTER';
  };

  const hasFeature = (featureName) => {
    const userPlan = getUserPlan();
    return PLAN_FEATURES[userPlan]?.features.includes(featureName) || false;
  };

  const canAddLands = (currentCount) => {
    const userPlan = getUserPlan();
    const maxLands = PLAN_FEATURES[userPlan]?.maxLands || 0;
    return currentCount < maxLands;
  };

  const canAddSensors = (currentCount) => {
    const userPlan = getUserPlan();
    const maxSensors = PLAN_FEATURES[userPlan]?.maxSensors || 0;
    return currentCount < maxSensors;
  };

  const getPlanLimits = () => {
    const userPlan = getUserPlan();
    return {
      maxLands: PLAN_FEATURES[userPlan]?.maxLands || 0,
      maxSensors: PLAN_FEATURES[userPlan]?.maxSensors || 0,
      features: PLAN_FEATURES[userPlan]?.features || []
    };
  };

  const getRequiredPlanForFeature = (featureName) => {
    for (const [planName, planData] of Object.entries(PLAN_FEATURES)) {
      if (planData.features.includes(featureName)) {
        return planName;
      }
    }
    return 'ENTERPRISE'; // Default to highest plan if feature not found
  };

  return {
    getUserPlan,
    hasFeature,
    canAddLands,
    canAddSensors,
    getPlanLimits,
    getRequiredPlanForFeature
  };
};