export type PersonData = {
  id: number;
  age: number;
  name: string;
};

export type Person = PersonData & {
  selected: boolean;
};

export type PersonsQueryParams = {
  page?: unknown;
  limit?: unknown;
  id?: unknown;
};

export type ParsedPersonsQuery = {
  page: number;
  limit: number;
  offset: number;
  id?: string;
};

export type PersonsDataPage = {
  items: PersonData[];
  hasNext: boolean;
};

export type PersonsPage = {
  items: Person[];
  hasNext: boolean;
};

export type CreatePersonParams = {
  id: number;
};

export type UpdatePersonSelectedParams = {
  id: number;
  selected: boolean;
};

export type ReorderSelectedPersonsParams = {
  ids: number[];
};
