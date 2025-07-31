import { $api } from "@/utils/api";

// GET /receipt/topMovie - Get trending movies by revenue
export const queryReceiptTopMovies = (fromDate: string, toDate: string) => {
  return $api.useQuery("get", "/receipt/topMovie", {
    params: {
      query: {
        fromDate,
        toDate,
      },
    },
  });
};

// POST /receipt - Create/filter receipts
export const queryReceipts = () => {
  return $api.useMutation("post", "/receipt");
};

// POST /receipt - Get receipts with filter for date range to analyze combo/snack data
export const useReceiptsByDateRange = (fromDate: string, toDate: string) => {
  return $api.useMutation("post", "/receipt", {
    body: {
      fromDate,
      toDate,
    },
  });
};
