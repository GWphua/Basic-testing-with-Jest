class 1093 {
    public double[] sampleStats(int[] count) {
        
        double answer[] = {-1.0, -1.0, 0.0, -1.0, -1.0};
        
        // First, find Sample Size.
        
        int sampleSize = 0;
        for (int i = 0; i < 256; i++) {
            sampleSize = sampleSize + count[i];
        }

        // Then, find median elements.
        int lowerMedian = -1, upperMedian = -1;
        int low = -1, high = -1;class Solution {
            public double[] sampleStats(int[] count) {
                
                double answer[] = {-1.0, -1.0, 0.0, -1.0, -1.0};
                
                // First, find Sample Size.
                
                int sampleSize = 0;
                for (int i = 0; i < 256; i++) {
                    sampleSize = sampleSize + count[i];
                }
        
                // Then, find median elements.
                int lowerMedian = -1, upperMedian = -1;
                double low = -1, high = -1;
                
                if (sampleSize % 2 == 0) {
                    lowerMedian = sampleSize/2 - 1;
                    upperMedian = sampleSize/2;
                } else {
                    lowerMedian = sampleSize/2;
                    upperMedian = sampleSize/2;
                }
                
                int lastRepeated = -1, maxRepeat = -1, maxRepeatIndex = -1;
                int pointer = -1;
                int sum = 0;
                
                for (int index = 0; index < 256; index++) {
                    int numCount = count[index];
                    
                    if (numCount > 0) {
                        lastRepeated = index;
        
                        if (answer[0] < 0) {
                            // If minimum not initialised.
                            answer[0] = index;
                        }
                        
                        if (maxRepeat < numCount) {
                            maxRepeat = numCount;
                            maxRepeatIndex = index;
                        }
                        
                        // Update the mean value.
                        answer[2] += (double) (index * numCount)/(double) sampleSize;
        
                        // Check if we are traversing the median.
                        if (pointer + numCount >= lowerMedian && pointer < lowerMedian) {
                            low = index;
                        }
                        
                        if (pointer + numCount >= upperMedian && pointer < upperMedian) {
                            high = index;
                        }
                        
                        pointer += numCount;
                    }
                }
                
                answer[1] = lastRepeated;
                answer[3] = (high + low )/ 2.0;
        
                answer[4] = maxRepeatIndex;
                
                
                return answer;
            }
        }
        
        if (sampleSize % 2 == 0) {
            lowerMedian = sampleSize/2 - 1;
            upperMedian = sampleSize/2;
        } else {
            lowerMedian = sampleSize/2;
            upperMedian = sampleSize/2;
        }
        
        int lastRepeated = -1, maxRepeat = -1, maxRepeatIndex = -1;
        int pointer = 0;
        
        for (int index = 0; index < 256; index++) {
            int numCount = count[index];
            
            if (numCount > 0) {
                lastRepeated = index;

                if (answer[0] < 0) {
                    // If minimum not initialised.
                    answer[0] = index;
                }
                
                if (maxRepeat < numCount) {
                    maxRepeat = numCount;
                    maxRepeatIndex = index;
                }
                
                // Update the mean value.
                answer[2] += (index * numCount)/sampleSize;

                // Check if we are traversing the median.
                if (pointer + numCount >= lowerMedian && pointer < lowerMedian) {
                    low = index;
                }
                
                if (pointer + numCount >= upperMedian && pointer < upperMedian) {
                    high = index;
                }
            }
        }
        
        answer[1] = lastRepeated;
        answer[3] = low + high / 2;
        answer[4] = maxRepeatIndex;
        
        
        return answer;
    }
}
