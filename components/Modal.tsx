import { Dialog } from '@headlessui/react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import useKeypress from 'react-use-keypress'
import type { ImageProps } from '../utils/types'
import SharedModal from './SharedModal'

export default function Modal({
  images,
  onClose,
}: {
  images: ImageProps[]
  onClose?: () => void
}) {
  let overlayRef = useRef()
  const router = useRouter()

  const { photoIndex } = router.query
  let index = Number(photoIndex)

  const [direction, setDirection] = useState(0)
  const [curIndex, setCurIndex] = useState(index)

  function handleClose() {
    router.replace(`/folder/${images[index].folderId}`, undefined, { shallow: true })
    onClose()
  }

  function changePhotoIndex(newVal: number) {
    if (newVal > index) {
      setDirection(1)
    } else {
      setDirection(-1)
    }
    setCurIndex(newVal)
    router.replace(
      `/folder/${images[index].folderId}/photo/${newVal}`,
	  undefined,
      { shallow: true }
    )
  }

  useKeypress('ArrowRight', () => {
    if (index + 1 < images.length) {
      changePhotoIndex(index + 1)
    }
  })

  useKeypress('ArrowLeft', () => {
    if (index > 0) {
      changePhotoIndex(index - 1)
    }
  })

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoIndex={changePhotoIndex}
        closeModal={handleClose}
        navigation={true}
      />
    </Dialog>
  )
}
