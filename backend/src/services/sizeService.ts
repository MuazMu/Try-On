import { SizeRecommendation, UserMeasurements, ClothingCategory, Size } from '../types';
import { avatarService } from './avatarService';

/**
 * Service for handling size estimation and recommendations
 */
export const sizeService = {
  /**
   * Get size recommendations based on avatar measurements
   * @param avatarId The avatar ID to get recommendations for
   * @returns Array of size recommendations by category
   */
  getSizeRecommendations: async (avatarId: string): Promise<SizeRecommendation[]> => {
    try {
      // Get the avatar with measurements
      const avatar = await avatarService.getAvatar(avatarId);
      
      if (!avatar) {
        throw new Error(`Avatar not found: ${avatarId}`);
      }
      
      // If no measurements, we can't make recommendations
      if (!avatar.measurements) {
        throw new Error('Avatar has no measurements data');
      }
      
      // Generate recommendations for each clothing category
      const recommendations: SizeRecommendation[] = [];
      
      // Add recommendations for tops
      recommendations.push(
        estimateTopSize(avatar.measurements)
      );
      
      // Add recommendations for bottoms
      recommendations.push(
        estimateBottomSize(avatar.measurements)
      );
      
      // Add recommendations for dresses
      recommendations.push(
        estimateDressSize(avatar.measurements)
      );
      
      // Add recommendations for outerwear
      recommendations.push(
        estimateOuterwearSize(avatar.measurements)
      );
      
      return recommendations;
    } catch (error) {
      console.error('Error generating size recommendations:', error);
      throw new Error('Failed to generate size recommendations');
    }
  },
};

/**
 * Estimate size for tops based on measurements
 * @param measurements User measurements
 * @returns Size recommendation for tops
 */
function estimateTopSize(measurements: UserMeasurements): SizeRecommendation {
  // This is a simplified algorithm for demo purposes
  // In a real application, this would use more sophisticated sizing algorithms
  // and take into account brand-specific sizing charts
  
  const { bust, shoulderWidth } = measurements;
  let recommendedSize: Size = 'M'; // Default to medium
  let confidence = 0.6; // Default medium confidence
  
  if (bust) {
    // Example bust sizing (in cm)
    if (bust < 82) {
      recommendedSize = 'XS';
      confidence = 0.8;
    } else if (bust < 87) {
      recommendedSize = 'S';
      confidence = 0.85;
    } else if (bust < 93) {
      recommendedSize = 'M';
      confidence = 0.9;
    } else if (bust < 100) {
      recommendedSize = 'L';
      confidence = 0.85;
    } else if (bust < 107) {
      recommendedSize = 'XL';
      confidence = 0.8;
    } else if (bust < 115) {
      recommendedSize = 'XXL';
      confidence = 0.75;
    } else {
      recommendedSize = 'XXXL';
      confidence = 0.7;
    }
  } else if (shoulderWidth) {
    // Fall back to shoulder width if bust measurement is missing
    // Example shoulder width sizing (in cm)
    if (shoulderWidth < 36) {
      recommendedSize = 'XS';
      confidence = 0.7;
    } else if (shoulderWidth < 38) {
      recommendedSize = 'S';
      confidence = 0.75;
    } else if (shoulderWidth < 40) {
      recommendedSize = 'M';
      confidence = 0.8;
    } else if (shoulderWidth < 42) {
      recommendedSize = 'L';
      confidence = 0.75;
    } else if (shoulderWidth < 44) {
      recommendedSize = 'XL';
      confidence = 0.7;
    } else if (shoulderWidth < 46) {
      recommendedSize = 'XXL';
      confidence = 0.65;
    } else {
      recommendedSize = 'XXXL';
      confidence = 0.6;
    }
  }
  
  return {
    category: 'tops',
    recommendedSize,
    confidence,
  };
}

/**
 * Estimate size for bottoms based on measurements
 * @param measurements User measurements
 * @returns Size recommendation for bottoms
 */
