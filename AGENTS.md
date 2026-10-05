<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- Serve the clinic logo from `public/logo.png` and reference it as the literal
  lowercase path `"/logo.png"`; never import it through a bundled asset module,
  because the deployed host is case-sensitive and a mismatched path breaks the
  header image.
