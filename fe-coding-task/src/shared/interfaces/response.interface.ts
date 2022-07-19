interface Origin<T = string | number> {
  [key: string]: T;
}

export interface ResponseInterface {
  class: string,
  label: string,
  source: string,
  updated: Date,
  id: string[],
  size: number[],
  dimension: {
    [key: string]: {
      label: string;
      category: {
        index: Origin<number>;
        label: Origin<string>;
      }
    };
  },
  value: number[],
  role: {
    time: string[];
    metric: string[];
  },
  version: string;
  extension: {
    px: {
      infofile: string;
      tableid: string;
      decimals: number;
    }
  }
}
