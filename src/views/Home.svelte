<script>
  import Link from "../lib/common/Link.svelte";
</script>

<h1>Home</h1>
<section>
  <Link path="usersManagement" color="blue">Manage Users</Link>
  <Link path="questionnaireManagement" color="blue">Manage Questionnaires</Link>
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
