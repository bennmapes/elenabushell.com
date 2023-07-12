import Image from 'next/image'
import { useRouter } from 'next/router'
import useKeypress from 'react-use-keypress'
import type { ImageProps } from '../utils/types'
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto'
import { imagePropsFromIndex } from '../utils/imagesInFolder'
import SharedModal from './SharedModal'
import { useState } from 'react'

export default function Carousel({
  index,
  currentPhoto,
  images,
}: {
  index: number
  currentPhoto: ImageProps
  images: ImageProps[]
}) {
  const router = useRouter()
  const [, setLastViewedPhoto] = useLastViewedPhoto();
  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(index)

  function closeModal() {
    setLastViewedPhoto(currentPhoto.id)
    router.push(`/folder/${currentPhoto.folderId}`, undefined, { shallow: true })
  }

  function changePhotoIndex(newVal: number) {
    if (newVal > index) {
      setDirection(1)
    } else {
      setDirection(-1)
    }
    setCurIndex(newVal)
    router.push(
      {
        query: { photoIndex: newVal },
      },
      `/folder/${images[index].folderId}/photo/${newVal}`,
      { shallow: true }
    )
  }


  useKeypress('Escape', () => {
    closeModal()
  })

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <button
        className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
        onClick={closeModal}
      >
        {/* <Image
          src={images[curIndex].blurDataUrl}
          className="pointer-events-none h-full w-full"
          alt="blurred background"
          fill
          priority={true}
        /> */}
      </button>
      <SharedModal
        index={curIndex}
        direction={direction}
        changePhotoIndex={changePhotoIndex}
        currentPhoto={currentPhoto}
        closeModal={closeModal}
		images={images}
        navigation={true}
      />
    </div>
  )
}
