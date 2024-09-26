import { useEffect, useMemo, useState } from 'react';
import { co2 } from '@tgwf/co2';

/**
 * Extracts the total transfer size in bytes from PerformanceEntryList entries.
 * @param entries - The list of performance entries from which to calculate the total transfer size.
 * @returns The total transfer size in bytes.
 */
function getDataTransfer(entries: PerformanceEntryList): number {
    return entries
        .filter((resource) => 'transferSize' in resource)
        .reduce((total, resource) => total + (resource as PerformanceResourceTiming).transferSize, 0);
}

/**
 * Custom hook to track the total amount of bytes transferred over the network.
 * Uses the `PerformanceObserver` API to monitor resources loaded on the page.
 * @returns The total number of bytes transferred over the network.
 */
function useBytesTransferred(): number {
    const [bytesTransferred, setBytesTransferred] = useState(0);

    useEffect(() => {
        let totalBytes = 0;

        // Function to calculate and update the bytes transferred
        const calculateDataTransfer = (entries: PerformanceEntryList) => {
            const dataTransfer = getDataTransfer(entries);
            totalBytes += dataTransfer;
            setBytesTransferred(totalBytes);
        };

        // Initialize with current performance entries
        calculateDataTransfer(performance.getEntriesByType('resource'));

        // Set up a PerformanceObserver to listen for future network resources
        const observer = new PerformanceObserver((list) => calculateDataTransfer(list.getEntries()));
        observer.observe({ entryTypes: ['resource'] });

        // Clean up observer when the component is unmounted
        return () => observer.disconnect();
    }, []);

    return bytesTransferred;
}

/**
 * Custom hook that calculates the estimated CO2 emissions based on the number of bytes transferred.
 * @returns A tuple containing the total grams of CO2 emitted and the number of bytes transferred.
 */
export function useCarbonFootprint(): [gramsCO2: number, bytesTransferred: number] {
    const bytesTransferred = useBytesTransferred();

    // Memoized calculation of CO2 emissions to avoid recalculating unnecessarily
    const gramsCO2 = useMemo(() => {
        const swd = new co2({ model: 'swd' });
        return swd.perByte(bytesTransferred) as number;
    }, [bytesTransferred]);

    return [gramsCO2, bytesTransferred];
}
