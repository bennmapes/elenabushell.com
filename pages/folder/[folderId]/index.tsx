import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Modal from '../../../components/Modal'
import type { ImageFolder, ImageProps } from '../../../utils/types'
import getResults from '../../../utils/cachedImages'
import { useState } from 'react'
import React from 'react'
import { imagesInFolder } from '../../../utils/imagesInFolder'


const Home: NextPage = ({ images }: { images: ImageFolder }) => {
//   const router = useRouter()
//   const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${currentPhoto.public_id}.${currentPhoto.format}`

//   const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

//   const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

//   useEffect(() => {
//     // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
//     if (lastViewedPhoto && !photoId) {
//       lastViewedPhotoRef?.current?.scrollIntoView({ block: "center" });
//       setLastViewedPhoto(null);
//     }
//   }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head key="folder">
        <title key="title">Elena Bushell - { imagesInFolder(images)[0].folderName }</title>
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {/* {photoId && (
          <Modal
            images={imagesInFolder(images)}
            onClose={() => {
              setLastViewedPhoto(Number(photoId))
            }}
          />
        )} */}
        <div className="columns-1 gap-4">
          {imagesInFolder(images).map(({ id, publicId: public_id, format, blurDataUrl, folderId, index }) => (
            <Link
              key={id}
            //   href={`/?folder=${folderId}&photoId=${id}`}
              href={`/folder/${folderId}/photo/${index}`}
            //   ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="flex justify-center after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:shadow-highlight"
            >
              <Image
                alt="Picutre of folder cover"
                // className="transform brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: 'translate3d(0, 0, 0)' }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
				unoptimized={true}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              >
			  </Image>
			  {/* <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-white bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-40"></div> */}

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
	const folderId = `${context.params?.folderId}`;
	const currentFolder: ImageFolder = results[folderId] ?? {};
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
		fullPaths.push({ params: { folderId } })
	}
  return {
    paths: fullPaths,
    fallback: false,
  }
}
