import type { Worker } from '../types';

export interface TrustScoreDetails {
  score: number; // 0 to 100
  badgeLabel: string;
  recommendationLevel: 'High Local Trust' | 'Verified Local' | 'Rising Neighborhood Choice';
  recommendationRate: number;
}

export function calculateTrustScore(worker: Worker, currentDistrict?: string): TrustScoreDetails {
  // Base factors
  const ratingContribution = (worker.rating / 5) * 35; // max 35 pts
  const recContribution = Math.min(worker.communityRecommendationsCount * 1.2, 35); // max 35 pts
  const verificationContribution = worker.isVerified ? 15 : 0; // 15 pts
  const reviewCountContribution = Math.min(worker.reviewCount * 0.3, 15); // max 15 pts

  const totalScore = Math.min(Math.round(ratingContribution + recContribution + verificationContribution + reviewCountContribution), 100);

  let recommendationLevel: 'High Local Trust' | 'Verified Local' | 'Rising Neighborhood Choice' = 'Verified Local';
  if (totalScore >= 85) {
    recommendationLevel = 'High Local Trust';
  } else if (worker.communityRecommendationsCount > 20) {
    recommendationLevel = 'Rising Neighborhood Choice';
  }

  const isSameDistrict = currentDistrict && worker.cityDistrict.toLowerCase().includes(currentDistrict.toLowerCase());
  const locationLabel = isSameDistrict 
    ? `Recommended by ${worker.communityRecommendationsCount} locals in ${currentDistrict.split('(')[0].trim()}`
    : `Recommended by ${worker.communityRecommendationsCount} local residents`;

  return {
    score: totalScore,
    badgeLabel: locationLabel,
    recommendationLevel,
    recommendationRate: Math.round((worker.communityRecommendationsCount / Math.max(worker.reviewCount, 1)) * 100)
  };
}
