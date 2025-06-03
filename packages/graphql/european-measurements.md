```ts
// European Fitness Level Classifications
const europeanFitnessStandards = {
  [EuropeanFitnessLevel.INACTIVE]: {
    description: 'No regular physical activity',
    weeklyMinutes: '0 minutes',
    daysPerWeek: '0 days',
    healthRisk: 'Very High',
    examples: ['Sedentary lifestyle', 'No structured exercise']
  },
  [EuropeanFitnessLevel.INSUFFICIENTLY_ACTIVE]: {
    description: 'Some activity but below minimum recommendations',
    weeklyMinutes: '1-149 minutes moderate or 1-74 minutes vigorous',
    daysPerWeek: '1-2 days irregular',
    healthRisk: 'High',
    examples: ['Occasional walking', 'Weekend-only activities']
  },
  [EuropeanFitnessLevel.MINIMALLY_ACTIVE]: {
    description: 'Meets minimum WHO European recommendations',
    weeklyMinutes: '150 minutes moderate OR 75 minutes vigorous',
    daysPerWeek: '3-5 days',
    healthRisk: 'Moderate',
    examples: ['Regular brisk walking', 'Weekend sports participation']
  },
  [EuropeanFitnessLevel.HEALTH_ENHANCING]: {
    description: 'Exceeds minimum for additional health benefits',
    weeklyMinutes: '150-300 minutes moderate OR 75-150 minutes vigorous',
    daysPerWeek: '4-6 days',
    healthRisk: 'Low',
    examples: ['Regular gym attendance', 'Cycling to work', 'Structured fitness programs']
  },
  [EuropeanFitnessLevel.HIGH_ACTIVE]: {
    description: 'High level of regular physical activity',
    weeklyMinutes: '300+ minutes moderate OR 150+ minutes vigorous',
    daysPerWeek: '6-7 days',
    healthRisk: 'Very Low',
    examples: ['Athletes', 'Fitness enthusiasts', 'Physical occupation + exercise']
  }
};

// European Sleep Level Classifications (Adults 18-64 years)
const europeanSleepStandards = {
  [EuropeanSleepLevel.SEVERELY_INSUFFICIENT]: {
    description: 'Chronically inadequate sleep with major health risks',
    hoursRange: 'Less than 5 hours',
    healthRisk: 'Very High',
    cognitiveImpact: 'Severe impairment',
    recommendations: ['Immediate medical consultation', 'Sleep disorder evaluation']
  },
  [EuropeanSleepLevel.INSUFFICIENT]: {
    description: 'Below recommended minimum sleep duration',
    hoursRange: '5-6 hours',
    healthRisk: 'High',
    cognitiveImpact: 'Significant impairment',
    recommendations: ['Sleep hygiene improvement', 'Lifestyle modifications']
  },
  [EuropeanSleepLevel.BORDERLINE]: {
    description: 'Approaching adequate sleep but still suboptimal',
    hoursRange: '6-7 hours',
    healthRisk: 'Moderate',
    cognitiveImpact: 'Mild impairment',
    recommendations: ['Increase sleep duration', 'Improve sleep quality']
  },
  [EuropeanSleepLevel.ADEQUATE]: {
    description: 'Meets European sleep duration recommendations',
    hoursRange: '7-8 hours',
    healthRisk: 'Low',
    cognitiveImpact: 'Normal function',
    recommendations: ['Maintain current schedule', 'Monitor consistency']
  },
  [EuropeanSleepLevel.OPTIMAL]: {
    description: 'Ideal sleep duration for most adults',
    hoursRange: '8-9 hours',
    healthRisk: 'Very Low',
    cognitiveImpact: 'Peak performance',
    recommendations: ['Continue excellent habits', 'Fine-tune environment']
  },
  [EuropeanSleepLevel.EXCESSIVE]: {
    description: 'More than typically needed, may indicate issues',
    hoursRange: 'More than 9 hours',
    healthRisk: 'Moderate',
    cognitiveImpact: 'Potential grogginess',
    recommendations: ['Evaluate sleep quality', 'Check for underlying conditions']
  }
};
```