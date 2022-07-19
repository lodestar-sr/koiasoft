import { RequestQueryItemInterface } from "./request-query-item.interface";

export type RequestQueryInterface = {
  query: RequestQueryItemInterface[];
  response: {
    format: string;
  }
};
