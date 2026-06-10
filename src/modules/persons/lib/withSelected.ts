import type { Person, PersonData } from "../persons.types.js";

export function withSelected(person: PersonData, selected: boolean): Person {
  return {
    ...person,
    selected,
  };
}
