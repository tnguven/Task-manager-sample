import { z } from "zod";

export const CreateTaskSchema = z.object({
  body: z.object({
    userId: z.string().transform((arg) => Number(arg)),
    title: z.string(),
    content: z.string(),
  }),
});

export const UpdateTasksPositionSchema = z
  .object({
    body: z.array(
      z.object({
        id: z.string().transform((arg) => Number(arg)),
        position: z.number(),
      }),
    ),
  })
  .refine(
    (input) => {
      return input.body.length > 0 && input.body.length < 40;
    },
    {
      message: "The payload length is 0 or more then 40",
    },
  );
