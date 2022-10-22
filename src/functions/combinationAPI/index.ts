import { APIGatewayProxyEvent } from "aws-lambda";
import { formatJSONResponse } from "../../libs/apiGateway";
import Axios from "axios";

// lambda function
export const handler = async (event: APIGatewayProxyEvent) => {
  // API request ===> ourURL/gameDeals?currency=eur

  const { queryStringParameters = {} } = event;

  const { currency } = queryStringParameters;

  if (!currency) {
    return formatJSONResponse({
      statusCode: 400,
      data: {
        message: "Missing currency query parameter",
      },
    });
  }

  const deals = await Axios.get(
    "https://www.cheapshark.com/api/1.0/deals?upperPrice=15&pageSize=10"
  ).catch((error) => {
    console.log(error);
    return formatJSONResponse({
      statusCode: 500,
      data: {
        message: error.message,
      },
    });
  });

  // changing from one USD currency to the currency passed by the user
  const currencyData = await Axios.get(
    `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/${currency}.json`
  ).catch((error) => {
    console.log(error);
    return formatJSONResponse({
      statusCode: 500,
      data: {
        message: error.message,
      },
    });
  });

  const currencyConversion = currencyData.data[currency];

  const repricedDeals = deals.data.map((deal) => {
    const {
      title,
      storeID,
      gameID,
      salesPrice,
      normalPrice,
      savings,
      dealRating,
      releaseDate,
      steamRatingPercent,
    } = deal;

    return {
      title,
      storeID,
      steamRatingPercent,
      gameID,
      dealRating,
      salesPrice: salesPrice * currencyConversion,
      normalPrice: normalPrice * currencyConversion,
      savingsPercent: savings,
      releaseDate: new Date(releaseDate * 1000).toDateString(),
    };
  });

  return formatJSONResponse({
    data: repricedDeals,
  });
};
