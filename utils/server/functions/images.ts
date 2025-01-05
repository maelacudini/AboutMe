'use server'
import fs from 'node:fs/promises';
import { getPlaiceholder } from 'plaiceholder';
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export async function generateBlurDataURL(imagePath: string | StaticImport): Promise<string> {
  const buffer = await fs.readFile(`./public/${imagePath}`)
  const { base64 } = await getPlaiceholder(buffer)

  return base64
}

export const getImageWithPlaiceholder = async (src: string) => {
  const buffer = await fetch(src).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer, { size: 10 });

  return {
    ...plaiceholder,
    img: { src, height, width },
  };
};