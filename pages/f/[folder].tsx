import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Modal from '../../components/Modal'
import type { ImageProps } from '../../utils/types'
import getResults from '../../utils/cachedImages'
import { useLastViewedPhoto } from "../../utils/useLastViewedPhoto";
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'


const Home: NextPage = ({ images }: { images: {[photoId: string] : ImageProps} }) => {
  const router = useRouter()
  const { photoId, folderId } = router.query
//   const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${currentPhoto.public_id}.${currentPhoto.format}`

  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef?.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);


  const getFolderImages = (): ImageProps[] => {
	return Object.keys(images).map(photoId => images[photoId])
  }

  return (
    <>
      <Head>
        <title>Elena Bushell - { getFolderImages()[0].folderName }</title>
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={getFolderImages()}
            onClose={() => {
              setLastViewedPhoto(photoId as string)
            }}
          />
        )}
        <div className="columns-1 gap-4">
          {getFolderImages().map(({ id, publicId: public_id, format, blurDataUrl, folderId }) => (
            <Link
              key={id}
            //   href={`/?folder=${folderId}&photoId=${id}`}
              href={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="flex justify-center after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:shadow-highlight"
            >
              <Image
                alt="Next.js Conf photo"
                className="transform brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: 'translate3d(0, 0, 0)' }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Not Nothing
      </footer>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async (context) => {
	const results = await getResults()
	const folderId = `${context.params?.folder}`;
	const currentFolder = results[folderId] ?? {};
	return {
	  props: {
		images: currentFolder,
	  },
	}
  }

export async function getStaticPaths() {
	let fullPaths: any[] = []
	const results = await getResults();
	for(const folder of Object.keys(results)) {
		const photo = Object.values(results[folder])[0];
		const folderId = `${ photo.folderId}`;
		fullPaths.push({ params: { folder: folderId } })
	}
  return {
    paths: fullPaths,
    fallback: false,
  }
}
