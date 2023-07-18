import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import * as yup from 'yup';

import useToast from '@/core-ui/toast';
import {useDocumentsStore} from '@/states/useDocuments';
import {ToastContents} from '@/utils/toast-content';

import {IProps} from '../types-create';

interface IFormInputs {
  name: string;
}

const Schema = yup.object().shape({
  name: yup.string().required('Please enter your Document name.')
});

export default function useModalUpdateDocument({onClose}: IProps) {
  const toast = useToast();
  const {error, currentDocument, updateDocument} = useDocumentsStore();

  const {formState, handleSubmit, reset, setValue, ...rest} = useForm<IFormInputs>({
    resolver: yupResolver(Schema),
    mode: 'onChange'
  });

  const {errors, isSubmitting} = formState;
  const submitHandler: SubmitHandler<IFormInputs> = formData => {
    if (isSubmitting) return;
    const id = currentDocument.id;
    const content = String(currentDocument.content);
    updateDocument({id, content, ...formData});
    if (error) {
      toast.show({type: 'danger', title: 'Rename Error', content: ToastContents.ERROR});
    } else {
      toast.show({type: 'success', title: 'Rename Success', content: ToastContents.SUCCESS});
    }
    onClose();
  };

  return {errors, isSubmitting, onSubmit: handleSubmit(submitHandler), ...rest};
}
