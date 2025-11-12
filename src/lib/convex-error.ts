export const cleanConvexError = (err: any): string => {
    if (!err || !err.message || typeof err.message !== 'string') 
        return 'Something went wrong. Please try again.';
  
    const message = err.message as string;
    // Usually Uncaught Error: <Actual error message> at handler ...
    const errMessage = message.split('Uncaught Error:')?.[1]?.split(' at handler')?.[0];
    
    if (errMessage)
        return errMessage.trim();
    
    if (message)
        return message.trim();
  
    // Fallback
    return 'Unexpected error. Please try again later.';
  };
  

type SafeConvexReturn = {
    data?: any;
    error: undefined;
} | {
    data?: undefined;
    error: string;
}
export const safeConvex = async (fn: () => Promise<any>): Promise<SafeConvexReturn> => {
    try {
        const data = await fn();
        return {data, error: undefined};
    } catch (err: any) {
        return { error: cleanConvexError(err) };
    }
}