function estimateBottomSize(measurements: UserMeasurements): SizeRecommendation {
  const { waist, hips, inseam } = measurements;
  let recommendedSize: Size = 'M'; // Default to medium
  let confidence = 0.6; // Default medium confidence
  
  if (waist && hips) {
    // Prioritize both waist and hips when available
    // This is a simplified algorithm
    const avgMeasurement = (waist + hips) / 2;
    
    if (avgMeasurement < 75) {
      recommendedSize = 'XS';
      confidence = 0.85;
    } else if (avgMeasurement < 82) {
      recommendedSize = 'S';
      confidence = 0.9;
    } else if (avgMeasurement < 90) {
      recommendedSize = 'M';
      confidence = 0.9;
    } else if (avgMeasurement < 98) {
      recommendedSize = 'L';
      confidence = 0.85;
    } else if (avgMeasurement < 106) {
      recommendedSize = 'XL';
      confidence = 0.8;
    } else if (avgMeasurement < 116) {
      recommendedSize = 'XXL';
      confidence = 0.75;
    } else {
      recommendedSize = 'XXXL';
      confidence = 0.7;
    }
    
    // Boost confidence if inseam is also available
    if (inseam) {
      confidence = Math.min(confidence + 0.05, 0.95);
    }
  } else if (waist) {
    // Fall back to just waist if hips measurement is missing
    if (waist < 70) {
      recommendedSize = 'XS';
      confidence = 0.75;
    } else if (waist < 76) {
      recommendedSize = 'S';
      confidence = 0.8;
    } else if (waist < 84) {
      recommendedSize = 'M';
      confidence = 0.8;
    } else if (waist < 92) {
      recommendedSize = 'L';
      confidence = 0.75;
    } else if (waist < 102) {
      recommendedSize = 'XL';
      confidence = 0.7;
    } else if (waist < 112) {
      recommendedSize = 'XXL';
      confidence = 0.65;
    } else {
      recommendedSize = 'XXXL';
      confidence = 0.6;
    }
  } else if (hips) {
    // Fall back to just hips if waist measurement is missing
    if (hips < 80) {
      recommendedSize = 'XS';
      confidence = 0.7;
    } else if (hips < 88) {
      recommendedSize = 'S';
      confidence = 0.75;
    } else if (hips < 96) {
      recommendedSize = 'M';
      confidence = 0.75;
    } else if (hips < 104) {
      recommendedSize = 'L';
      confidence = 0.7;
    } else if (hips < 112) {
      recommendedSize = 'XL';
      confidence = 0.65;
    } else if (hips < 120) {
      recommendedSize = 'XXL';
      confidence = 0.6;
    } else {
      recommendedSize = 'XXXL';
      confidence = 0.55;
    }
  }
  
  return {
    category: 'bottoms',
    recommendedSize,
    confidence,
  };
}

/**
 * Estimate size for dresses based on measurements
 * @param measurements User measurements
 * @returns Size recommendation for dresses
 */
