export type PersonData = {
  id: string;
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
  id: string;
};

export type UpdatePersonSelectedParams = {
  id: string;
  selected: boolean;
};

export type ReorderSelectedPersonsParams = {
  ids: string[];
};
