import { post } from '../shared/config/api.config';
import { ResponseInterface } from '../shared/interfaces/response.interface';
import { RequestQueryInterface } from "../shared/interfaces/request-query.interface";

export const getStatistics = (houseType: string, quarters: string[]): Promise<ResponseInterface> => {
  const parameters: RequestQueryInterface = {
    query: [
      {
        code: 'Boligtype',
        selection: {
          filter: 'item',
          values: [houseType],
        },
      },
      {
        code: 'ContentsCode',
        selection: {
          filter: 'item',
          values: ['KvPris'],
        },
      },
      {
        code: 'Tid',
        selection: {
          filter: 'item',
          values: quarters,
        },
      },
    ],
    response: {
      format: 'json-stat2',
    },
  };

  return post<ResponseInterface, RequestQueryInterface>('/no/table/07241', parameters);
};
