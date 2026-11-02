'use client';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { useState } from 'react';

type Task = {
    id: string;
    titulo: string;
    descricao?: string;
    dataCriacao: number
}

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
    const [msg, setMsg] = useState({ text: '', type: '' });

    const { data: tasks, refetch } = trpc.getTasks.useQuery(undefined, {
        initialData: initialTasks,
    });

    const deleteMutation = trpc.deleteTask.useMutation({
        onSuccess: () => {
            setMsg({ text: 'Tarefa deletada com sucesso!', type: 'success' });
            refetch()
        },
        onError: () => {
            setMsg({ text: 'Erro ao deletar a tarefa.', type: 'error' });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
            deleteMutation.mutate({ id });
        }
    };

    return (
        <div>
            <Link href="/form" className='bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block hover:bg-blue-700'>
                + Nova Tarefa
            </Link>

            {msg.text && (
                <div className={`p-3 mb-4 rounded ${msg.type === 'error' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    {msg.text}
                </div>
            )}
            {tasks.length === 0 ? (
                <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
            ) : (
                <ul className="space-y-3">
                    {tasks.map(task => (
                        <li key={task.id} className="bg-white p-4 rounded shadow flex justify-between items-start border border-gray-200">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{task.titulo}</h3>
                                {task.descricao && <p className="text-gray-600 text-sm">{task.descricao}</p>}
                                <p className="text-sm text-gray-500">Criado em: {new Date(task.dataCriacao).toLocaleString()}</p>
                            </div>
                            <div>
                                <Link href={`/form?id=${task.id}`} className="text-blue-500 mr-5 hover:underline">
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    disabled={deleteMutation.isPending}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                    Deletar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}