class Solution {
    public double[] sampleStats(int[] count) {

        double answer[] = { -1.0, -1.0, 0.0, -1.0, -1.0 };

        // First, find Sample Size.

        double sampleSize = 0;
        for (int i = 0; i < 256; i++) {
            sampleSize = sampleSize + count[i];
        }

        // Then, find median elements.
        long lowerMedian = -1, upperMedian = -1;
        double low = -1, high = -1;

        if (sampleSize % 2 == 0) {
            lowerMedian = (long) sampleSize / 2 - 1;
            upperMedian = (long) sampleSize / 2;
        } else {
            lowerMedian = (long) sampleSize / 2;
            upperMedian = (long) sampleSize / 2;
        }

        int lastRepeated = -1, maxRepeat = -1, maxRepeatIndex = -1;
        int pointer = -1;
        long sum = 0;

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
                sum += index * (long) numCount;

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
        answer[2] = sum / sampleSize;
        answer[3] = (high + low) / 2.0;
        answer[4] = maxRepeatIndex;

        return answer;
    }
}