interface GetFullName {
  firstName?: string
  lastName?: string
}

export const getFullName = ({ firstName, lastName }: GetFullName) => {
  return `${lastName} ${firstName}`
}