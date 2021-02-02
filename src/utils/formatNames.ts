export const capitalizeName = (name: string): String => {
  const regExp = new RegExp(/(\b[a-z](?!\s))/g)
  const lowerCasedString = name.toLowerCase()
  return lowerCasedString.replace(regExp, (c) => c.toUpperCase())
}
