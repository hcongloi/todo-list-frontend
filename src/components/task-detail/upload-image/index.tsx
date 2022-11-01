import aws from 'aws-sdk';
import {ManagedUpload, PutObjectRequest} from 'aws-sdk/clients/s3';
import classNames from 'classnames';
import {ChangeEvent, FC} from 'react';
import {useForm} from 'react-hook-form';

import Button from '@/core-ui/button';
import api from '@/data/api';
import {ITaskResponse} from '@/data/api/types/task.type';

import {IPreviewImage} from '../task-image';
import style from './style.module.scss';

aws.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION
});

const s3 = new aws.S3();

type FormValues = {
  images: File[];
};

export interface IUploadImage {
  className?: string;
  taskData: ITaskResponse;
  previewImages: IPreviewImage[];
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onSuccess: () => void;
}

const UploadImage: FC<IUploadImage> = ({taskData, onSuccess, onUpload, previewImages, className}) => {
  const {register, handleSubmit, formState} = useForm<FormValues>();
  const {errors, isSubmitting} = formState;
  console.log('🚀 ~ file: index.tsx ~ line 38 ~ isSubmitting', isSubmitting);

  const onSubmit = handleSubmit(({images}) => {
    if (isSubmitting) return;
    const promises: Promise<any>[] = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const s3ObjectRequest: PutObjectRequest = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Body: image,
        Key: `data/${image.name}`,
        ACL: 'public-read'
      };
      s3.upload(s3ObjectRequest, function (err: Error, response: ManagedUpload.SendData) {
        if (err) console.log('Error', err);
        if (response) {
          console.log('Link image to save in database: ', response.Location);
          console.log(response);
          promises.push(api.task.update({id: taskData.id, images: {add: [{name: image.name, link: response.Location}]}}));
        }
      });
    }
    Promise.all(promises)
      .then(onSuccess)
      .catch(error => console.log(error));
  });

  return (
    <form className={classNames(style.upload, className)} onSubmit={onSubmit}>
      <div className="form-body">
        <Button type="button" className="add">
          <span>Add atachments</span>
          <input {...register('images', {required: true})} type="file" onChange={onUpload} multiple />
        </Button>
        {previewImages.length > 0 && (
          <Button type="submit" color="primary" variant="contained" disabled={isSubmitting} loading={isSubmitting}>
            Upload
          </Button>
        )}
      </div>
      {errors?.images && <p>Image bắt buộc thêm</p>}
    </form>
  );
};

export default UploadImage;
