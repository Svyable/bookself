# Getting Set Up

Bookself starts with a GitHub account because GitHub is where the files and their history live. You can create a free personal account at [github.com/signup](https://github.com/signup). Verify the email address you use for the account, and turn on two-factor authentication. GitHub also supports passkeys if you prefer them. None of this is Bookself-specific; it is simply the identity you will use to own repositories and approve access to them.

You can do the first part of Bookself entirely in a browser. GitHub can create repositories, edit Markdown, make commits, and review pull requests without installing anything on your computer. If that is enough for the way you want to write, stop there. A terminal is useful, not mandatory.

If you want to work from a local Desk, or use a terminal-based agent, install Git and the GitHub CLI. Then authenticate once:

```sh
gh auth login
```

Choose GitHub.com, choose HTTPS unless you already prefer SSH, and use the browser sign-in flow. GitHub CLI can configure Git to use the same credentials, so ordinary commands such as `git pull` and `git push` work without keeping a password or token in a manuscript. You can check the active account later with:

```sh
gh auth status
```

The useful distinction is that **GitHub authentication and AI authentication are separate things**. GitHub decides which repositories you may read or change. ChatGPT, Claude, or OpenCode also need their own account or model-provider credentials. Connecting one of those tools should not require making a private Desk public.

| Tool | Simple Bookself path | What GitHub access means |
|---|---|---|
| **ChatGPT** | In ChatGPT, open **Settings → Apps**, choose GitHub when it is available in your plan or experience, authorize the GitHub app, and select only the repositories you want it to access. | ChatGPT can read the repositories you explicitly authorize. This connection does not require a GitHub Actions workflow. |
| **Claude** | In a Claude chat or Project, use **Add from GitHub** and authorize the repositories you want. Claude Code on the web can also connect through the Claude GitHub App; local Claude Code can simply run inside your checked-out Desk. | The GitHub App gets access only to repositories you grant. A local Claude Code session still uses your local Git/GitHub credentials for Git operations. |
| **OpenCode** | Authenticate the model provider with `opencode auth login` (or `/connect` in the interface), `cd` into your local Desk, and run `opencode`. | For ordinary local Bookself work, Git access comes from the Git credentials already configured on your machine. `opencode github install` is a different, optional automation path that creates a GitHub Actions workflow; Bookself does not require it. |

That last distinction matters. Several coding agents offer GitHub-hosted automation that reacts to issues or pull requests. Those features can be useful, but they are not the Bookself publishing path. In particular, a private Desk should work with zero GitHub Actions minutes. Write and preview locally, use an agent locally or through a direct repository connection if you want one, and prepare releases with Bookself's local release command.

Be conservative with credentials. Prefer browser-based OAuth or GitHub App authorization when a tool offers it. Do not paste personal access tokens, API keys, recovery codes, or model-provider secrets into a book file, issue, pull request, or committed `.env` file. If a tool asks for a broad GitHub token merely to edit a repository that is already cloned locally, it is worth checking whether the normal `gh auth login` or app authorization path is sufficient instead.

For a private Desk, repository access is an explicit trust decision. Grant an AI tool access because you want that tool to read the manuscript, not because Bookself requires the connection. You can use Bookself without connecting any AI service at all.

Official setup references: [creating a GitHub account](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github), [GitHub CLI authentication](https://cli.github.com/manual/gh_auth_login), [connecting GitHub to ChatGPT](https://help.openai.com/en/articles/11145903), [Claude's GitHub integration](https://support.claude.com/en/articles/10167454-use-the-github-integration), [Claude Code on the web](https://code.claude.com/docs/en/web-quickstart), and [OpenCode's CLI](https://opencode.ai/docs/cli/).
