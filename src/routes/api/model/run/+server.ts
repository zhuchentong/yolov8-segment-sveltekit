import fs from 'node:fs'
import { resolve } from 'node:path'
import { processOutput } from '$lib/process/output'
import { error, json } from '@sveltejs/kit'
import * as ort from 'onnxruntime-node'

let session: ort.InferenceSession

async function loadModel() {
  const modelPath = resolve('./static/models/best.onnx')

  const buffer = await fs.readFileSync(modelPath)
  // 加载模型
  session = await ort.InferenceSession.create(buffer)
}

export async function POST({ request }) {
  const formData = await request.formData()
  const input = formData.get('input') as Blob

  if (!input) {
    throw error(400, 'not found input')
  }

  if (!session) {
    await loadModel()
  }

  const buffer = await input.arrayBuffer()
  const data = new Float32Array(buffer)

  const tensor = new ort.Tensor(data, [1, 3, 640, 640])
  const output = await session.run({
    images: tensor,
  })

  const boxes = processOutput(output, 640, 640)

  return json(boxes)
}
