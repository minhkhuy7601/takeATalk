'use client';

import { CldUploadButton } from 'next-cloudinary';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import { useMutation } from 'react-query';

import useConversation from '@/hooks/useConversation';
import { createNewMessage } from '@/services/api/messages';
import type { MessageType } from '@/types';

import MessageInput from './MessageInput';

const Form = () => {
  const { conversationId } = useConversation();
  const mutation = useMutation({
    mutationFn: (data: MessageType) => {
      return createNewMessage(data);
    },
    // onSuccess: (res) => {
    //   router.reload();
    // },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });
    mutation.mutate({
      ...data,
      conversationId,
    });
  };

  const handleUpload = (result: any) => {
    mutation.mutate({
      image: result.info.secure_url,
      conversationId,
    });
  };

  return (
    <div
      className="
        flex 
        w-full 
        items-center 
        gap-2 
        border-t 
        bg-white 
        p-4 
        lg:gap-4
      "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="x2cdjrku"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full items-center gap-2 lg:gap-4"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="
            cursor-pointer 
            rounded-full 
            bg-sky-500 
            p-2 
            transition 
            hover:bg-sky-600
          "
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
