'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';

export default function TaskForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [error, setError] = useState('');

    const { data: tasks } = trpc.getTasks.useQuery()

    useEffect(() => {
        if (editId && tasks) {
            const task = tasks.find(t => t.id === editId);
            if (task) {
                setTitulo(task.titulo);
                setDescricao(task.descricao || '');
            } else {
                setError('Tarefa não encontrada.');
            }
        }
    }, [editId, tasks]);

    const createMutation = trpc.createTask.useMutation();
    const updateMutation = trpc.updateTask.useMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!titulo) {
            setError('O título é obrigatório.');
            return;
        }

        try {
            if (editId) {
                await updateMutation.mutateAsync({ id: editId, titulo, descricao });
            } else {
                await createMutation.mutateAsync({ titulo, descricao });
            }
            router.push('/');
        } catch (err) {
            setError((err as Error).message || 'Ocorreu um erro ao salvar a tarefa.');
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <main className="max-w-md text-gray-900 mx-auto bg-white p-6 rounded shadow mt-10">
            <h1 className="text-2xl font-bold mb-4">{editId ? 'Editar Tarefa' : 'Criar Tarefa'}</h1>

            {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Título</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2 focus:outline-blue-500"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <textarea
                        value={descricao}
                        rows={3}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="w-full border rounded p-2 focus:outline-blue-500"
                    />
                </div>

                <div className="flex justify-between items-center mt-2">
                    <Link href="/" className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Cancelar</Link>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isPending ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </main>
    )
}