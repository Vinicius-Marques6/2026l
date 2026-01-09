<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Login Page</Card.Title>
    <Card.Description
      >Welcome back! Please log in to your account.</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <form method="post">
      <Button type="submit">Sign in with Google</Button>
    </form>
  </Card.Content>
</Card.Root>
