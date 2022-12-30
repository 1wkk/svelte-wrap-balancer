<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { browser } from '$app/environment'

	/**
	 * The HTML tag to use for the wrapper element.
	 * @default 'span'
	 */
	export const as: keyof HTMLElementTagNameMap = 'span'
	/**
	 * The balance ratio of the wrapper width (0 <= ratio <= 1).
	 * 0 means the wrapper width is the same as the container width (no balance, browser default).
	 * 1 means the wrapper width is the minimum (full balance, most compact).
	 * @default 1
	 */
	export const ratio: number = 1

	let wrapper: HTMLElement
	let container: HTMLElement

	let resizeObserver: ResizeObserver

	const id = crypto.randomUUID()

	const SYMBOL_KEY = '__wrap_balancer'

	onMount(() => {
		if (!wrapper) return

		const container = wrapper.parentElement
		if (!container) return

		resizeObserver = new ResizeObserver(() => {
			if (!wrapper) return

			window[SYMBOL_KEY](0, ratio, wrapper)
		})

		resizeObserver.observe(container)
	})

	onDestroy(() => {
		resizeObserver && container && resizeObserver.unobserve(container)
	})

	type RelayoutFn = (id: string | number, ratio: number, wrapper?: HTMLElement) => void

	const relayout: RelayoutFn = (id, ratio, wrapper) => {
		wrapper = wrapper || document.querySelector<HTMLElement>(`[data-br="${id}"]`)

		const container = wrapper.parentElement

		const update = (width: number) => (wrapper.style.maxWidth = width + 'px')

		// Reset wrapper width
		wrapper.style.maxWidth = ''

		// Get the initial container size
		const width = container.clientWidth
		const height = container.clientHeight

		// Synchronously do binary search and calculate the layout
		let left: number = width / 2
		let right: number = width
		let middle: number

		if (width) {
			while (left + 1 < right) {
				middle = ~~((left + right) / 2)
				update(middle)
				if (container.clientHeight === height) {
					right = middle
				} else {
					left = middle
				}
			}

			// Update the wrapper width
			update(right * ratio + width * (1 - ratio))
		}
	}

	const MINIFIED_RELAYOUT_STR = relayout.toString()
	const sp = `<script> window.${SYMBOL_KEY}=${MINIFIED_RELAYOUT_STR};window.${SYMBOL_KEY}("${id}",${ratio}) <\/script>`

	$: {
		browser && wrapper && (window[SYMBOL_KEY] = relayout)(0, ratio, wrapper)
	}
</script>

<svelte:element
	this={as}
	bind:this={wrapper}
	data-br={id}
	data-brr={ratio}
	style="display: inline-block; vertical-align: top; text-decoration: inherit;"
	{...$$restProps}
>
	<slot />
	{@html sp}
</svelte:element>
