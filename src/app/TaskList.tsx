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
            setMsg({ text: 'Task deleted successfully!', type: 'success' });
            refetch()
        },
        onError: () => {
            setMsg({ text: 'Error deleting task.', type: 'error' });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteMutation.mutate({ id });
        }
    };

    return (
        <div>
            <Link href="/form" className='bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block hover:bg-blue-700'>
                + New Task
            </Link>

            {msg.text && (
                <div className={`p-3 mb-4 rounded ${msg.type === 'error' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    {msg.text}
                </div>
            )}
            {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks found.</p>
            ) : (
                <ul className="space-y-3">
                    {tasks.map(task => (
                        <li key={task.id} className="bg-white p-4 rounded shadow flex justify-between items-start border border-gray-200">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{task.titulo}</h3>
                                {task.descricao && <p className="text-gray-600 text-sm">{task.descricao}</p>}
                                <p className="text-sm text-gray-500">Created at: {new Date(task.dataCriacao).toLocaleString()}</p>
                            </div>
                            <div>
                                <Link href={`/form?id=${task.id}`} className="text-blue-500 mr-5 hover:underline">
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    disabled={deleteMutation.isPending}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}