export const formatJSONResponse = ({
  statusCode = 200,
  data = {},
}): { statusCode?: number; data?: any; headers: any } => {
  return {
    statusCode,
    data: JSON.stringify(data),
    headers: {
      // any web url can make a request to our API
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};
