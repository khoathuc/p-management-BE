export class ARR {
    /**
     * @desc check if array contain element
     * @return boolean
     */
    static contain<T>(arr: Array<T>, element: any) {
        return arr.includes(element);
    }

    /**
     * @desc merge arrays into one array
     * @return {Array<T>}
     */
    static merge<T>(arrs: Array<Array<T>>, isDuplicate: Boolean = true): T[] {
        let mergedArray = arrs.flat();

        if (isDuplicate) {
            mergedArray = Array.from(new Set(mergedArray));
        }

        return mergedArray;
    }

    /**
     * @desc iterate through each element in array
     */
    static loop<T>(arr: Array<T>, fn: (element: T) => void): void {
        for (let i = 0; i < arr.length; i++) {
            fn(arr[i]);
        }
    }
}
