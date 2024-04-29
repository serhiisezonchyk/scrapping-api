import z from 'zod';

export const parseSchema = z.object({
  url: z.string({ required_error: 'Url is requred' }).url('Please enter a valid URL'),
});
