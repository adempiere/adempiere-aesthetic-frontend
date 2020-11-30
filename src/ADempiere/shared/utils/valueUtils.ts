export function extractPagingToken(token: string): string {
  let onlyToken: string = token.slice(0, -2)
  if (onlyToken.substr(-1, 1) === '-') {
    onlyToken = onlyToken.slice(0, -1)
  }
  return onlyToken
}
