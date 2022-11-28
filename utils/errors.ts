export const handleError = (error: any) => {
  let errorBody;
  let errorStatusCode = 500;

  if (error instanceof Error) {
    errorStatusCode = 400;
    errorBody = error.message;
  } else {
    errorBody = error;
  }

  return {
    statusCode: errorStatusCode,
    body: JSON.stringify(errorBody),
  };
};
