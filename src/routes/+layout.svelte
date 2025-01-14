<script lang='ts'>
  import '../app.css'
  import '@unocss/reset/tailwind.css'
  import 'uno.css'

  const { children } = $props()
</script>

{@render children()}
