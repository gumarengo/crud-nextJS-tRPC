import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

type Task = {
    id: string;
    titulo: string;
    descricao?: string;
    dataCriacao: number
}
let tasks: Task[] = [];

export const appRouter = router({
    getTasks: publicProcedure.query(() => {
        return tasks.sort((a, b) => b.dataCriacao - a.dataCriacao);
    }),

    createTask: publicProcedure
        .input(z.object({
            titulo: z.string().min(1, "Titulo é obrigatório"),
            descricao: z.string().optional()
        }))
        .mutation(({ input }) => {
            const newTask: Task = {
                id: crypto.randomUUID(),
                titulo: input.titulo,
                descricao: input.descricao,
                dataCriacao: Date.now()
            };
            tasks.push(newTask);
            return newTask;
        }),

    updateTask: publicProcedure
        .input(z.object({
            id: z.string(),
            titulo: z.string().min(1, "Titulo é obrigatório"),
            descricao: z.string().optional()
        }))
        .mutation(({ input }) => {
            const taskIndex = tasks.findIndex(task => task.id === input.id);
            if (taskIndex === -1) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Tarefa Não Encontrada'
                });
            }
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                titulo: input.titulo,
                descricao: input.descricao
            };
            return tasks[taskIndex];
        }),

    deleteTask: publicProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(({ input }) => {
            const taskExists = tasks.some((t) => t.id === input.id);
            if (!taskExists) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Tarefa Não Encontrada'
                });
            }
            tasks = tasks.filter((t) => t.id !== input.id);
            return { id: input.id };
        })
});

export type AppRouter = typeof appRouter;