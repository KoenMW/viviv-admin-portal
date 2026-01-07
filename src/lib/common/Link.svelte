<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Paths } from "../../stores/router";
  import type { MPHColors } from "../../types";

  type Props = {
    path: Paths;
    color: MPHColors;
    children: Snippet;
  };

  type PartialProps = Partial<{
    params: Record<string, string>;
    width: "auto" | "100%";
  }>;

  const {
    path,
    children,
    params,
    color,
    width = "auto",
  }: Props & PartialProps = $props();

  const paramsToString = (p: Record<string, string> | undefined) => {
    if (!p) return "";
    let s = "";
    for (const i in p) {
      s += `&${i}=${p[i]}`;
    }
    return s;
  };
</script>

<a
  href="?route={path}{paramsToString(params)}"
  style="{color && `--color: var(--c-${color})`}; width: {width}"
  >{@render children()}</a
>

<style>
  a:hover {
    scale: 1.05;
    border-color: transparent;
  }

  a:active {
    scale: 0.95;
  }
</style>
