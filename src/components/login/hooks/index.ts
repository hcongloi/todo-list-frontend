/* eslint-disable react-hooks/exhaustive-deps */
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import * as yup from 'yup';

import useLoginHandler from '@/components/login/hooks/login-handler';
import api from '@/data/api';

import useLoginGoogle from './login-google';

interface IFormInputs {
  name: string;
}

// Schema validate form
const Schema = yup.object().shape({
  name: yup.string().required('Please fill in your name').max(32, 'Your name must not exceed 32 letters').trim()
});

export default function useGuestLoginHook() {
  const {openGooglePopUp} = useLoginGoogle();

  // Handle After Login Success | After Login Failed
  const {loginSuccess, loginFailed} = useLoginHandler();
  // Media Query for Todo List Logo in HomePage (@TinTran)
  const {register, handleSubmit, formState} = useForm<IFormInputs>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(Schema)
  });
  // Form Login Onsubmit handler
  const submitHandler: SubmitHandler<IFormInputs> = data => {
    api.auth
      .login(data)
      .then(res => {
        loginSuccess(res.data);
      })
      .catch(() => loginFailed());
  };

  return {onSubmit: handleSubmit(submitHandler), register, formState, openGooglePopUp};
}
