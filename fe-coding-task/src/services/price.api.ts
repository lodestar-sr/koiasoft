import { get } from '../../shared/api';
import { BreedListModel } from '../../shared/models/breed-list.model';
import { ResponseInterface } from '../../shared/interfaces/response.interface';

export const getBreedListApi = (): Promise<
  ResponseInterface<BreedListModel>
> => {
  return get<ResponseInterface<BreedListModel>>('/breeds/list/all');
};

export const getBreedImageApi = (
  breed: string
): Promise<ResponseInterface<string>> => {
  return get<ResponseInterface<string>>(`/breed/${breed}/images/random`);
};
