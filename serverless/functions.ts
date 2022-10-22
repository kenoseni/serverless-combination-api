import type { AWS } from "@serverless/typescript";

// Aggregation of lambda functions and their events (API GateWay configuretion)
const functions: AWS["functions"] = {
  combinationAPI: {
    // lambda handler. This poinst to the location of the lambda function
    handler: "src/functions/combinationAPI/index.handler",
    events: [
      {
        httpApi: {
          path: "/gameDeals",
          method: "get",
        },
      },
    ],
  },
};

export default functions;
