import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Carousel from '../../components/Carousel'
import getResults from '../../utils/cachedImages'
import type { ImageProps } from '../../utils/types'

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  const router = useRouter()

  const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${currentPhoto.publicId}.${currentPhoto.format}`

  return (
    <>
      <Head>
        <title>Elena Bushell - Photos</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={currentPhoto.index} />
      </main>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async (context) => {
  const results = await getResults();
  const photoId = Number(context.params?.photoId);
  for(const folder of Object.values(results)) {
	for(const photo of Object.values(folder)) {
		if(photo.id === photoId) {
			return {
				props: {
				  currentPhoto: photo,
				},
			  };
		}
	}
  }
  return {
    props: {
      currentPhoto: undefined,
    },
  };
}

export async function getStaticPaths() {
	let fullPaths = []
	const results = await getResults();
	for(const folder of Object.keys(results)) {
		for(const photo of Object.values(results[folder])) {
			// console.log("PHOTO: ", photo);
			const photoId = Number(photo.id);
			fullPaths.push({ params: { photoId:`${photoId}` } })
		}
	}
	
  return {
    paths: fullPaths,
    fallback: false,
  }
}