function estimateDressSize(measurements: UserMeasurements): SizeRecommendation {
  const { bust, waist, hips } = measurements;
  let recommendedSize: Size = 'M'; // Default to medium
  let confidence = 0.6; // Default medium confidence
  
  // For dresses, we want to consider bust, waist, and hips together if possible
  if (bust && waist && hips) {
    // Calculate the average of all three measurements
    // Then apply sizing logic
    // In a real app, this would be more sophisticated and consider proportions
    const avgMeasurement = (bust + waist + hips) / 3;
    
    if (avgMeasurement < 76) {
      recommendedSize = 'XS';
      confidence = 0.85;
    } else if (avgMeasurement < 82) {
      recommendedSize = 'S';
      confidence = 0.9;
    } else if (avgMeasurement < 90) {
      recommendedSize = 'M';
      confidence = 0.9;
    } else if (avgMeasurement < 98) {
      recommendedSize = 'L';
      confidence = 0.85;
    } else if (avgMeasurement < 106) {
      recommendedSize = 'XL';
      confidence = 0.8;
    } else if (avgMeasurement < 116) {
      recommendedSize = 'XXL';
      confidence = 0.75;
    } else {
      recommendedSize = 'XXXL';
      confidence = 0.7;
    }
  } else if (bust && waist) {
    // Fall back to bust and waist if hips is missing
    const avgMeasurement = (bust + waist) / 2;
    
    // Apply similar logic as above but with lower confidence
    if (avgMeasurement < 76) {
      recommendedSize = 'XS';
      confidence = 0.75;
    } else if (avgMeasurement < 82) {
      recommendedSize = 'S';
      confidence = 0.8;
    } else if (avgMeasurement < 90) {
      recommendedSize = 'M';
      confidence = 0.8;
    } else if (avgMeasurement < 98) {
      recommendedSize = 'L';
      confidence = 0.75;
    } else if (avgMeasurement < 106) {
      recommendedSize = 'XL';
      confidence = 0.7;
    } else if (avgMeasurement < 116) {
      recommendedSize = 'XXL';
      confidence = 0.65;
    } else {
      recommendedSize = 'XXXL';
      confidence = 0.6;
    }
  } else {
    // Fall back to just bust if that's all we have
    // Or use a default with low confidence if no measurements available
    if (bust) {
      return estimateTopSize(measurements);
    }
  }
  
  return {
    category: 'dresses',
    recommendedSize,
    confidence,
  };
}

/**
 * Estimate size for outerwear based on measurements
 * @param measurements User measurements
 * @returns Size recommendation for outerwear
 */
function estimateOuterwearSize(measurements: UserMeasurements): SizeRecommendation {
  // Outerwear often depends on bust and shoulder width, plus room for layering
  const { bust, shoulderWidth } = measurements;
  let recommendedSize: Size = 'M'; // Default to medium
  let confidence = 0.6; // Default medium confidence
  
  if (bust && shoulderWidth) {
    // For outerwear, we want to consider both bust and shoulder width
    // and potentially go up a size for comfort/layering
    const bustSize = estimateTopSize({ bust });
    const shoulderSize = estimateTopSize({ shoulderWidth });
    
    // Take the larger of the two sizes for outerwear
    const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const bustIndex = sizes.indexOf(bustSize.recommendedSize);
    const shoulderIndex = sizes.indexOf(shoulderSize.recommendedSize);
    
    const sizeIndex = Math.max(bustIndex, shoulderIndex);
    
    // Potentially go up a size for outerwear (for layering)
    // But only with reduced confidence
    const finalSizeIndex = Math.min(sizeIndex + 1, sizes.length - 1);
    recommendedSize = sizes[finalSizeIndex];
    
    // Combine confidences, but reduce overall since we're making an assumption about layering
    confidence = (bustSize.confidence + shoulderSize.confidence) / 2 * 0.9;
  } else if (bust) {
    // Fall back to bust measurement with adjusted sizing for outerwear
    const topSize = estimateTopSize({ bust });
    
    // Potentially go up a size for outerwear
    const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const sizeIndex = sizes.indexOf(topSize.recommendedSize);
    const finalSizeIndex = Math.min(sizeIndex + 1, sizes.length - 1);
    
    recommendedSize = sizes[finalSizeIndex];
    confidence = topSize.confidence * 0.8; // Reduce confidence for the adjustment
  } else if (shoulderWidth) {
    // Fall back to shoulder width
    const shoulderSize = estimateTopSize({ shoulderWidth });
    
    // Potentially go up a size for outerwear
    const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const sizeIndex = sizes.indexOf(shoulderSize.recommendedSize);
    const finalSizeIndex = Math.min(sizeIndex + 1, sizes.length - 1);
    
    recommendedSize = sizes[finalSizeIndex];
    confidence = shoulderSize.confidence * 0.8; // Reduce confidence for the adjustment
  }
  
  return {
    category: 'outerwear',
    recommendedSize,
    confidence,
  };
}

export default sizeService; 