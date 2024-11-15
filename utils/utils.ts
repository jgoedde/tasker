/**
 * A utility function to handle specific error types in a promise chain.
 *
 * Example usage:
 * ```typescript
 * class SpecificError extends Error {}
 *
 * Promise.reject(new SpecificError())
 *   .catch(ofClass(SpecificError, (e) => console.log("specific error", e)))
 *   .catch((e) => console.log("generic error", e));
 * ```
 *
 * @param cls The class of the error to handle.
 * @param catcher The function to handle errors of the specified class.
 * @returns A handler that invokes the catcher for matching errors or rethrows the error.
 */
export function ofClass<E, R>(
    // deno-lint-ignore no-explicit-any
    cls: new (...args: any[]) => E,
    catcher: (error: E) => Promise<R> | R,
): (error: unknown) => Promise<R> {
    return (error) => {
        if (error instanceof cls) {
            return Promise.resolve(catcher(error)); // Ensure catcher result is always a Promise
        }
        return Promise.reject(error); // Ensure non-handled errors are always rejected
    };
}
