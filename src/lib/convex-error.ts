export const cleanConvexError = (err: any): string => {
    if (!err || !err.message || typeof err.message !== 'string') 
        return 'Something went wrong. Please try again.';
  
    const message = err.message as string;
    // Usually Uncaught Error: <Actual error message> at handler ...
    const errMessage = message.split('Uncaught Error:')?.[1]?.split(' at handler')?.[0];
    
    if (errMessage)
        return errMessage.trim();
  
    // Fallback
    return 'Unexpected error. Please try again later.';
  };
  