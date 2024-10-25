const GITFORMAT = `--pretty=format:{
  "commit": "%h",
  "parent": "%p",
  "refs": "%D",
  "subject": "%s",
  "notes": "%N",
  "body": "%b",
  "author": { "name": "%aN", "email": "%aE", "date": "%ad" },
  "commiter": { "name": "%cN", "email": "%cE", "date": "%cd" }
 },`
export const git_log = async (
  from: string | undefined,
  to = 'HEAD',
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<any[]> => {
  // https://git-scm.com/docs/pretty-formats
  const r = await Bun.spawn([
    'git',
    '--no-pager',
    'log',
    `${from ? `${from}...` : ''}${to}`,
    GITFORMAT,
    //'--name-status',
    '--date=iso',
  ])
  const text = await new Response(r.stdout).text()
  console.log(text)
  r /* eturn text
    .split('----\n')
    .splice(1)
    .map((line) => {
      const [firstLine, , ..._body] = line.split('\n')
      const [message, shortHash, authorName, date, authorEmail] =
        firstLine.split('|')
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const r: any = {
        date,
        message,
        shortHash,
        author: { name: authorName, email: authorEmail },
        body: _body.join('\n'),
      }
      return r
    }) */
}
