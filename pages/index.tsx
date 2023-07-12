import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ImageProps, CloudinaryAssets } from "../utils/types";
import getResults from "../utils/cachedImages";
import { imagesInFolder } from "../utils/imagesInFolder";

const Home: NextPage = ({cloudinaryAssets}: {cloudinaryAssets: CloudinaryAssets} ) => {
  	const folderIds = Object.keys(cloudinaryAssets);
	const firstImageInFolder = (folderId: string): ImageProps => {
		return imagesInFolder(cloudinaryAssets[folderId])[0];
	}

	const imageLoader = ({src}) => {
		return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${src}`
	}
  return (
    <>
      <Head>
        <title>Elena Bushell - Personal Website</title>
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <div className="columns-1 gap-4">
          {folderIds.map((folderId: string) => { 
			
			
			return (
            <Link
              key={folderId}
            //   href={`/?folder=${folderId}`}
              href={`/folder/${folderId}`}
              shallow
              className="after:content group relative mb-5 block flex w-full cursor-zoom-in justify-center after:pointer-events-none after:absolute after:inset-0 after:shadow-highlight"
            >
              <Image
                alt="project photo"
                className="transform brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={firstImageInFolder(folderId).blurDataUrl}
                src={`${firstImageInFolder(folderId).publicId}.${firstImageInFolder(folderId).format}`}
				loader={imageLoader}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          )})}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Not Nothing
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await getResults();

  return {
    props: {
		cloudinaryAssets: results,
    },
  };
}
