export function formatPersonName(person: {
  lastName: string;
  firstName: string;
}): string {
  return `${person.lastName}, ${person.firstName}`;
}
