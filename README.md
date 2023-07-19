# Svelte Wrap Balancer

Svelte port of [React Wrap Balancer](https://github.com/shuding/react-wrap-balancer).

Svelte Wrap Balancer is a simple Svelte Component that makes your titles more readable in different viewport sizes. It improves the wrapping to avoid situations like single word in the last line, makes the content more “balanced”:

![](https://i.imgur.com/2LWVkXk.gif)

## Installation

```bash
npm install svelte-wrap-balancer
```

## Usage

```svelte
<script>
	import Balancer from 'svelte-wrap-balancer'
</script>

<h1>
	<Balancer>Svelte Wrap Balancer</Balancer>
</h1>
```

## License

MIT
