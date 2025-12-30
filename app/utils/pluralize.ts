const pluralize = (wordWithoutLastLetter: string, count: number) => {
  return count > 1 ? wordWithoutLastLetter + 's' : wordWithoutLastLetter
}
export default pluralize
