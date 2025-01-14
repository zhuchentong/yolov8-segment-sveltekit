<script lang='ts'>
  import { download } from '$lib/download'
  import { drawBoxes } from '$lib/draw/draw-boxes'
  import { processInput } from '$lib/process/input'
  import { onMount } from 'svelte'

  let loading = $state(false)

  let canvas = $state<HTMLCanvasElement>()
  const images = [
    '/images/01.png',
    '/images/02.png',
    '/images/03.png',
    '/images/04.png',
    '/images/05.png',
    '/images/06.png',
    '/images/07.png',
    '/images/08.png',
    '/images/09.png',
    '/images/10.png',
  ]

  let image = $state(images[0])

  async function loadInput(url: string) {
    const inputBuffer = await download(url)
    return await processInput(inputBuffer)
  }

  async function runModel(data: Float32Array<ArrayBuffer>) {
    const formData = new FormData()
    const blob = new Blob([data.buffer], { type: 'application/octet-stream' })

    formData.append('input', blob)

    const response = await fetch('/api/model/run', {
      method: 'POST',
      body: formData,
    })

    const boxes = await response.json()
    const ctx = canvas?.getContext('2d')
    drawBoxes(boxes, ctx!)
  }

  async function onRender(url: string) {
    loading = true

    if (canvas) {
      try {
        image = url
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, 640, 640)

        const input = await loadInput(url)
        await runModel(input)
      }
      catch (ex) {
        console.error(ex)
      }
      finally {
        loading = false
      }
    }
  }

  onMount(() => {
    if (canvas) {
      canvas.width = 640
      canvas.height = 640
    }
  })

</script>

<main class='absolute inset-0 flex flex-col'>
  <h1 class='absolute left-20px top-10px text-#fff z-10'>FDI牙位标识</h1>
  <div class='flex-auto relative'>
    <div class='absolute inset-0 flex justify-center items-center bg-#333'>
      <div class='w-640px overflow-hidden relative'>
        <img src={image} class='w-full h-auto' alt='current' />
        <canvas bind:this={canvas} class='absolute left-0 top-0'></canvas>
      </div>
    </div>
  </div>
  <div class='py-2 overflow-auto bg-#fff'>
    <div class='flex items-center image-list'>
      {#each images as url (url)}
        <button onclick={() => onRender(url)} class='image-item cursor-pointer text-0 px-1'>
          <img class:active={image === url} src={url} class='w-200px h-auto' alt='list item'>
        </button>
      {/each}
    </div>
  </div>
  {#if loading}
    <div class='absolute inset-0 z-100 bg-#000A text-#fff flex-col flex space-y-4 items-center justify-center'>
      <svg aria-hidden='true' class='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor' />
        <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill' />
      </svg>
      <div>牙位标识中...</div>
    </div>
  {/if}
</main>

<style scoped>
  .image-list img {
    border: solid 2px #000;
    border-radius: 5px;
    overflow: hidden;
  }

  .image-list img.active {
    border-color: red;
  }
  </style>
