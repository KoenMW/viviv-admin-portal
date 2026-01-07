<script>
  import Link from "../lib/common/Link.svelte";
</script>

<h1>Home</h1>
<section>
  <Link path="users" color="blue">Manage Users</Link>
  <Link path="questionnaires" color="blue">Manage Questionnaires</Link>
  <Link path="results" color="blue">View Results</Link>
</section>

<style>
  section {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
