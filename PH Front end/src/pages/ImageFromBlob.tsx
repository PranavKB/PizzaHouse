import { useEffect, useState } from 'react';
import { getImage } from '../services/itemService'; 

interface Props {
  imagePath: string;
  alt?: string;
}

const ImageFromBlob: React.FC<Props> = ({ imagePath, alt }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string;

    const fetchImage = async () => {
      const blobUrl = await getImage(imagePath);
      if (blobUrl && isMounted) {
        setImageUrl(blobUrl);
        objectUrl = blobUrl;
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl); // Cleanup blob URL
    };
  }, [imagePath]);

  return (
    <img
      src={imageUrl || '/fallback.png'} // fallback while loading
      alt={alt || 'Item image'}
      style={{ width: '100%', height: 'auto' }}
    />
  );
};

export default ImageFromBlob;
