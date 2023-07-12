import type { GetStaticProps, NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Carousel from '../../../../../components/Carousel'
import getResults from '../../../../../utils/cachedImages'
import type { ImageProps } from '../../../../../utils/types'

const Home: NextPage = ({ currentPhoto, imagesInFolder }: { currentPhoto: ImageProps, imagesInFolder: ImageProps[] }) => {

  const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${currentPhoto.publicId}.${currentPhoto.format}`
	
  return (
    <>
      <Head>
        <title key="title">Elena Bushell - Photos</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={currentPhoto.index} images={imagesInFolder} />
      </main>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async (context) => {
  const results = await getResults();
  const photoId = Number(context.params?.photoIndex);
  for(const folder of Object.keys(results)) {
	for(const photo of Object.values(results[folder])) {
		if(photo.id === photoId) {
			return {
				props: {
				  currentPhoto: photo,
				  imagesInFolder: Object.values(results[folder])
				},
			};
		}
	}
  }
  throw new Error(`Unable to find photo with photoId=${photoId}`);
}

export async function getStaticPaths() {
	let fullPaths: any[] = []
	const results = await getResults();
	for(const folder of Object.keys(results)) {
		for(const photo of Object.values(results[folder])) {
			// console.log("PHOTO: ", photo);
			const photoIndex = Number(photo.id);
			fullPaths.push({ params: { photoIndex:`${photoIndex}`, folderId:`${folder}` } })
		}
	}
	
  return {
    paths: fullPaths,
    fallback: false,
  }
}
